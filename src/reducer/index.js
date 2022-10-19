import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ProductReducer from './product';
import PrinterReducer from './printer';

const rootReducer = combineReducers({ AuthReducer, ProductReducer, PrinterReducer });

export default rootReducer;
