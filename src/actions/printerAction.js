import { dispatchLoading, dispatchSuccess } from '../utils/dispatch';

export const PRINTER_STATUS = 'PRINTER_STATUS';

export const printerStatus = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, PRINTER_STATUS);
    dispatchSuccess(dispatch, PRINTER_STATUS, { status: true });
  };
};
