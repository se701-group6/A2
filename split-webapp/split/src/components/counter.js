import React from 'react';
import { increment } from '../redux/actions';
import { connect } from 'react-redux';


function Counter({ count, increment }) {
  return (
    <div>
        <button onClick={increment}>+</button>
        <span>{count.toString()}</span>
    </div>
  );
}


  // This code connects TodoPage to the Redux store.
// -------------------------------------------------------------
/**
 * This function will configure the ToDoPage to have the to-do list from the Redux store
 * accessible via a prop called "todos".
 * 
 * @param state The entire Redux state tree
 */
function mapStateToProps(state) {
    return {
      count: state.count
    };
  }

/**
 * This object will configure the ToDoPage to have a property called "setTodoComplete".
 * That property will be a function which will dispatch the Redux action with the same name
 * to the store.
 */
const mapDispatchToProps = {
    increment
}

// Applies the config using the "connect" higher-order component provided by Redux
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
// -------------------------------------------------------------


