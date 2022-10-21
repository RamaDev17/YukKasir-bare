import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { formatNumber } from '../../utils/formatNumber';
import { Print, Setting } from '../../assets/icons';
import { getData } from '../../utils/localStorage';
import { BLEPrinter, COMMANDS, ColumnAliment } from 'react-native-thermal-receipt-printer-image-qr';
import { bulan, detik, hari, jam, menit, tahun, tanggal } from '../../utils/date';
import AwesomeAlert from 'react-native-awesome-alerts';
import { createReport } from '../../actions/reportActions';
import { createProduct } from '../../actions/productActions';

const FinalTransaksiPage = ({ navigation, route }) => {
  let dataTransaksi = route.params.dataAdd;
  let Amount = route.params.amount;
  let tunai = route.params.tunai;
  let kembalian = route.params.kembalian;

  const [user, setUser] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPrinter = useSelector((state) => state.PrinterReducer.printerResult.data);
  const dispatch = useDispatch();

  useEffect(() => {
    getData('user').then((res) => setUser(res));
  }, []);

  const handlePrinter = async () => {
    try {
      const Printer = BLEPrinter;
      Printer.printText('\n');
      Printer.printText(`<CB> Toko Ibnu Ali </CB>\n`);
      Printer.printText(`<C>Sembungsemi, Blambangan</C>`);
      Printer.printText(`<C>Admin: ${user.username}</C>`);
      Printer.printText(`<C>${hari}, ${tanggal} ${bulan} ${tahun}</C>`);
      Printer.printText(`<C>${jam}:${menit}</C>`);
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      let columnAliment = [ColumnAliment.LEFT, ColumnAliment.CENTER, ColumnAliment.RIGHT];
      let columnWidth = [30 - (7 + 1), 1, 7];
      Object.keys(dataTransaksi).map((key) => {
        Printer.printText(dataTransaksi[key].nameProduct);
        const orderList = [
          `${dataTransaksi[key].count} x ${formatNumber(dataTransaksi[key].price)}`,
          '',
          formatNumber(dataTransaksi[key].total),
        ];
        Printer.printColumnsText(orderList, columnWidth, columnAliment, ['', '', '']);
      });
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      const totalHarga = ['Total Rp.', '', formatNumber(Amount)];
      Printer.printColumnsText(totalHarga, columnWidth, columnAliment, ['', '', '']);
      const bayar = ['Bayar Rp.', '', formatNumber(tunai)];
      Printer.printColumnsText(bayar, columnWidth, columnAliment, ['', '', '']);
      const kembali = ['Kembali Rp.', '', formatNumber(kembalian)];
      Printer.printColumnsText(kembali, columnWidth, columnAliment, ['', '', '']);
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      Printer.printText(`<C>Terima Kasih</C>`);
      Printer.printText('\n');
    } catch (err) {
      console.warn(err);
    }
    let updateStock;
    Object.keys(dataTransaksi).map((key) => {
      const data = dataTransaksi[key];
      updateStock = {
        id: data.id,
        nameProduct: data.nameProduct,
        price: data.price,
        stock: data.stock - data.count,
        category: data.category,
      };
      dispatch(createProduct(updateStock));
    });
    const newData = {
      idTransaksi: jam + menit + detik,
      admin: user.username,
      date: [hari, bulan, tahun, `${jam}:${menit}`],
      product: dataTransaksi,
      total: Amount,
      bayar: tunai,
      kembalian,
    };
    setLoading(!loading);
    dispatch(createReport(newData));
    setTimeout(() => {
      navigation.replace('HomePage');
    }, 6000);
  };

  return (
    <View style={styles.container}>
      <Header name={'Transaksi'} navigation={navigation} />
      <ScrollView>
        {getPrinter ? (
          <View style={styles.status}>
            <Image source={Print} style={{ width: 30, height: 30, tintColor: COLORS.green }} />
            <Text>{getPrinter.device_name}</Text>
          </View>
        ) : (
          <View style={[styles.status, { justifyContent: 'space-between' }]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PrintPage');
              }}
              style={{ alignItems: 'center' }}
            >
              <Image source={Print} style={{ width: 30, height: 30, tintColor: COLORS.red }} />
              <Text style={{ color: COLORS.red }}>Print Off</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PrintPage');
              }}
            >
              <Image
                source={Setting}
                style={{ width: 30, height: 30, tintColor: COLORS.primary }}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.struk}>
          <Text style={styles.textAlign}>Toko Ibnu Ali</Text>
          <Text style={styles.textAlign}>Sembungsemi, Blambangan</Text>
          <Text style={styles.textAlign}>Admin: {user.username}</Text>
          <Text style={styles.textAlign}>{`${hari}, ${tanggal} ${bulan} ${tahun}`}</Text>
          <Text style={styles.textAlign}>{`${jam}:${menit}`}</Text>
          <Text style={styles.textAlign}>=============================</Text>
          {Object.keys(dataTransaksi).map((key) => {
            return (
              <StrukProduct
                name={dataTransaksi[key].nameProduct}
                count={dataTransaksi[key].count}
                price={dataTransaksi[key].price}
                key={key}
              />
            );
          })}
          <View style={{ marginTop: 5 }} />
          <Text style={styles.textAlign}>=============================</Text>
          <View style={{ marginTop: 5 }} />
          <View style={styles.row}>
            <Text>Total Rp.</Text>
            <Text>{formatNumber(parseInt(Amount))}</Text>
          </View>
          <View style={styles.row}>
            <Text>Bayar Rp.</Text>
            <Text>{formatNumber(parseInt(tunai))}</Text>
          </View>
          <View style={styles.row}>
            <Text>Kembali Rp.</Text>
            <Text>{formatNumber(parseInt(kembalian))}</Text>
          </View>
          <View style={{ marginTop: 5 }} />
          <Text style={styles.textAlign}>=============================</Text>
          <View style={{ marginTop: 5 }} />
          <Text style={styles.textAlign}>Terima Kasih</Text>
        </View>
      </ScrollView>
      <View style={styles.floating}>
        <TouchableOpacity
          style={[styles.buttonCetak]}
          onPress={() => {
            if (getPrinter) {
              handlePrinter();
            } else {
              setShowAlert(!showAlert);
            }
          }}
        >
          {loading ? (
            <ActivityIndicator size={'large'} color={COLORS.white} />
          ) : (
            <Text style={styles.textButton}>Cetak</Text>
          )}
        </TouchableOpacity>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Print Error"
        message="Cek Koneksi Printer"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Pengaturan"
        confirmButtonColor={COLORS.primary}
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.navigate('PrintPage');
        }}
        titleStyle={{ fontSize: 26, fontWeight: 'bold', color: COLORS.red }}
        confirmButtonTextStyle={{ fontSize: 20 }}
        messageStyle={{ fontSize: 20, color: COLORS.black }}
        overlayStyle={{ padding: 30 }}
      />
    </View>
  );
};

const StrukProduct = ({ name, count, price }) => {
  return (
    <View style={{ marginTop: 5 }}>
      <Text>{name}</Text>
      <View style={styles.row}>
        <Text>
          {formatNumber(count)} x {formatNumber(price)}
        </Text>
        <Text>{formatNumber(count * parseInt(price))}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  status: {
    marginTop: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  struk: {
    marginTop: 20,
    marginHorizontal: 40,
    backgroundColor: COLORS.gray,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  textAlign: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCetak: {
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    borderRadius: 30,
  },
  floating: {
    marginHorizontal: 50,
    position: 'absolute',
    bottom: 10,
    right: 0,
    left: 0,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FinalTransaksiPage;
