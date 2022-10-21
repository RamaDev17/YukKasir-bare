import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import { getDatabase, onValue, orderByChild, orderByValue, ref, set } from 'firebase/database';
import { appFirebase } from '../config/firebase';

export const CREATE_REPORT = 'CREATE_REPORT';
export const GET_REPORT = 'GET_REPORT';

const db = getDatabase();

appFirebase;

export const createReport = (datas) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, CREATE_REPORT);

    if (datas) {
      // write realtime database
      set(ref(db, 'reports/' + datas.idTransaksi), datas);
      dispatchSuccess(dispatch, CREATE_REPORT, datas);
    } else {
      dispatchSuccess(dispatch, CREATE_REPORT, datas);
    }
  };
};

// export const getProducts = (search, barcode) => {
//   return (dispatch) => {
//     // loading
//     dispatchLoading(dispatch, GET_PRODUCT);

//     // get realtime database database
//     if (search) {
//       database()
//         .ref('products')
//         .orderByChild(barcode ? 'id' : 'nameProduct')
//         .startAt(barcode ? search : search.toLowerCase())
//         .endAt(barcode ? search : search.toLowerCase() + '\uf8ff')
//         .once('value', (querySnapsot) => {
//           // hasil
//           let data = querySnapsot.val();
//           let dataItem = { ...data };
//           dispatchSuccess(dispatch, GET_PRODUCT, dataItem);
//         })
//         .catch((err) => {
//           alert(err);
//         });
//     } else {
//       database()
//         .ref('products')
//         .orderByValue()
//         .once('value', (querySnapsot) => {
//           // hasil
//           let data = querySnapsot.val();
//           let dataItem = { ...data };
//           dispatchSuccess(dispatch, GET_PRODUCT, dataItem);
//           storeData('products', dataItem);
//         })
//         .catch((err) => {
//           alert(err);
//         });
//     }
//   };
// };
