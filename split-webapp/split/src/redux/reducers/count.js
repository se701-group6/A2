import { INCREMENT } from '../action-types';

const initialState = {
    count: 0
};

export default function count(state = initialState, action) {
    // Perform different things based on the type of action
    switch (action.type) {

       // To add a to-do item, we create a new array containing all elements in the current array,
    // with the new to-do item added onto the end.
    case INCREMENT:
    return {
        count: state.count + 1
      };

    default:
        return state;
    }
}