import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const CardGraph = ({ profit, bulan, tahun }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{`${bulan}, ${tahun}`}</Text>
      <Text style={styles.text}>Rp. {profit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.3,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  text: {
    color: COLORS.black,
    fontSize: 16,
  },
});

export default CardGraph;
