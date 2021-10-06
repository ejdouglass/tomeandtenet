import React, { createContext, useReducer } from 'react';

export const actions = {
    DO_THING: 'do_thing'
};

export const Reducer = (state, action) => {
    switch (action.type) {
        case actions.DO_THING: {
            return state;
        }
        default:
            return state;
    }
};

const initialState = {
    username: undefined,
    url: '/',
    
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