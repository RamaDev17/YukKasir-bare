
import Routes from './routes'
import { initializeApp } from 'firebase/app'
import { Provider as StoreProvider } from 'react-redux';
import store from './reducer/store';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5qSYdUvm1oV0NiKmO3VndKzXBXyU2aW0",
  authDomain: "yukkasir-bbc73.firebaseapp.com",
  projectId: "yukkasir-bbc73",
  storageBucket: "yukkasir-bbc73.appspot.com",
  messagingSenderId: "472616879101",
  appId: "1:472616879101:web:e1c80c99a26921bd438f94"
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

