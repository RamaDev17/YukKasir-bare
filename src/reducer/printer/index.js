import { PRINTER_STATUS } from '../../actions/printerAction';

const initialState = {
  printerLoading: false,
  printerResult: false,
  printerError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRINTER_STATUS:
      return {
        ...state,
        printerLoading: action.payload.loading,
        printerResult: action.payload.data,
        printerError: action.payload.errorMessage,
      };

    default:
      return state;
      break;
  }
}
