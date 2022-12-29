import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import { Header } from '../../components/Header';
import { COLORS } from '../../constants';
import Loading from '../../components/Loading';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { printerStatus } from '../../actions/printerAction';

let selectDevice;

export const PrintPage = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertBluetooth, setAlertBluetooth] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [device, setDevice] = useState();
  const [items, setItems] = useState([]);
  const [loadingConnect, setLoadingConnect] = useState(false);

  const dispatch = useDispatch();

  const getListDevices = async () => {
    const Printer = BLEPrinter;
    try {
      setLoading(true);
      await Printer.init();
      const results = await Printer.getDeviceList();
      setDevices(
        results?.map((item) => ({
          ...item,
        }))
      );
      setItems(
        results?.map((item) => ({
          label: item.device_name,
          value: item.device_name,
        }))
      );
    } catch (err) {
      setAlertBluetooth(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const connect = async () => {
    try {
      if (selectDevice?.inner_mac_address) {
        await BLEPrinter.connectPrinter(selectDevice?.inner_mac_address || '');
        dispatch(printerStatus(selectDevice));
      }
    } catch (err) {
      console.log(err);
      dispatch(printerStatus());
    } finally {
      setLoadingConnect(false);
    }
  };

  const connectPrinter = async () => {
    if (device) {
      setLoadingConnect(true);
      Object.keys(devices).map((key) => {
        if (devices[key].device_name == device) {
          selectDevice = {
            device_name: devices[key].device_name,
            inner_mac_address: devices[key].inner_mac_address,
          };
        }
      });
      await connect().then(() => {
        Alert.alert("", "Printer Bluetooth berhasil terkoneksi")
      });
    }
  };

  const closeConnectPrinter = async () => {
    await BLEPrinter.closeConn().then(() => {
      Alert.alert("", "Printer Bluetooth berhasil diputus")
    });
  };

  const testPrinter = async () => {
    const Printer = BLEPrinter;
    try {
      Printer.printText('\n<C>Printer berhasil tersambung</C>\n');
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      getListDevices();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header name={'Pengaturan Print'} navigation={navigation} />
      <View style={{ width: '100%' }}>
        <Text style={styles.label}>Silahkan pilih printer anda:</Text>
      </View>
      <View style={{ marginTop: 10 }} />
      <DropDownPicker
        open={openInput}
        value={device}
        items={items}
        setOpen={(value) => setOpenInput(value)}
        setValue={(value) => {
          setDevice(value);
        }}
        setItems={setItems}
        placeholder="Pilih printer"
        style={styles.input}
      />
      <View style={{ width: '100%', marginTop: 30 }}>
        <TouchableOpacity style={styles.button} onPress={() => connectPrinter()}>
          {loadingConnect ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.textButton}>Sambungkan</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.red }]}
          onPress={() => closeConnectPrinter()}
        >
          <Text style={styles.textButton}>Putuskan Sambungan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.green }]}
          onPress={() => testPrinter()}
        >
          <Text style={styles.textButton}>Tes print</Text>
        </TouchableOpacity>
      </View>
      <AwesomeAlert
        show={alertBluetooth}
        showProgress={false}
        title={'Bluetooth Mati !'}
        message={'Silahkan nyalakan Bluetooth di pengaturan ponsel Anda !'}
        showConfirmButton={true}
        confirmButtonStyle={{ backgroundColor: COLORS.primary }}
        confirmText="Oke"
        onConfirmPressed={() => setAlertBluetooth(false)}
      />
      {loading && Platform.OS == 'android' ? (
        <Loading loading={loading} text="Loading" />
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    width: '100%',
  },
  label: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
  },
  button: {
    width: '100%',
    padding: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 20,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 16,
  },
});
