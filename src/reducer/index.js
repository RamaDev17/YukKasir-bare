import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ProductReducer from './product';
import PrinterReducer from './printer';
import ReportReducer from './report';

const rootReducer = combineReducers({
  AuthReducer,
  ProductReducer,
  PrinterReducer,
  ReportReducer,
});

export default rootReducer;
