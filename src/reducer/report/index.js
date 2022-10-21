import { CREATE_REPORT } from '../../actions/reportActions';

const initialState = {
  createreportLoading: false,
  createreportResult: false,
  createreportError: false,
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

    default:
      return state;
      break;
  }
}
