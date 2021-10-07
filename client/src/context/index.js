import React, { createContext, useReducer } from 'react';

export const actions = {
    SAVE_DECK: 'save_deck'
};

export const Reducer = (state, action) => {
    switch (action.type) {
        case actions.SAVE_DECK: {
            let newDeckLoad = [...state.decks, action.payload];
            return {...state, decks: newDeckLoad};
        }
        default:
            return state;
    }
};

const initialState = {
    username: undefined,
    url: '/',
    decks: [{name: 'Grinding', description: 'The go-to deck for grinding away at often-as-possible content exposure.', id: 1, tags: 'grind', cards: []}],
    jots: [],
    cards: {},
    resources: []
};

export const Context = createContext(initialState);

export const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};