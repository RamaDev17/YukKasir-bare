import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dolar, DolarOutline, Transaksi } from '../../assets/icons';
import { COLORS } from '../../constants';

const TabItem = ({ isFocused, onLongPress, onPress, label }) => {
  const IconTab = () => {
    if (label === 'HomePage') {
      return (
        <View style={styles.wrapperIcon}>
          <Icon name={isFocused ? 'home' : 'home-outline'} size={30} color={COLORS.primary} />
          <Text style={styles.textIcon}>Beranda</Text>
        </View>
      )
    }
    if (label === 'HelpPage') {
      return (
        <View style={styles.wrapperIcon}>
          <Icon name={isFocused ? 'ios-help-circle' : 'ios-help-circle-outline'} size={30} color={COLORS.primary} />
          <Text style={styles.textIcon}>Bantuan</Text>
        </View>
      )
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
  wrapperIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textIcon: {
    color: COLORS.primary
  }
});
