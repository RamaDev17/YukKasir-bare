import { GET_PENJUALAN, CREATE_PENJUALAN } from '../../actions/penjualanActions';
const initialState = {
  createPenjualantLoading: false,
  createPenjualanResult: false,
  createPenjualanError: false,

  getPenjualanLoading: false,
  getPenjualanResult: false,
  getPenjualanError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_PENJUALAN:
      return {
        ...state,
        createPenjualantLoading: action.payload.loading,
        createPenjualanResult: action.payload.data,
        createPenjualanError: action.payload.errorMessage,
      };
    case GET_PENJUALAN:
      return {
        ...state,
        getPenjualanLoading: action.payload.loading,
        getPenjualanResult: action.payload.data,
        getPenjualanError: action.payload.errorMessage,
      };

    default:
      return state;
      break;
  }
}
