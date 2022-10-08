
import Routes from './routes'
import { initializeApp } from 'firebase/app'
import { Provider as StoreProvider } from 'react-redux';
import store from './reducer/store';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCvjpyhIsY0ggiHD_0auXARPdqaSxQSLo",
  authDomain: "yukkasir-505d7.firebaseapp.com",
  projectId: "yukkasir-505d7",
  storageBucket: "yukkasir-505d7.appspot.com",
  messagingSenderId: "20779865312",
  appId: "1:20779865312:web:171be3aaf920face522c85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

export default function App() {
  return (
    <StoreProvider store={store}>
      <Routes />
    </StoreProvider>
  );
}

