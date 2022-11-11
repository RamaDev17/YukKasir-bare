import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ProductReducer from './product';
import PrinterReducer from './printer';
import ReportReducer from './report';
import PenjualanReducer from './penjualan';

const rootReducer = combineReducers({
  AuthReducer,
  ProductReducer,
  PrinterReducer,
  ReportReducer,
  PenjualanReducer,
});

export default rootReducer;
