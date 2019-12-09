import {useState, useEffect} from 'react';

let globalState = {};
let listeners = [];
// actions = kvp of action name, function
let actions = {};


// This useStore can now be used to get the current state ([0]) or dispatch an action ([1])
export const useStore = (shouldListen = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = {...globalState, ...newState};

        for (const listener of listeners) {
            listener(globalState);
        };
    };

    // Gets called whenever a component that uses this hook updates
    useEffect(() => {

        if (shouldListen) {
            // Every component using this custom hook will have its setState function added to the listeners array
            // That way, every component that uses this custom hook can be rerendered when the state changes here
            listeners.push(setState);
        }


        // Remove the listener when the component unmounts
        return () => {
            if (shouldListen) {
                listeners = listeners.filter(li => li !== setState)
            }
        };
    }, [setState, shouldListen]);

    return [globalState, dispatch]
};

// When initStore is called in a store such as product-store, product-store can merge actions and the initialState
// with whatever is currently in the global state
export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = {...globalState, ...initialState}
    }
    actions = {...actions, ...userActions};
}