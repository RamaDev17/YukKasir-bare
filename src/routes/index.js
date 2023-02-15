import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashPage,
  LoginPage,
  RegisterPage,
  HomePage,
  OnBoardingPage,
  TransaksiPage,
  ProfilePage,
  LaporanPage,
  ProductPage,
  CreateProduct,
  UpdateProduct,
  PrintPage,
  FinalTransaksiPage,
  RiwayatTransaksiPage,
  RiwayatTransaksiDetailPage,
  LaporanPenjualanPage,
  HelpPage,
  HelpPdfPage
} from '../pages';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomBar from '../components/BottomBar';
import { COLORS } from '../constants';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerTitleAlign: 'center',
  headerTitleStyle: { fontSize: 25 },
  headerBackTitleStyle: { fontSize: 30 },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: COLORS.white },
  headerTintColor: COLORS.black,
};

const BottomTab = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomBar {...props} />}>
      <Tab.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Tab.Screen name="HelpPage" component={HelpPage} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ orientation: 'portrait' }} initialRouteName="SplashPage">
        <Stack.Screen name="SplashPage" component={SplashPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="OnBoardingPage"
          component={OnBoardingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} /> */}
        <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
        <Stack.Screen
          name="TransaksiPage"
          component={TransaksiPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProductPage" component={ProductPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="CreateProductPage"
          component={CreateProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProductPage"
          component={UpdateProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PrintPage" component={PrintPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="FinalTransaksiPage"
          component={FinalTransaksiPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RiwayatTransaksiPage"
          component={RiwayatTransaksiPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RiwayatTransaksiDetailPage"
          component={RiwayatTransaksiDetailPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LaporanPenjualanPage"
          component={LaporanPenjualanPage}
          options={{ headerShown: false, orientation: 'all' }}
        />
        <Stack.Screen
          name="LaporanPage"
          component={LaporanPage}
          options={{
            headerShown: false,
            orientation: Platform.OS == 'android' ? 'all' : 'portrait',
          }}
        />
        <Stack.Screen
          name="HelpPdfPage"
          component={HelpPdfPage}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
