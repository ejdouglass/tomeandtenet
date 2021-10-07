import React, { useContext } from 'react';
import { Context } from '../context';
import { useHistory } from 'react-router-dom';

export default function Header() {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();

    // Theeeeeoretically, I could have a useEffect monitor parts of state here and just do a localStorage/back-end save push lickety-splittety when certain elements change
    // Let's try that

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '120px', background: '#0AF', color: 'white'}}>
            
            <div onClick={() => history.push('/')} iam='logo' style={{display: 'flex', width: '120px', height: '80%', background: 'white', marginLeft: '1rem'}}>
                Logo goes here
            </div>

            <div iam='buttonsRow' style={{display: 'flex', justifyContent: 'flex-end', width: 'calc(100% - 320px)', height: '96px'}}>
                <button onClick={() => history.push('/decks')} style={{height: '50%', width: '75px', alignSelf: 'center', marginRight: '1.5rem'}}>Manage Decks</button>
                <button onClick={() => history.push('/resources')} style={{height: '50%', width: '75px', alignSelf: 'center', marginRight: '1.5rem'}}>My Resources</button>
                <button style={{height: '50%', width: '75px', alignSelf: 'center', marginRight: '1.5rem'}}>Study Time!</button>
            </div>

            <div iam='userInfo' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'green', marginRight: '1rem', height: '80%', width: '200px'}}>
                {state?.username || 'Guest'}
            </div>

        </div>
    )
}