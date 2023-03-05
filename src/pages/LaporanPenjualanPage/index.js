import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Header } from '../../components/Header';
import { COLORS, SIZES } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Row, Rows } from 'react-native-table-component';
import { bulan, tahun } from '../../utils/date';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import { getReports } from '../../actions/reportActions';
import DropDownPicker from 'react-native-dropdown-picker';
import { tahun as tahunNow, bulan as bulanNow } from '../../utils/date';
import { Export } from '../../assets/icons';
import { formatNumber } from 'react-native-currency-input';

const LaporanPenjualanPage = ({ navigation }) => {
  const [product, setProduct] = useState([]);
  const [productFix, setProductFix] = useState([]);

  // input Bulan
  const [openInputBulan, setOpenInputBulan] = useState(false);
  const [itemBulan, setItemBulan] = useState([
    { label: 'Januari', value: 'Januari' },
    { label: 'Februari', value: 'Februari' },
    { label: 'Maret', value: 'Maret' },
    { label: 'April', value: 'April' },
    { label: 'Mei', value: 'Mei' },
    { label: 'Juni', value: 'Juni' },
    { label: 'Juli', value: 'Juli' },
    { label: 'Agustus', value: 'Agustus' },
    { label: 'September', value: 'September' },
    { label: 'Oktober', value: 'Oktober' },
    { label: 'November', value: 'November' },
    { label: 'Desember', value: 'Desember' },
  ]);
  const [valueBulan, setValueBulan] = useState(bulanNow);

  // input tahun
  const [openInputTahun, setOpenInputTahun] = useState(false);
  const [itemTahun, setItemTahun] = useState([]);
  const [categoryTahun, setCategoryTahun] = useState([]);
  const [valueTahun, setValueTahun] = useState(tahunNow.toString());

  const dispatch = useDispatch();
  const result = useSelector((state) => state.ReportReducer.getreportResult);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      if (!result) {
        dispatch(getReports());
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Object.keys(result).map((key) => {
      if (valueBulan == result[key].bulan && valueTahun == result[key].tahun.toString()) {
        setProduct((oldArray) => [...oldArray, result[key].product]);
      } else {
        setProductFix([]);
      }
      setItemTahun((oldArray) => [...oldArray, result[key].tahun]);
    });
  }, [result]);

  useEffect(() => {
    setProduct([]);
    setProductFix([]);
    Object.keys(result).map((key) => {
      if (valueBulan == result[key].bulan && valueTahun == result[key].tahun.toString()) {
        setProduct((oldArray) => [...oldArray, result[key].product]);
      } else {
        setProductFix([]);
      }
    });
  }, [valueBulan, valueTahun]);

  useEffect(() => {
    if (product.length != 0) {
      product.map((value) => {
        value.map((childValue) => {
          setProductFix((oldArray) => [...oldArray, childValue]);
        });
      });
      setCategoryTahun([]);
      let uniqueTahun = new Set(itemTahun);
      let resultUniqueTahun = Array.from(uniqueTahun);
      resultUniqueTahun.map((value) => {
        setCategoryTahun((oldArray) => [
          ...oldArray,
          { label: value.toString(), value: value.toString() },
        ]);
      });
    } else {
      setProductFix([]);
    }
  }, [product]);

  return (
    <View style={styles.container}>
      <Header name={'Laporan Penjualan'} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {Platform.OS == 'ios' ? (
          <View style={[styles.row, { marginTop: 85, zIndex: 100 }]}>
            <DropDownPicker
              open={openInputBulan}
              setOpen={setOpenInputBulan}
              items={itemBulan}
              setItems={setItemBulan}
              value={valueBulan}
              setValue={setValueBulan}
              placeholder="Pilih Bulan"
              containerStyle={{ width: '50%' }}
              style={[styles.input]}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{ borderColor: COLORS.black }}
            />
            <View style={{ width: '10%' }} />
            <DropDownPicker
              open={openInputTahun}
              setOpen={setOpenInputTahun}
              items={categoryTahun}
              setItems={setCategoryTahun}
              value={valueTahun}
              setValue={setValueTahun}
              placeholder="Pilih Tahun"
              containerStyle={{ width: '40%' }}
              style={[styles.input]}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{ borderColor: COLORS.black }}
            />
          </View>
        ) : (
          <View style={[styles.row, { marginTop: 85 }]}>
            <DropDownPicker
              open={openInputBulan}
              setOpen={setOpenInputBulan}
              items={itemBulan}
              setItems={setItemBulan}
              value={valueBulan}
              setValue={setValueBulan}
              placeholder="Pilih Bulan"
              containerStyle={{ width: '50%' }}
              style={[styles.input]}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{ borderColor: COLORS.black }}
            />
            <View style={{ width: '10%' }} />
            <DropDownPicker
              open={openInputTahun}
              setOpen={setOpenInputTahun}
              items={categoryTahun}
              setItems={setCategoryTahun}
              value={valueTahun}
              setValue={setValueTahun}
              placeholder="Pilih Tahun"
              containerStyle={{ width: '40%' }}
              style={[styles.input]}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{ borderColor: COLORS.black }}
            />
          </View>
        )}
        {productFix.length != 0 ? (
          <View style={{ marginTop: 20 }}>
            <TabelPenjualan data={productFix} valueBulan={valueBulan} valueTahun={valueTahun} />
          </View>
        ) : (
          <View style={styles.center}>
            <Text>Data Kosong</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const TabelPenjualan = ({ data, valueBulan, valueTahun }) => {
  // tabel
  const [head, setHead] = useState([
    'No',
    'Id',
    'Product',
    'Kategori',
    'Total Penjualan',
    'Harga Beli',
    'Harga Jual',
    'Laba per Item',
    'Total Laba',
  ]);
  const [body, setBody] = useState([]);
  const width = SIZES.width / 22;
  const widthArr = [
    width * 2.5,
    width * 4,
    width * 10,
    width * 4,
    width * 4,
    width * 5,
    width * 5,
    width * 5,
    width * 5,
  ];

  let result = [];

  data.forEach(function (a) {
    if (!this[a.nameProduct]) {
      this[a.nameProduct] = {
        id: a.id,
        nameProduct: a.nameProduct,
        category: a.category,
        hargaJual: a.selling,
        hargaBeli: a.purchase,
        profit: 0,
        count: 0,
      };
      result.push(this[a.nameProduct]);
    }
    this[a.nameProduct].count += a.count;
    this[a.nameProduct].profit += a.profit;
  }, Object.create(null));

  useEffect(() => {
    if (body.length == 0) {
      Object.keys(result).map((key, index) => {
        const data = result[key];
        // console.log(data);
        setBody((oldArray) => [
          ...oldArray,
          [
            index + 1,
            data.id,
            data.nameProduct,
            data.category,
            data.count,
            `Rp. ${formatNumber(data.hargaBeli)}`,
            `Rp. ${formatNumber(data.hargaJual)}`,
            `Rp. ${formatNumber(data.hargaJual - data.hargaBeli)}`,
            `Rp. ${formatNumber(data.profit)}`,
          ],
        ]);
      });
    }
  }, [result]);

  const exportDataToExcel = () => {
    // Created Sample data
    let sample_data_to_export = [];

    body.map((value) => {
      sample_data_to_export.push({
        No: value[0],
        ID: value[1],
        Product: value[2],
        Kategori: value[3],
        'Total Penjualan': value[4],
        'Harga Beli': value[5],
        'Harga Jual': value[6],
        'Laba per Item': value[7],
        'Total Laba ': value[8],
      });
    });

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

    // Write generated excel to Storage
    if (Platform.OS == 'ios') {
      RNFS.writeFile(RNFS.DocumentDirectoryPath + `/Penjualan-${valueBulan}-${valueTahun}.xlsx`, wbout, 'ascii')
        .then((r) => {
          Alert.alert(
            'Berhasil',
            `File berhasil disimpan di ${RNFS.DocumentDirectoryPath}/Penjualan-${valueBulan}-${valueTahun}`
          );
        })
        .catch((e) => {
          console.log('Error', e);
        });
    } else {
      RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + `/Penjualan-${valueBulan}-${valueTahun}.xlsx`, wbout, 'ascii')
        .then((r) => {
          Alert.alert(
            'Berhasil',
            `File berhasil disimpan di ${RNFS.ExternalStorageDirectoryPath}/Penjualan-${valueBulan}-${valueTahun}`
          );
        })
        .catch((e) => {
          console.log('Error', e);
        });
    }
  };

  const handleClick = async () => {
    if (Platform.OS == 'android') {
      try {
        // Check for Permission (check if permission is already given or not)
        let isPermitedExternalStorage = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (!isPermitedExternalStorage) {
          // Ask for permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage permission needed',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted (calling our exportDataToExcel function)
            exportDataToExcel();
            console.log('Permission granted');
          } else {
            // Permission denied
            console.log('Permission denied');
          }
        } else {
          // Already have Permission (calling our exportDataToExcel function)
          exportDataToExcel();
        }
      } catch (e) {
        console.log('Error while checking permission');
        console.log(e);
        return;
      }
    } else {
      exportDataToExcel();
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => handleClick()}>
        <View style={[styles.row, { alignItems: 'center', justifyContent: 'center' }]}>
          <Image source={Export} style={{ width: 20, height: 20, tintColor: COLORS.white }} />
          <View style={{ width: 10 }} />
          <Text style={styles.textButton}>Export</Text>
        </View>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }} />
      <ScrollView horizontal={true}>
        <Table borderStyle={{ borderWidth: 0.5, borderColor: COLORS.primary }}>
          <Row
            widthArr={widthArr}
            data={head}
            style={styles.head}
            textStyle={[styles.textTable, { fontWeight: 'bold', color: COLORS.white }]}
          />
          {body.map((value, index) => {
            return (
              <Row key={index} widthArr={widthArr} data={value} textStyle={styles.textTable} />
            );
          })}
        </Table>
      </ScrollView>
      <View style={{ marginBottom: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
    width: '100%',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  head: { height: 60, backgroundColor: COLORS.primary },
  text: {
    margin: 6,
  },
  title: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 18,
  },
  center: {
    height: Dimensions.get('window').height - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTable: {
    color: COLORS.black,
    textAlign: 'center',
    margin: 6,
  },
});

export default LaporanPenjualanPage;
