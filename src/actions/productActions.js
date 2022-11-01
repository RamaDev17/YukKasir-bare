import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import { mergeData, storeData } from '../utils/localStorage';
import { getDatabase, onValue, orderByChild, orderByValue, ref, set } from 'firebase/database';
import { appFirebase } from '../config/firebase';
import database from '@react-native-firebase/database';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const GET_PRODUCT = 'GET_PRODUCT';

const db = getDatabase();

appFirebase;

export const createProduct = (datas) => {
  console.log(datas);
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, CREATE_PRODUCT);

    if (datas) {
      const newData = {
        id: datas.id.toLowerCase(),
        nameProduct: datas.nameProduct.toLowerCase(),
        category: datas.category.toLowerCase(),
        purchase: datas.purchase,
        selling: datas.selling,
        stock: datas.stock,
      };

      // write realtime database
      set(ref(db, 'products/' + newData.id), newData);
      dispatchSuccess(dispatch, CREATE_PRODUCT, datas);
    } else {
      dispatchSuccess(dispatch, CREATE_PRODUCT, datas);
    }
  };
};

export const getProducts = (search, barcode) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, GET_PRODUCT);

    // get realtime database database
    if (search) {
      database()
        .ref('products')
        .orderByChild(barcode ? 'id' : 'nameProduct')
        .startAt(barcode ? search : search.toLowerCase())
        .endAt(barcode ? search : search.toLowerCase() + '\uf8ff')
        .once('value', (querySnapsot) => {
          // hasil
          let data = querySnapsot.val();
          let dataItem = { ...data };
          dispatchSuccess(dispatch, GET_PRODUCT, dataItem);
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      database()
        .ref('products')
        .orderByChild('selling')
        .once('value', (querySnapsot) => {
          // hasil
          let data = querySnapsot.val();
          let dataItem = { ...data };
          dispatchSuccess(dispatch, GET_PRODUCT, dataItem);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
};
