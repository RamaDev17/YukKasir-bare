import Routes from './routes';
import { Provider as StoreProvider } from 'react-redux';
import store from './reducer/store';
import { appFirebase } from './config/firebase';

appFirebase;

const App = () => {
  return (
    <StoreProvider store={store}>
      <Routes />
    </StoreProvider>
  );
};

export default App;
