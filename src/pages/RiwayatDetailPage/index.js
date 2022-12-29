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
import { useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { formatNumber } from '../../utils/formatNumber';
import { Print, Setting } from '../../assets/icons';
import { BLEPrinter, COMMANDS, ColumnAliment } from 'react-native-thermal-receipt-printer-image-qr';
import AwesomeAlert from 'react-native-awesome-alerts';

const RiwayatTransaksiDetailPage = ({ navigation, route }) => {
  const riwayat = route.params;
  const date = riwayat.date;
  const dateSplit = date.split(' ');
  const products = riwayat.product;
  const dateTransaksi = `${dateSplit[1]}, ${dateSplit[2]} ${dateSplit[3]}`;
  const dateHours = `${dateSplit[0]}`;

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPrinter = useSelector((state) => state.PrinterReducer.printerResult.data);

  const handlePrinter = async () => {
    try {
      const Printer = BLEPrinter;
      Printer.printText('\n');
      Printer.printText(`<CB> Toko Ibnu Ali </CB>\n`);
      Printer.printText(`<C>Sembungsemi, Blambangan</C>`);
      Printer.printText(`<C>Admin: ${riwayat.admin}</C>`);
      Printer.printText(`<C>${dateTransaksi}</C>`);
      Printer.printText(`<C>${dateHours}</C>`);
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      let columnAliment = [ColumnAliment.LEFT, ColumnAliment.CENTER, ColumnAliment.RIGHT];
      let columnWidth = [30 - (10 + 1), 1, 10];
      Object.keys(products).map((key) => {
        Printer.printText(products[key].nameProduct);
        const orderList = [
          `${products[key].count} x ${formatNumber(products[key].selling)}`,
          '',
          formatNumber(products[key].total),
        ];
        Printer.printColumnsText(orderList, columnWidth, columnAliment, ['', '', '']);
      });
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      const totalHarga = ['Total Rp.', '', formatNumber(parseInt(riwayat.total))];
      Printer.printColumnsText(totalHarga, columnWidth, columnAliment, ['', '', '']);
      const bayar = ['Bayar Rp.', '', formatNumber(parseInt(riwayat.bayar))];
      Printer.printColumnsText(bayar, columnWidth, columnAliment, ['', '', '']);
      const kembali = ['Kembali Rp.', '', formatNumber(parseInt(riwayat.kembalian))];
      Printer.printColumnsText(kembali, columnWidth, columnAliment, ['', '', '']);
      Printer.printText(`<C>${COMMANDS.HORIZONTAL_LINE.HR_58MM}</C>`);
      Printer.printText(`<C>Terima Kasih</C>`);
      Printer.printText('\n');
    } catch (err) {
      console.warn(err);
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('RiwayatTransaksiPage');
    }, 4000);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} name="Detail Transaksi" />
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
        {/* riwayat transaksi */}
        <View style={styles.struk}>
          <Text style={styles.textAlign}>Toko Ibnu Ali</Text>
          <Text style={styles.textAlign}>Sembungsemi, Blambangan</Text>
          <Text style={styles.textAlign}>Admin: {riwayat.admin}</Text>
          <Text style={styles.textAlign}>{`${dateSplit[1]}, ${dateSplit[2]} ${dateSplit[3]}`}</Text>
          <Text style={styles.textAlign}>{`${dateSplit[0]}`}</Text>
          <Text style={styles.textAlign}>=============================</Text>
          {Object.keys(products).map((key) => {
            return (
              <StrukProduct
                name={products[key].nameProduct}
                count={products[key].count}
                selling={products[key].selling}
                key={key}
              />
            );
          })}
          <View style={{ marginTop: 5 }} />
          <Text style={styles.textAlign}>=============================</Text>
          <View style={{ marginTop: 5 }} />
          <View style={styles.row}>
            <Text>Total Rp.</Text>
            <Text>{formatNumber(parseInt(riwayat.total))}</Text>
          </View>
          <View style={styles.row}>
            <Text>Bayar Rp.</Text>
            <Text>{formatNumber(parseInt(riwayat.bayar))}</Text>
          </View>
          <View style={styles.row}>
            <Text>Kembali Rp.</Text>
            <Text>{formatNumber(parseInt(riwayat.kembalian))}</Text>
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

export default RiwayatTransaksiDetailPage;
