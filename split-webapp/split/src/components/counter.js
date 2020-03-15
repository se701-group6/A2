import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import increment from "../redux/actions";

function Counter({ count }) {
  return (
    <div>
      <button type="button" onClick={increment}>
        +
      </button>
      <span>{count.toString()}</span>
    </div>
  );
}

Counter.propTypes = {
  count: PropTypes.number.isRequired
};

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
};

// Applies the config using the "connect" higher-order component provided by Redux
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
// -------------------------------------------------------------
