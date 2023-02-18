import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput } from 'react-native-element-textinput';
import { Barcode, Close, FlashOff, FlashOn } from '../../../assets/icons';
import { Header } from '../../../components/Header';
import { COLORS } from '../../../constants';
import DropDownPicker from 'react-native-dropdown-picker';
const { width, height } = Dimensions.get('window');
import { createProduct, getProducts } from '../../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import useSound from 'react-native-use-sound';
import CurrencyInput from 'react-native-currency-input';

export const CreateProduct = ({ navigation }) => {
  const [id, setId] = useState('');
  const [nameProduct, setNameProduct] = useState('');
  const [category, setCategory] = useState('');
  const [purchase, setPurchase] = useState(0);
  const [selling, setSelling] = useState(0);
  const [stock, setStock] = useState(0);

  const [openInput, setOpenInput] = useState(false);
  const [items, setItems] = useState([
    { label: 'Buku', value: 'buku' },
    { label: 'Pakaian', value: 'pakaian' },
    { label: 'Herbal', value: 'herbal' },
    { label: 'Parfum', value: 'parfum' },
    { label: 'Lainnya...', value: 'lainnya' },
  ]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const soundScanner = 'soundbarcode.mp3';
  const [play, pause, stop, data] = useSound(soundScanner);

  const handleBarCodeScanned = (value) => {
    play();
    setOpen(false);
    setId(value.data);
  };

  const onTorch = () => {
    setFlash(!flash);
  };
  const dispatch = useDispatch();

  const CreateProductReducer = useSelector((state) => state.ProductReducer.createProductResult);

  const onSubmit = () => {
    if (id && nameProduct && category && purchase && stock && selling) {
      const newData = {
        id,
        nameProduct,
        category,
        purchase,
        selling,
        stock,
      };
      dispatch(createProduct(newData));
      setLoading(!loading);
    } else {
      Alert.alert('Gagal', 'Form harus diisi semua');
    }
  };

  useEffect(() => {
    if (CreateProductReducer) {
      dispatch(createProduct(false));
      setTimeout(() => {
        setOpenAlert(true);
      }, 2000);
    }
  }, [CreateProductReducer]);

  useEffect(() => {
    if (loading) {
      dispatch(getProducts());
    }
  }, [loading]);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Header navigation={navigation} name="Tambah Produk" />
      {/* Alert */}
      {openAlert ? (
        <AwesomeAlert
          show={openAlert}
          showProgress={false}
          title="Tambah Produk"
          titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
          message="Tambah data produk berhasil !"
          messageStyle={{ fontSize: 20 }}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Oke"
          confirmButtonColor={COLORS.primary}
          confirmButtonTextStyle={{ color: COLORS.white, fontSize: 18 }}
          onConfirmPressed={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTab' }]
            });
          }}
          contentContainerStyle={{ padding: 20 }}
        />
      ) : (
        <View />
      )}
      {/* modal camera */}
      {open ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={() => {
            setOpen(!open);
          }}
          statusBarTranslucent={true}
        >
          <QRCodeScanner
            onRead={handleBarCodeScanned}
            flashMode={
              flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off
            }
            cameraStyle={{ width, height }}
            fadeIn={true}
            showMarker={true}
            containerStyle={{ backgroundColor: COLORS.white }}
          />

          <TouchableOpacity style={styles.iconClose} onPress={() => setOpen(!open)}>
            <Image
              source={Close}
              resizeMode="cover"
              style={{ height: 30, width: 30, tintColor: COLORS.white }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconTorch} onPress={() => onTorch()}>
            <Image
              source={flash ? FlashOff : FlashOn}
              resizeMode="cover"
              style={{ height: 30, width: 30, tintColor: COLORS.white }}
            />
          </TouchableOpacity>
        </Modal>
      ) : (
        <View />
      )}
      {/* end modal camera */}

      <ScrollView style={{ marginTop: 80, width: '100%' }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextInput
            value={id}
            style={[styles.input, { width: '85%' }]}
            inputStyle={[styles.inputStyle]}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Id/Barcode"
            placeholder="Id/Barcode"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setId(value);
            }}
          />
          <TouchableOpacity onPress={() => setOpen(!open)}>
            <Image source={Barcode} style={{ width: 40, height: 40, tintColor: COLORS.primary }} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }} />
        <TextInput
          value={nameProduct}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          textErrorStyle={styles.textErrorStyle}
          label="Nama Product"
          placeholder="Nama Product"
          placeholderTextColor="gray"
          focusColor={COLORS.primary}
          onChangeText={(value) => {
            setNameProduct(value);
          }}
        />

        <View style={{ marginTop: 20 }} />
        <DropDownPicker
          open={openInput}
          value={category}
          items={items}
          setOpen={setOpenInput}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Katagori"
          style={styles.input}
          listMode="SCROLLVIEW"
        />

        <View style={{ marginTop: 20 }} />
        <Text style={{ fontSize: 16, color: COLORS.black }}>Harga beli :</Text>
        <View style={{ marginBottom: 10 }} />
        <CurrencyInput
          value={purchase}
          onChangeValue={(value) => setPurchase(value)}
          style={[styles.input, { paddingVertical: 10, width: width / 1.12 }]}
          placeholder="purchase"
          prefix="Rp. "
          delimiter="."
          precision={0}
          onChangeText={(formattedValue) => {}}
          keyboardType="numeric"
        />

        <View style={{ marginTop: 20 }} />
        <Text style={{ fontSize: 16, color: COLORS.black }}>Harga jual :</Text>
        <View style={{ marginBottom: 10 }} />
        <CurrencyInput
          value={selling}
          onChangeValue={(value) => setSelling(value)}
          style={[styles.input, { paddingVertical: 10, width: width / 1.12 }]}
          placeholder="Harga jual"
          prefix="Rp. "
          delimiter="."
          precision={0}
          onChangeText={(formattedValue) => {}}
          keyboardType="numeric"
        />

        <View style={{ marginTop: 20 }} />
        <Text style={{ fontSize: 16, color: COLORS.black }}>Stock barang :</Text>
        <View style={{ marginBottom: 10 }} />
        <CurrencyInput
          value={stock}
          onChangeValue={(value) => setStock(value)}
          style={[styles.input, { paddingVertical: 10, width: width / 1.12 }]}
          placeholder="Stock"
          precision={0}
          onChangeText={(formattedValue) => {}}
          keyboardType="numeric"
        />
        <View style={{ marginTop: 40 }} />
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.textButton}>Tambah</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputStyle: { fontSize: 16 },
  labelStyle: {
    fontSize: 14,
    position: 'absolute',
    top: -10,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
    color: COLORS.black,
  },
  placeholderStyle: { fontSize: 16, color: COLORS.black },
  textErrorStyle: { fontSize: 16 },
  button: {
    padding: 20,
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 18,
  },
  iconClose: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  iconTorch: {
    position: 'absolute',
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonAgain: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 50,
  },
});
