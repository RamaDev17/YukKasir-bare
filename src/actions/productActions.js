import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import { storeData } from '../utils/localStorage';
import { getDatabase, onValue, ref, set } from "firebase/database";
import { appFirebase } from '../config/firebase';

export const CREATE_PRODUCT = "CREATE_PRODUCT"
export const GET_PRODUCT = "GET_PRODUCT"

const db = getDatabase()

appFirebase

export const createProduct = (datas) => {
    return (dispatch) => {
        // loading
        dispatchLoading(dispatch, CREATE_PRODUCT)

        if (datas) {
            const newData = {
                id: datas.id,
                nameProduct: datas.nameProduct,
                category: datas.category,
                price: datas.price,
                stock: datas.stock
            }

            // write realtime database
            set(ref(db, 'products/' + newData.id), newData)
            dispatchSuccess(dispatch, CREATE_PRODUCT, datas)
        } else {
            dispatchSuccess(dispatch, CREATE_PRODUCT, datas)
        }
    }
}

export const getProducts = () => {
    return (dispatch) => {
        // loading
        dispatchLoading(dispatch, GET_PRODUCT);

        // get realtime database database
        const referensi = ref(db, '/products/');
        onValue(referensi, (snapshot) => {
            const data = snapshot.val();
            dispatchSuccess(dispatch, GET_PRODUCT, data)
            storeData('products', data)
        })
    }
}