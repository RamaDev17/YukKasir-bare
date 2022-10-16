import React from 'react';
import { Image, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Ceklis } from '../../assets/icons';
import { OnBoarding1, OnBoarding2 } from '../../assets/images';
import { COLORS } from '../../constants/theme';
import { storeData } from '../../utils/localStorage';

const Square = ({ selected }) => {
  let backgroundColor = selected ? COLORS.primary : COLORS.gray;

  return (
    <View
      style={{
        width: selected ? 12 : 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
        borderRadius: 3,
      }}
    />
  );
};

const Next = ({ ...props }) => (
  <TouchableOpacity
    {...props}
    style={{
      marginRight: 10,
      padding: 10,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    }}
  >
    <Text style={{ color: COLORS.white, fontSize: 16 }}>Next</Text>
  </TouchableOpacity>
);

const Skip = ({ ...props }) => (
  <TouchableOpacity
    {...props}
    style={{
      marginLeft: 10,
      padding: 10,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    }}
  >
    <Text style={{ color: COLORS.white, fontSize: 16 }}>Skip</Text>
  </TouchableOpacity>
);

const Done = ({ ...props }) => (
  <TouchableOpacity {...props}>
    <Image
      source={Ceklis}
      resizeMode="cover"
      style={{ width: 40, height: 40, tintColor: COLORS.primary, marginRight: 10 }}
    />
  </TouchableOpacity>
);

const OnBoardingPage = ({ navigation }) => {
  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <Onboarding
        bottomBarColor={COLORS.white}
        DotComponent={Square}
        DoneButtonComponent={Done}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        onDone={() => {
          navigation.replace('LoginPage');
          console.log('coba');
          storeData('onBoarding', { onboarding: true });
        }}
        onSkip={() => {
          navigation.replace('LoginPage');
          storeData('onBoarding', { onboarding: true });
        }}
        titleStyles={{ color: COLORS.black, fontSize: 24 }}
        pages={[
          {
            backgroundColor: COLORS.white,
            image: (
              <Image source={OnBoarding1} resizeMode="cover" style={{ width: 200, height: 247 }} />
            ),
            title: 'Kelola daftar produk anda secara real-time',
            subtitle: '',
          },
          {
            backgroundColor: COLORS.white,
            image: (
              <Image source={OnBoarding2} resizeMode="cover" style={{ width: 200, height: 247 }} />
            ),
            title: 'Pindai produk dengan cepat langsung dari ponsel anda',
            subtitle: '',
          },
        ]}
      />
    </>
  );
};

export default OnBoardingPage;
