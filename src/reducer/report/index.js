import { CREATE_REPORT, GET_REPORT } from '../../actions/reportActions';

const initialState = {
  createreportLoading: false,
  createreportResult: false,
  createreportError: false,

  getreportLoading: false,
  getreportResult: false,
  getreportError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_REPORT:
      return {
        ...state,
        createreportLoading: action.payload.loading,
        createreportResult: action.payload.data,
        createreportError: action.payload.errorMessage,
      };
    case GET_REPORT:
      return {
        ...state,
        getreportLoading: action.payload.loading,
        getreportResult: action.payload.data,
        getreportError: action.payload.errorMessage,
      };

    default:
      return state;
      break;
  }
}
