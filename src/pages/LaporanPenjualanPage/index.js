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
} from 'react-native';
import { Header } from '../../components/Header';
import { COLORS, SIZES } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { getPenjualan } from '../../actions/penjualanActions';
import { Table, Row, Rows } from 'react-native-table-component';
import { bulan, tahun } from '../../utils/date';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

const LaporanPenjualanPage = ({ navigation }) => {
  const [head, setHead] = useState(['No', 'Id', 'Product', 'Kategori', 'Tot Pen']);
  const [body, setBody] = useState([]);
  const width = (SIZES.width - 40) / 22;
  const widthArr = [width * 2.5, width * 4, width * 9, width * 4, width * 2.5];

  const penjualanResult = useSelector((state) => state.PenjualanReducer.getPenjualanResult);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      dispatch(getPenjualan());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (body.length == 0) {
      Object.keys(penjualanResult).map((key, index) => {
        const data = penjualanResult[key];
        setBody((oldArray) => [
          ...oldArray,
          [index + 1, data.id, data.nameProduct, data.category, data.count],
        ]);
      });
    }
  }, [penjualanResult]);

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
      });
    });

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

    // Write generated excel to Storage
    if (Platform.OS == 'ios') {
      RNFS.writeFile(RNFS.DocumentDirectoryPath + `/Penjualan-${tahun}.xlsx`, wbout, 'ascii')
        .then((r) => {
          Alert.alert(
            'Berhasil',
            `File berhasil disimpan di ${RNFS.DocumentDirectoryPath}/Penjualan-${tahun}`
          );
        })
        .catch((e) => {
          console.log('Error', e);
        });
    } else {
      RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + `/Penjualan-${tahun}.xlsx`, wbout, 'ascii')
        .then((r) => {
          Alert.alert(
            'Berhasil',
            `File berhasil disimpan di ${RNFS.ExternalStorageDirectoryPath}/Penjualan-${tahun}`
          );
        })
        .catch((e) => {
          console.log('Error', e);
        });
    }
  };

  console.log(body);

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
    <View style={styles.container}>
      <Header name="Laporan Penjualan" navigation={navigation} />
      <View style={{ height: 80 }} />
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Laporan Penjualan Tahun {tahun}</Text>
        <Table borderStyle={{ borderWidth: 0.3, borderColor: COLORS.primary }}>
          <Row
            widthArr={widthArr}
            data={head}
            style={styles.head}
            textStyle={{ color: COLORS.white, fontWeight: 'bold', textAlign: 'center', margin: 6 }}
          />
          <Rows
            widthArr={widthArr}
            data={body}
            textStyle={{ color: COLORS.black, textAlign: 'center', margin: 6 }}
          />
        </Table>
        <View style={{ marginTop: 40 }} />
        <View style={{ marginTop: 40 }} />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => handleClick()}>
        <Text style={styles.textButton}>Export</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    borderRadius: 50,
    position: 'absolute',
    bottom: 10,
    right: 0,
    left: 0,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: COLORS.white,
    fontSize: 18,
  },
});

export default LaporanPenjualanPage;
