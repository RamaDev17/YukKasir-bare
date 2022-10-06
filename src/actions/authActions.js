import { dispatchError, dispatchLoading, dispatchSuccess } from '../utils/dispatch';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { storeData } from '../utils/localStorage';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';

export const registerUser = (data, password) => {
  return (dispatch) => {
    // loading
    dispatchLoading(dispatch, REGISTER_USER);
    // firebase
    if ((data, password)) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, data.email, password)
        .then((res) => {
          // ambil uid buat data baru
          let dataBaru = {
            ...data,
            uid: res.user.uid,
          };
          // simpan ke firebase realtime database
          const db = getDatabase();
          set(ref(db, '/users/' + res.user.uid), dataBaru);
          //   berhasil register
          dispatchSuccess(dispatch, REGISTER_USER, dataBaru);
        })
        .catch((err) => {
          dispatchError(dispatch, err.message);
          alert(err.message);
        });
    }
  };
};

export const loginUser = (email, password) => {
  return (dispatch) => {
    //LOADING
    dispatch({
      type: LOGIN_USER,
      payload: {
        loading: true,
        data: false,
        errorMessage: false,
      },
    });

    // write realtime database


    if ((email, password)) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((success) => {
          const Patch = `users/${success.user.uid}`
          const db = getDatabase()
          const starCountRef = ref(db, Patch)

          onValue(starCountRef, (resDB) => {
            if (resDB.val()) {
              //SUCCESS
              dispatch({
                type: LOGIN_USER,
                payload: {
                  loading: true,
                  data: resDB.val(),
                  errorMessage: false,
                },
              });

              //asyn storage
              storeData('user' ,resDB.val());
            } else {
              dispatch({
                type: LOGIN_USER,
                payload: {
                  loading: false,
                  data: false,
                  errorMessage: 'Data User Tidak Ada',
                },
              });
              alert('Data User Tidak Ada');
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: LOGIN_USER,
            payload: {
              loading: false,
              data: false,
              errorMessage: error.message,
            },
          });
          alert(error.message);
        });
    } else {
      dispatch({
        type: LOGIN_USER,
        payload: {
          loading: false,
          data: false,
          errorMessage: false,
        },
      });
    }
  };
};