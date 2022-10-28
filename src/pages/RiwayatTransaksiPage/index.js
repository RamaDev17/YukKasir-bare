import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../../actions/reportActions';

const RiwayatTransaksiPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.ReportReducer.getreportResult);
  console.log(result);
  useEffect(() => {
    dispatch(getReports());
  }, []);
  return (
    <View style={styles.container}>
      <Header navigation={navigation} name="Riwayat Transaksi" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default RiwayatTransaksiPage;
