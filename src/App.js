import Routes from './routes';
import { Provider as StoreProvider } from 'react-redux';
import store from './reducer/store';
import { appFirebase } from './config/firebase';
import { StatusBar } from 'react-native';

appFirebase;

const App = () => {
  return (
    <StoreProvider store={store}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Routes />
    </StoreProvider>
  );
};

export default App;
