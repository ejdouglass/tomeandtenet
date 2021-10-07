import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function ManageDeck(props) {
    const history = useHistory();
    const [deckDetails, setDeckDetails] = useState({
        name: '',
        description: '',
        tags: '',
        id: undefined,
        cards: []
    });
    const [newCard, setNewCard] = useState({
        id: undefined,
        type: 'flashcard',
        prompt: [''],
        explanation: ['']
    });


    function handleCardCreation() {
        alert(`BEHOLD YOUR NEW CARD: ${JSON.stringify(newCard)}`);
    }

    function addBlank() {
        setNewCard({...newCard, explanation: [...newCard.explanation, '']});
    }


    useEffect(() => {
        if (props?.location?.state?.deck) {
            setDeckDetails(props.location.state.deck);
        }
    }, [props.location.state]);

    useEffect(() => {
        return setNewCard({...newCard, prompt: [''], explanation: ['']});
    }, [newCard.type]);

    /*
        DESIGN THOUGHTS
        -- maybe have name/desc be on a single line for wider screens
        -- 'Save Deck' btn eventually, but any deck created with certain terms is auto-saved on component unloading
        -- bottom area is JUST for making cards for this deck
    */

    return (
        <div style={{width: '100vw', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem'}}>
            <button style={{margin: '0.5rem', padding: '1rem'}} onClick={() => history.push('/decks')}>Back to Decks</button>
            <div style={{display: 'flex', position: 'relative', width: '80%', justifyContent: 'center', border: '1px solid red'}}>
                <label style={{position: 'absolute', left: '20%'}}>Name</label>
                <input style={{padding: '0.5rem', margin: '1rem'}} type='text' value={deckDetails.name} onChange={e => setDeckDetails({...deckDetails, name: e.target.value})}></input>

                <label style={{position: 'absolute', left: '40%'}}>Description</label>
                <input style={{padding: '0.5rem', width: '50%', margin: '1rem', resize: 'none'}} type='text' value={deckDetails.description} onChange={e => setDeckDetails({...deckDetails, description: e.target.value})}></input>
            </div>

            {/* HERE: create-a-card */}
            <div>
                <h2>Card Type:</h2>
                <button onClick={() => setNewCard({...newCard, type: 'flashcard'})} style={{color: 'white', fontWeight: '600', padding: '0.5rem', background: newCard.type === 'flashcard' ? '#0AF' : 'hsl(225,80%,20%)'}}>Flashcard (Prompt/Explanation)</button>
                <button onClick={() => setNewCard({...newCard, type: 'blanks'})} style={{color: 'white', fontWeight: '600', padding: '0.5rem', background: newCard.type === 'blanks' ? '#0AF' : 'hsl(225,80%,20%)'}}>Fill-in-the-Blanks</button>
                <button onClick={() => setNewCard({...newCard, type: 'mc'})} style={{color: 'white', fontWeight: '600', padding: '0.5rem', background: newCard.type === 'mc' ? '#0AF' : 'hsl(225,80%,20%)'}}>Multiple Choice</button>
            </div>

            {newCard.type === 'flashcard' &&
                <div style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', width: '80%', alignItems: 'center'}}>
                    <textarea autoFocus={true} rows={2} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%', marginBottom: '1rem'}} type='text' placeholder={'Prompt'} value={newCard.prompt[0]} onChange={e => setNewCard({...newCard, prompt: [e.target.value]})}></textarea>
                    <textarea rows={4} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Explanation'} value={newCard.explanation[0]} onChange={e => setNewCard({...newCard, explanation: [e.target.value]})}></textarea>
                </div>
            }

            {/* AKSHULLY... maybe let's leave this out for now, and can add back in later when feelin' fancy */}
            {newCard.type === 'blanks' &&
                <div style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    FILL IN THE BLANKS
                    <textarea autoFocus={true} rows={5} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%', marginBottom: '1rem'}} type='text' placeholder={'Prompt'} value={newCard.prompt[0]} onChange={e => setNewCard({...newCard, prompt: [e.target.value]})}></textarea>
                    <button style={{width: '150px', padding: '0.5rem'}} onClick={addBlank}>ADD BLANK!</button>
                    {newCard.explanation.map((explanation, index) => (
                        <textarea rows={4} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Blank answer'} value={explanation} onChange={e => setNewCard({...newCard, explanation: [...newCard.explanation.slice(0, index), e.target.value, ...newCard.explanation.slice(index + 1)]})}></textarea>
                    ))}
                </div>
            }

            {newCard.type === 'mc' && 
                <div>
                    MULTIPLE CHOICE<br/>
                    <textarea autoFocus={true} rows={2} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%', marginBottom: '1rem'}} type='text' placeholder={'Question'} value={newCard.prompt[0]} onChange={e => setNewCard({...newCard, prompt: [e.target.value]})}></textarea>
                    <textarea rows={3} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Answer 1'} value={newCard.explanation[0]} onChange={e => setNewCard({...newCard, explanation: [e.target.value, ...newCard.explanation.slice(1)]})}></textarea>                    
                    <textarea rows={3} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Answer 2'} value={newCard.explanation[1]} onChange={e => setNewCard({...newCard, explanation: [...newCard.explanation.slice(0,1), e.target.value, ...newCard.explanation.slice(2)]})}></textarea>                    
                    <textarea rows={3} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Answer 3'} value={newCard.explanation[2]} onChange={e => setNewCard({...newCard, explanation: [...newCard.explanation.slice(0,2), e.target.value, ...newCard.explanation.slice(3)]})}></textarea>                    
                    <textarea rows={3} style={{resize: 'none', padding: '0.5rem', fontSize: '1.3rem', width: '80%'}} type='text' placeholder={'Answer 4'} value={newCard.explanation[3]} onChange={e => setNewCard({...newCard, explanation: [...newCard.explanation.slice(0,3), e.target.value]})}></textarea>                    
                </div>
            }

            
            <button onClick={handleCardCreation} style={{padding: '0.5rem', fontSize: '1.2rem', fontWeight: '600', letterSpacing: '3px', background: '#0AF', color: 'white', margin: '1rem', border: '0', borderRadius: '1rem'}}>Create Card</button>
        </div>
    )
}