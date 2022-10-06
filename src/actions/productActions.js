import { getDatabase, onValue, ref, set } from 'firebase/database';
import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';

export const CREATE_PRODUCT = "CREATE_PRODUCT"
export const GET_PRODUCT = "GET_PRODUCT"

export const createProduct = (datas) => {
    return (dispatch) => {
        // loading

        if (datas) {
            dispatchLoading(dispatch, CREATE_PRODUCT)
            const newData = {
                id: datas.id,
                nameProduct: datas.nameProduct,
                category: datas.category,
                price: datas.price,
                stock: datas.stock
            }
            // write firebase
            const db = getDatabase();
            set(ref(db, '/products/' + newData.id), newData)
                .then(res => {
                    dispatchSuccess(dispatch, CREATE_PRODUCT, newData)
                })
                .catch(err => {
                    dispatchError(dispatch, CREATE_PRODUCT, err.message)
                })
        } else {
            dispatchSuccess(dispatch, CREATE_PRODUCT, datas)
        }


    }
}

export const getProducts = (search) => {
    return (dispatch) => {
        // loading
        dispatchLoading(dispatch, GET_PRODUCT);

        // get database firebase
        if (search) {
            
        } else {
            const db = getDatabase();
            const starCountRef = ref(db, '/products/');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                dispatchSuccess(dispatch, GET_PRODUCT, data)
            })
        }
    }
}