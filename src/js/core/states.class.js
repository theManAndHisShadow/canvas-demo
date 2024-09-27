/**
 * Helper class for managing UI class states
 * implements reactive behavior in other parts of the project.
 */
export class StateManager {
    #states = {};
    #listeners = [];

    constructor() {
        /**
         * Your advertisement could be here ;)
         */
    }



    /**
     * Allows to set a callback function when the state of the main object of StateManager changes
     * @param {Function} listener - callback function
     */
    subscribe(listener) {
        this.#listeners.push(listener);
    }

    

    /**
     * Updates value of key at state object.
     * Only this methods has write access to state objects
     * @param {string} key - target keyof states object
     * @param {any} newValue - new value/state
     */
    setState(key, newValue) {
        let oldValue = this.#states[key];
        
        this.#states[key] = newValue;
        this.#listeners.forEach(listener => listener(key, newValue, oldValue));
    }



    /**
     * Reads value/state of target key 
     * @param {string} key - target key
     * @returns {any} - state/value of key
     */
    getState(key) {
        return this.#states[key];
    }
}