import {useState, useEffect} from 'react';

let globalState = {};
let listeners = [];
let actions = {};

const useStore = () => {
    const setState = useState(globalState)[1];

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


};