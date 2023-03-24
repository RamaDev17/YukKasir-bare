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
import { BLEPrinter, COMMANDS, ColumnAlignment } from 'react-native-thermal-receipt-printer-image-qr';
import { bulan, hari, tahun, tanggal } from '../../utils/date';
import AwesomeAlert from 'react-native-awesome-alerts';
import { createReport } from '../../actions/reportActions';
import { createProduct } from '../../actions/productActions';
import { createPenjualan, getPenjualan } from '../../actions/penjualanActions';

const FinalTransaksiPage = ({ navigation, route }) => {
  let dataTransaksi = route.params.dataAdd;
  // console.log(dataTransaksi);
  let Amount = route.params.amount;
  let tunai = route.params.tunai;
  let kembalian = route.params.kembalian;
  let discount = route.params.discount;
  let date = new Date();
  let jam = date.getHours();
  let menit = date.getMinutes();

  const [user, setUser] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [penjualan, setPenjualan] = useState([]);
  const [jumlahProfit, setJumlahProfit] = useState(0);

  const getPrinter = useSelector((state) => state.PrinterReducer.printerResult.data);
  const dispatch = useDispatch();
  const getPenjualanResult = useSelector((state) => state.PenjualanReducer.getPenjualanResult);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      getData('user').then((res) => setUser(res));
      setJumlahProfit(0)
      Object.keys(dataTransaksi).map((key) => {
        setJumlahProfit(oldValue => oldValue + dataTransaksi[key].profit)
        // console.log(dataTransaksi[key].profit);
      });
      dispatch(getPenjualan());
    });

    return unsubscribe;
  }, [navigation]);

  // console.log(jumlahProfit);

  useEffect(() => {
    Object.keys(getPenjualanResult).map((key) => {
      const data = getPenjualanResult[key];
      const newData = {
        id: data.id,
        category: data.category,
        count: data.count,
        nameProduct: data.nameProduct,
        purchase: data.purchase,
        selling: data.selling,
      };
      setPenjualan((oldArray) => [...oldArray, newData]);
    });
  }, [getPenjualanResult]);

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
      let columnAligment = [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT];
      let columnWidth = [30 - (10 + 1), 1, 10];
      Object.keys(dataTransaksi).map((key) => {
        Printer.printText(dataTransaksi[key].nameProduct);
        const orderList = [
          `${dataTransaksi[key].count} x ${formatNumber(dataTransaksi[key].selling)}`,
          '',
          formatNumber(dataTransaksi[key].total),
        ];
        Printer.printColumnsText(orderList, columnWidth, columnAligment, ['', '', '']);
      });
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      const discountHarga = ['Discount', '', `${formatNumber(discount)} %`];
      Printer.printColumnsText(discountHarga, columnWidth, columnAligment, ['', '', '']);
      const totalHarga = ['Total Rp.', '', formatNumber(Amount)];
      Printer.printColumnsText(totalHarga, columnWidth, columnAligment, ['', '', '']);
      const bayar = ['Bayar Rp.', '', formatNumber(tunai)];
      Printer.printColumnsText(bayar, columnWidth, columnAligment, ['', '', '']);
      const kembali = ['Kembali Rp.', '', formatNumber(kembalian)];
      Printer.printColumnsText(kembali, columnWidth, columnAligment, ['', '', '']);
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
        purchase: data.purchase,
        selling: data.selling,
        stock: data.stock - data.count,
        category: data.category,
      };
      dispatch(createProduct(updateStock));
      if (getPenjualanResult) {
        for (let i = 0; i < penjualan.length; i++) {
          if (penjualan[i].nameProduct == data.nameProduct) {
            const newData = {
              id: data.id,
              nameProduct: data.nameProduct,
              purchase: data.purchase,
              selling: data.selling,
              count: data.count + penjualan[i].count,
              category: data.category,
            };
            dispatch(createPenjualan(newData));
            i = penjualan.length + 100;
          } else {
            const newData = {
              id: data.id,
              nameProduct: data.nameProduct,
              purchase: data.purchase,
              selling: data.selling,
              count: data.count,
              category: data.category,
            };
            dispatch(createPenjualan(newData));
          }
        }
      } else {
        const newData = {
          id: data.id,
          nameProduct: data.nameProduct,
          purchase: data.purchase,
          selling: data.selling,
          count: data.count,
          category: data.category,
        };
        dispatch(createPenjualan(newData));
      }
    });
    const newData = {
      idTransaksi: date.getTime(),
      admin: user.username,
      bulan,
      tahun,
      date: `${jam}:${menit} ${tanggal} ${bulan} ${tahun}`,
      product: dataTransaksi,
      total: Amount,
      bayar: tunai,
      kembalian,
      jumlahProfit,
    };
    setLoading(!loading);
    dispatch(createReport(newData));
    setTimeout(() => {
      navigation.replace('BottomTab');
    }, 4000);
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
                selling={dataTransaksi[key].selling}
                key={key}
              />
            );
          })}
          <View style={{ marginTop: 5 }} />
          <Text style={styles.textAlign}>=============================</Text>
          <View style={{ marginTop: 5 }} />
          <View style={styles.row}>
            <Text>Discount</Text>
            <Text>{formatNumber(parseInt(discount))} %</Text>
          </View>
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
        <View style={{ marginBottom: 80 }} />
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
            <ActivityIndicator style={{height: 22, width: 22}} color={COLORS.white} />
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

const StrukProduct = ({ name, count, selling }) => {
  return (
    <View style={{ marginTop: 5 }}>
      <Text>{name}</Text>
      <View style={styles.row}>
        <Text>
          {formatNumber(count)} x {formatNumber(selling)}
        </Text>
        <Text>{formatNumber(count * parseInt(selling))}</Text>
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
