
import { CREATE_PRODUCT, GET_PRODUCT } from "../../actions/productActions";

const initialState = {
  createProductLoading: false,
  createProductResult: false,
  createProductError: false,
  
  getProductLoading: false,
  getProductResult: false,
  getProductError: false,

};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_PRODUCT:
      return {
        ...state,
        createProductLoading: action.payload.loading,
        createProductResult: action.payload.data,
        createProductError: action.payload.errorMessage,
      };
    case GET_PRODUCT:
      return {
        ...state,
        getProductLoading: action.payload.loading,
        getProductResult: action.payload.data,
        getProductError: action.payload.errorMessage,
      };

    default:
      return state;
      break;
  }
}