const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// const User = require('./models/User');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

function rando(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomID(prefix) {
    prefix = prefix ? prefix : 'rnd';
    let dateSeed = new Date();
    let randomSeed = Math.random().toString(36).replace('0.', '');
    // console.log(`Random Seed result: ${randomSeed}`);
    return prefix + dateSeed.getMonth() + '' + dateSeed.getDate() + '' + dateSeed.getHours() + '' + dateSeed.getMinutes() + '' + dateSeed.getSeconds() + '' + randomSeed;
}

function calcDateKey(date) {
    // Returns MM/DD/YYYY, adding a leading '0' where necessary, i.e. 03/07/2021 ; assumes 'today' if no specific date is passed as param
    let dateToKey = date ? date : new Date();
    let monthKey = dateToKey.getMonth() + 1;
    let dateKey = dateToKey.getDate();
    let yearKey = dateToKey.getFullYear();

    return `${(monthKey < 10 ? `0` + monthKey : monthKey)}/${(dateKey < 10 ? `0` + dateKey : dateKey)}/${yearKey}`;
}

function createSalt() {
    return crypto.randomBytes(20).toString('hex');
}

function createHash(password, salt) {
    password = password.length && typeof password === 'string' ? password : undefined;

    if (password && salt) {
        let hash = crypto
            .createHmac('sha512', salt)
            .update(password)
            .digest('hex');

        return hash;
    } else {
        return null;
    }
}

function craftAccessToken(username, id) {
    return jwt.sign({ name: username, userID: id }, process.env.SECRET, { expiresIn: '7d' });
}

function saveUser(user) {
    const filter = { name: user.name };
    const update = { $set: user };
    const options = { new: true, useFindAndModify: false };
    User.findOneAndUpdate(filter, update, options)
        .then(updatedResult => {
            console.log(`${updatedResult.name} has been updated.`);
            // HERE might be a good spot to do the server-user update? user[updatedResult.userID]... though, we'd be pulling stuff we don't want to share, hm
            // nevermind, just do it below
        })
        .catch(err => {
            console.log(`We encountered an error saving the user: ${err}.`);
        });
    
    // we don't need to update the server version of the user in this case of this function being invoked;
    // the server-side character is changed first and passed into this fxn
}


// defunct as of Mongoose 6.0+, which this project apparently uses :P
// const connectionParams = {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// };

// NOTE: DB_HOST in this case is not set up properly yet, so... don't use this server yet :P
mongoose.connect(process.env.DB_HOST)
    .then(() => console.log(`Successfully connected to Study Buddies database.`))
    .catch(err => console.log(`Error connecting to Study Buddies database: ${err}`));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/user/create', (req, res, next) => {
    let { newUser } = req.body;
    console.log(`I have received this newUser: ${JSON.stringify(newUser)}`)
    
    console.log(`Test 1... receiving a user called ${newUser.name} to attempt to create on the backend.`);
 
    // HERE: Make sure newUser.name isn't yet taken (scan DB in characters collection)
    User.findOne({ name: newUser.name })
        .then(searchResult => {
            if (searchResult === null) {
                console.log(`Character name of ${newUser.name} is available! Creating...`);
                const salt = createSalt();
                const hash = createHash(newUser.password, salt);
                let createdUser = new User({
                    name: newUser.name,
                    salt: salt,
                    hash: hash,
                    userID: generateRandomID('usr'),
                    stats: nuStats
                    // HERE, at some point: generate at least a static icon for their character, or iconSheet to animate from
                });

                createdUser.save()
                    .then(freshUser => {
                        const token = craftAccessToken(freshUser.name, freshUser.userID);
                        let userToLoad = JSON.parse(JSON.stringify(freshUser));
                        userToLoad.appState = 'home';
                        delete userToLoad.salt;
                        delete userToLoad.hash;
                        allUsers[userToLoad.name] = userToLoad;
                        // userToLoad.whatDo = 'dashboard';

                        // Can pop a new alert down in the client based off the ECHO here, so we can change that a bit for nuance
                        res.status(200).json({success: true, echo: `${userToLoad.name} is up and ready to go.`, payload: {user: userToLoad, token: token}});
                    })
                    .catch(err => {
                        res.json({success: false, echo: `Something went wrong attempting to save the new character: ${JSON.stringify(err)}`});
                    })
            } else {
                // Name is unavailable! Share the sad news. :P
                res.json({success: false, echo: `That Character Name is already in use. Please choose another.`});
            }
        })
        .catch(err => {
            console.log(err);
            res.json({sucess: false, echo: JSON.stringify(err)});
        });

});

app.post('/user/login', (req, res, next) => {
    if (req.body.userToken !== undefined) {
        const { userToken } = req.body;
        console.log(`Receiving request to log in with a JWT. Processing.`);

        // HERE: handle token login
        const decodedToken = jwt.verify(userToken, process.env.SECRET);
        const { name, userID } = decodedToken;

        // console.log(`It appears we're searching for a user by the name of ${name} and id ${userID}.`);
        User.findOne({ name: name, userID: userID })
            .then(searchResult => {
                if (searchResult === null) {
                    // HERE: handle no such character now
                    console.log(`No such user found. 406 error reported.`);
                    res.status(406).json({type: `failure`, echo: `No such username exists yet. You can create them, if you'd like!`});
                } else {
                    // Token worked! Currently we make a brand-new one here to pass down, but we can play with variations on that later
                    const token = craftAccessToken(searchResult.name, searchResult.userID);
                    const userToLoad = JSON.parse(JSON.stringify(searchResult));
                    delete userToLoad.salt;
                    delete userToLoad.hash;
                    userToLoad.appState = 'home';
                    // if (characters[userToLoad.entityID] !== undefined) characters[userToLoad.entityID].fighting = {main: undefined, others: []};
                    // const alreadyInGame = addCharacterToGame(userToLoad);

                    // if (alreadyInGame) res.status(200).json({type: `success`, echo: `Reconnecting to ${userToLoad.name}.`, payload: {character: characters[userToLoad.entityID], token: token}})
                    // else res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.name} is ready to play.`, payload: {character: userToLoad, token: token}});

                    // console.log(`BACKEND IS LOADING AND SENDING THIS USER DATA: ${JSON.stringify(userToLoad)}`)
                    res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.username} is ready to play.`, payload: {user: userToLoad, token: token}});

                }


            })
            .catch(err => {
                console.log(`Someone had some difficulty logging in with a token: ${err}`);
                res.status(406).json({type: `failure`, echo: `Something went wrong logging in with these credentials.`});
            })        
    }

    if (req.body.userCredentials !== undefined) {
        const { userCredentials } = req.body;
        console.log(`Someone is attempting to log in with these credentials: ${JSON.stringify(userCredentials)}`);

        // HERE: handle credentials login: take userCredentials.charName and userCredentials.password and go boldly:

        User.findOne({ name: userCredentials.name })
            .then(searchResult => {
                if (searchResult === null) {
                    // HERE: handle no such character now
                    res.status(406).json({type: `failure`, echo: `No such character exists yet. You can create them, if you'd like!`});
                } else {
                    let thisHash = createHash(userCredentials.password, searchResult.salt);
                    if (thisHash === searchResult.hash) {
                        // Password is good, off we go!
                        const token = craftAccessToken(searchResult.name, searchResult.userID);
                        let userToLoad = JSON.parse(JSON.stringify(searchResult));
                        delete userToLoad.salt;
                        delete userToLoad.hash;
                        // userToLoad.whatDo = 'dashboard';

                        // This will probably only work a small subset of times, actually; socket disconnection removes the char from the game
                        // const alreadyInGame = addCharacterToGame(charToLoad);

                        // if (alreadyInGame) res.status(200).json({type: `success`, message: `Reconnected to live character.`, payload: {character: characters[charToLoad.entityID], token: token}})
                        // else res.status(200).json({type: `success`, message: `Good news everyone! ${charToLoad.name} is ready to play.`, payload: {character: charToLoad, token: token}});
                        res.status(200).json({type: `success`, echo: `Good news everyone! ${userToLoad.name} is ready to play.`, payload: {user: userToLoad, token: token}});                        


                    } else {
                        // Password is incorrect, try again... if THOU DAREST
                        res.status(401).json({type: `failure`, echo: `The supplied password is incorrect.`});
                    }
                }


            })
            .catch(err => {
                console.log(`Someone had some difficulty logging in: ${err}`);
                res.status(406).json({type: `failure`, message: `Something went wrong logging in with these credentials.`});
            })
    }
});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Study Buddies is loaded and ready to play!`));