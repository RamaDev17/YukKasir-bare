import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Header } from '../../components/Header';
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../../actions/reportActions';
import DropDownPicker from 'react-native-dropdown-picker';
import { formatNumber } from 'react-native-currency-input';
import { Next } from '../../assets/icons';

const RiwayatTransaksiPage = ({ navigation }) => {
  const [openInput, setOpenInput] = useState(false);
  const [category, setCategory] = useState(25);
  const [items, setItems] = useState([
    { label: '25 Transaksi  Terakhir', value: 25 },
    { label: '10 Transaksi  Terakhir', value: 10 },
    { label: '5 Transaksi  Terakhir', value: 5 },
    { label: 'Semua Transaksi', value: false },
  ]);

  const dispatch = useDispatch();
  const result = useSelector((state) => state.ReportReducer.getreportResult);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      dispatch(getReports(category));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(getReports(category));
  }, [category]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} name="Riwayat Transaksi" replace={true} />
      <View style={{ marginTop: 85 }} />
      <ScrollView>
        <DropDownPicker
          open={openInput}
          value={category}
          items={items}
          setOpen={setOpenInput}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Transaksi"
          style={styles.input}
          listMode="SCROLLVIEW"
          dropDownContainerStyle={{ borderColor: COLORS.primary }}
        />
        <View style={{ marginTop: 10 }} />
        {result &&
          Object.keys(result).map((key) => {
            const riwayat = result[key];
            const date = riwayat.date.split(' ');
            return (
              <TouchableOpacity
                key={key}
                style={styles.card}
                onPress={() => navigation.navigate('RiwayatTransaksiDetailPage', riwayat)}
              >
                <View style={[styles.row, { alignItems: 'center' }]}>
                  <View style={{ flex: 3 }}>
                    <Text style={styles.text}>{`${date[1]} ${date[2]} ${date[3]}`}</Text>
                    <Text style={[styles.text, styles.textblur]}>{`${riwayat.idTransaksi}`}</Text>
                    <Text style={[styles.text, styles.textblur]}>{`${riwayat.admin}`}</Text>
                  </View>
                  <View
                    style={[
                      styles.row,
                      { flex: 2, alignItems: 'center', justifyContent: 'flex-end' },
                    ]}
                  >
                    <Text style={styles.text}>Rp. {formatNumber(riwayat.total)}</Text>
                    <Image
                      source={Next}
                      style={{ width: 25, height: 25, tintColor: COLORS.primary }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '100%',
  },
  card: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    color: COLORS.black,
    fontSize: 15,
  },
  textblur: {
    opacity: 0.3,
  },
});

export default RiwayatTransaksiPage;
