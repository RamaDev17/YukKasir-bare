import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashPage, LoginPage, RegisterPage, HomePage, OnBoardingPage, TransaksiPage, ProfilePage, LaporanPage, ProductPage, CreateProduct } from "../pages";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomBar from "../components/BottomBar";
import { COLORS } from "../constants";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {headerTitleAlign: "center", headerTitleStyle: { fontSize: 25}, headerBackTitleStyle: {fontSize: 30}, headerShadowVisible: false, headerStyle: {backgroundColor: COLORS.white}, headerTintColor: COLORS.black }

const BottomTab = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomBar {...props} />}>
            <Tab.Screen
                name="HomePage"
                component={HomePage}
                options={{ headerShown: false }} />
            <Tab.Screen
                name="LaporanPage"
                component={LaporanPage}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="ProfilePage"
                component={ProfilePage}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ orientation: "portrait" }} initialRouteName="SplashPage">
                <Stack.Screen name="SplashPage" component={SplashPage} options={{ headerShown: false }} />
                <Stack.Screen name="OnBoardingPage" component={OnBoardingPage} options={{ headerShown: false }} />
                <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
                <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />
                <Stack.Screen name="TransaksiPage" component={TransaksiPage} options={headerStyle} />
                <Stack.Screen name="ProductPage" component={ProductPage} options={{headerShown: false}} />
                <Stack.Screen name="CreateProductPage" component={CreateProduct} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes