import { combineReducers } from 'redux';
import count from './count';
import stubReducer from './otherReducer';

export default combineReducers({
    count,
    stubReducer
});
