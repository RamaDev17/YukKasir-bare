import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';

export const PRINTER_STATUS = 'PRINTER_STATUS';

export const printerStatus = (data) => {
  return (dispatch) => {
    dispatchLoading(dispatch, PRINTER_STATUS);
    if (data) {
      dispatchSuccess(dispatch, PRINTER_STATUS, { data });
    } else {
      dispatchError(dispatch, PRINTER_STATUS, true);
    }
  };
};
