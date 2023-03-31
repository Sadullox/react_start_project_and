import { combineReducers } from 'redux'
import { authReducer } from "./reduxer/auth";

const RootReducer = combineReducers({
    auth:authReducer
});


export default RootReducer;