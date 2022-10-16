import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ProductReducer from './product';

const rootReducer = combineReducers({ AuthReducer, ProductReducer });

export default rootReducer;
