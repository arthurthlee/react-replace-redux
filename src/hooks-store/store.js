import {useState, useEffect} from 'react';

let globalState = {};
let listeners = [];
// actions = kvp of action name, function
let actions = {};

export const useStore = () => {
    const setState = useState(globalState)[1];

    const dispatch = actionIdentifier => {
        const newState = actions[actionIdentifier](globalState);
        globalState = {...globalState, ...newState};

        for (const listener of listeners) {
            listener(globalState);
        };
    };

    // Gets called whenever a component that uses this hook updates
    useEffect(() => {
        // Every component using this custom hook will have its setState function added to the listeners array
        // That way, every component that uses this custom hook can be rerendered when the state changes here
        listeners.push(setState);

        // Remove the listener when the component unmounts
        return () => {
            listeners = listeners.filter(li => li !== setState)
        };
    }, [setState]);

    return [globalState, dispatch]
};

export const initStore = (userActions, initialState) => {
    if (intialState) {
        globalState = {...globalState, ...initialState}
    }
    actions = {...actions, ...userActions};
}