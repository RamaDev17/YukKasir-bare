import {Dimensions} from 'react-native';

const heightMobileUi = 926;
const widthMobileUi = 428;

export const responsiveWidth = width => {
  return (Dimensions.get('window').width * width) / widthMobileUi;
};
export const responsiveHeight = height => {
  return (Dimensions.get('window').height * height) / heightMobileUi;
};