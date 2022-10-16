import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDbmGuBcFnNGXGrXmw3WMCbHZxDaXDOQlc',
  authDomain: 'rnyukkasir.firebaseapp.com',
  databaseURL: 'https://rnyukkasir-default-rtdb.firebaseio.com',
  projectId: 'rnyukkasir',
  storageBucket: 'rnyukkasir.appspot.com',
  messagingSenderId: '164194360457',
  appId: '1:164194360457:web:0414d30de45f1c1324ba58',
};

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig);
