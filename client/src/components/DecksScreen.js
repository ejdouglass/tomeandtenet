import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../context';

export default function DecksScreen() {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();

    // Booping a deck below should take the user to the ManageDeck page for that deck

    return (
        <div>
            {state?.decks?.length ? (
                <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center'}}>
                    Your decks:
                    <button style={{width: '70px', padding: '0.5rem', height: '50px'}} onClick={() => history.push('/manage_deck')}>Create a Deck</button>
                    {state.decks.map((deck, index) => <button onClick={() => history.push('/manage_deck', { deck: deck })} style={{width: '70px', padding: '0.5rem', height: '50px'}}>{deck.name}</button>)}
                </div>
            ) : (
                <div>
                    No Decks! Create a deck?
                    <button onClick={() => history.push('/manage_deck')}>Create a Deck</button>
                </div>
            )}
        </div>
    )
}