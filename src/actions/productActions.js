import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { db } from '../App';

export const CREATE_PRODUCT = "CREATE_PRODUCT"
export const GET_PRODUCT = "GET_PRODUCT"

export const createProduct = (datas) => {
    return async (dispatch) => {
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

            // write firestore
            await setDoc(doc(db, "products", newData.id), newData)
                .then(res => {
                    console.log(res);
                    dispatchSuccess(dispatch, CREATE_PRODUCT, { create: true })
                })
                .catch(err => {
                    console.log(err);
                    dispatchError(dispatch, CREATE_PRODUCT, { create: false })
                })

        } else {
            dispatchSuccess(dispatch, CREATE_PRODUCT, datas)
        }


    }
}

export const getProducts = (search) => {
    return async (dispatch) => {
        // loading
        dispatchLoading(dispatch, GET_PRODUCT);

        // get database firebase
        if (search) {
            let dataSearch = []
            const q = query(collection(db, 'products'), where("nameProduct", "==", search))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                dataSearch.push(doc.data())
            });
            dispatchSuccess(dispatch, GET_PRODUCT, dataSearch)
        } else {
            let newData = []
            const querySnapshot = await getDocs(collection(db, "products")).catch(err => console.log(err))
            querySnapshot.forEach((doc) => {
                newData.push(doc.data())
            });
            dispatchSuccess(dispatch, GET_PRODUCT, newData)
        }
    }
}