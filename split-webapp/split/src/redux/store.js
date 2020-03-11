import { createStore  } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import count from './reducers/count';
// import rootReducer from './reducers/combineReducer';

// const store = createStore(rootReducer);
// const store = createStore(rootReducer, composeWithDevTools());
const store = createStore(count, composeWithDevTools());

export default store;
