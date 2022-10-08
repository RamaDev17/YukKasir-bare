import React, { useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { COLORS } from '../../constants/theme'
import { Logo } from '../../assets/images'
import * as Animatable from 'react-native-animatable';
import { getData } from '../../utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';


const SplashPage = ({ navigation }) => {
    const [user, setUser] = useState(false)
    const [onBoarding, setOnBoarding] = useState(false)

    const dispatch = useDispatch();
    const GetProductReducer = useSelector(state => state.ProductReducer.getProductResult)

    useEffect(() => {
        getData('user').then(res => {
            if (res) {
                setUser(true)
            }
        })
        getData('onBoarding').then(res => {
            if (res) {
                setOnBoarding(true)
            }
        })

        dispatch(getProducts())
    }, [])

    useEffect(() => {
        if (GetProductReducer) {
            if (user) {
                navigation.replace("BottomTab")
            } else if (onBoarding) {
                navigation.replace("LoginPage")
            } else {
                navigation.replace("OnBoardingPage")
            }
        }
    }, [GetProductReducer])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <Animatable.Image animation="zoomIn" duration={2000} source={Logo} resizeMode="cover" style={{ width: 112, height: 163 }} />
        </View>
    )
}

export default SplashPage