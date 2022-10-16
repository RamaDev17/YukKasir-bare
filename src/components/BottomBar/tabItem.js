import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dolar, DolarOutline, Transaksi } from '../../assets/icons';
import { COLORS } from '../../constants';

const TabItem = ({ isFocused, onLongPress, onPress, label }) => {
  const IconTab = () => {
    if (label === 'HomePage') {
      return <Icon name={isFocused ? 'home' : 'home-outline'} size={30} color={COLORS.primary} />;
    }
    if (label === 'LaporanPage') {
      return (
        <Image
          source={isFocused ? Dolar : DolarOutline}
          resizeMode="cover"
          style={{ width: 30, height: 30, tintColor: COLORS.primary }}
        />
      );
    }
    if (label === 'ProfilePage') {
      return (
        <Icon name={isFocused ? 'person' : 'person-outline'} size={30} color={COLORS.primary} />
      );
    }

    return <Icon name="home" size={30} color={COLORS.primary} />;
  };
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      <IconTab />
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
