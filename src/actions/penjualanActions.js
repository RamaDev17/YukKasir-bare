import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import database from '@react-native-firebase/database';

import { appFirebase } from '../config/firebase';
import { tahun } from '../utils/date';

export const CREATE_PENJUALAN = 'CREATE_PENJUALAN';
export const GET_PENJUALAN = 'GET_PENJUALAN';

appFirebase;

export const createPenjualan = (datas) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, CREATE_PENJUALAN);

    if (datas) {
      // write realtime database
      database()
        .ref('penjualan/' + datas.id + tahun)
        .set(datas);
      dispatchSuccess(dispatch, CREATE_PENJUALAN, datas);
    } else {
      dispatchSuccess(dispatch, CREATE_PENJUALAN, datas);
    }
  };
};

export const getPenjualan = () => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, GET_PENJUALAN);
    // get realtime database database
    database()
      .ref('penjualan/')
      .orderByChild(tahun.toString())
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const newData = snapshot.val() ? snapshot.val() : false;
        dispatchSuccess(dispatch, GET_PENJUALAN, newData);
      });
  };
};
