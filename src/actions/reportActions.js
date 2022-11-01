import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import database from '@react-native-firebase/database';

import { appFirebase } from '../config/firebase';

export const CREATE_REPORT = 'CREATE_REPORT';
export const GET_REPORT = 'GET_REPORT';

appFirebase;

export const createReport = (datas) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, CREATE_REPORT);

    if (datas) {
      // write realtime database
      database()
        .ref('reports/' + datas.idTransaksi)
        .set(datas);
      dispatchSuccess(dispatch, CREATE_REPORT, datas);
    } else {
      dispatchSuccess(dispatch, CREATE_REPORT, datas);
    }
  };
};

export const getReports = (limit) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, GET_REPORT);

    // get realtime database database
    if (limit == true) {
      database()
        .ref('reports')
        .on('value', (result) => {
          const newData = result.val();
          dispatchSuccess(dispatch, GET_REPORT, newData);
        });
    } else {
      database()
        .ref('reports')
        .limitToLast(limit)
        .on('value', (result) => {
          const newData = result.val();
          dispatchSuccess(dispatch, GET_REPORT, newData);
        });
    }
  };
};
