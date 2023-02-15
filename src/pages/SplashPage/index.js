import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Logo } from '../../assets/images';
import * as Animatable from 'react-native-animatable';
import { getData } from '../../utils/localStorage';

const SplashPage = ({ navigation }) => {
  const [user, setUser] = useState(false);
  const [onBoarding, setOnBoarding] = useState('onBoarding');

  useEffect(() => {
    getData('user').then((res) => {
      if (res) {
        setUser(true);
      } else {
        getData('onBoarding').then((res) => {
          if (res) {
            setOnBoarding(true);
          } else {
            setOnBoarding(false);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigation.replace('BottomTab');
      }, 3000);
    } else if (onBoarding && onBoarding != 'onBoarding') {
      setTimeout(() => {
        navigation.replace('LoginPage');
      }, 3000);
    } else if (!onBoarding) {
      setTimeout(() => {
        navigation.replace('OnBoardingPage');
      }, 3000);
    }
  }, [user, onBoarding]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
      }}
    >
      <StatusBar translucent={true} backgroundColor="transparent" />
      <Animatable.Image
        animation="zoomIn"
        duration={2000}
        source={Logo}
        resizeMode="cover"
        style={{ width: 112, height: 163 }}
      />
    </View>
  );
};

export default SplashPage;
