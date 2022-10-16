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

export const CreateProduct = ({ navigation }) => {
  const [id, setId] = useState('');
  const [nameProduct, setNameProduct] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const [openInput, setOpenInput] = useState(false);
  const [items, setItems] = useState([
    { label: 'Buku', value: 'buku' },
    { label: 'Pakaian', value: 'pakaian' },
    { label: 'Herbal', value: 'herbal' },
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
    if (id && nameProduct && category && price && stock) {
      const newData = {
        id,
        nameProduct,
        category,
        price,
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
      setOpenAlert(true);
    }
  }, [CreateProductReducer]);

  useEffect(() => {
    if (loading) {
      dispatch(getProducts());
    }
  }, [loading]);

  return (
    <View style={styles.container}>
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
            navigation.replace('ProductPage');
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
      <View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
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
        />
        <View style={{ marginTop: 20 }} />
        <TextInput
          value={price}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          textErrorStyle={styles.textErrorStyle}
          label="Price"
          placeholder="Price"
          placeholderTextColor="gray"
          focusColor={COLORS.primary}
          onChangeText={(value) => {
            setPrice(value);
          }}
          keyboardType="numeric"
        />
        <View style={{ marginTop: 20 }} />
        <TextInput
          value={stock}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          textErrorStyle={styles.textErrorStyle}
          label="Stock"
          placeholder="Stock"
          placeholderTextColor="gray"
          focusColor={COLORS.primary}
          onChangeText={(value) => {
            setStock(value);
          }}
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginTop: 40 }} />
      <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.textButton}>Tambah</Text>
        )}
      </TouchableOpacity>
    </View>
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
