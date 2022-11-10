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

export const UpdateProduct = ({ navigation, route }) => {
  const editData = route.params;

  const [id, setId] = useState(editData.id);
  const [nameProduct, setNameProduct] = useState(editData.nameProduct);
  const [category, setCategory] = useState(editData.category);
  const [purchase, setPurchase] = useState(editData.purchase);
  const [selling, setSelling] = useState(editData.selling);
  const [stock, setStock] = useState(editData.stock);

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
    setScanned(true);
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
      setOpenAlert(true);
    }
  }, [CreateProductReducer]);

  useEffect(() => {
    if (loading) {
      dispatch(getProducts());
    }
  }, [loading]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Header navigation={navigation} name="Update Produk" />
      {/* Alert */}
      {openAlert ? (
        <AwesomeAlert
          show={openAlert}
          showProgress={false}
          title="Update Produk"
          titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
          message="Update data produk berhasil !"
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
          {scanned && (
            <TouchableOpacity
              style={styles.buttonAgain}
              onPress={() => {
                setOpen(!open);
                setScanned(false);
              }}
            >
              <Text style={{ color: COLORS.white }}>Tutup</Text>
            </TouchableOpacity>
          )}

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
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
          }}
        >
          <TextInput
            value={id}
            style={[styles.input]}
            inputStyle={[styles.inputStyle, { opacity: 0.2 }]}
            labelStyle={styles.labelStyle}
            placeholderStyle={[styles.placeholderStyle]}
            textErrorStyle={styles.textErrorStyle}
            label="Id/Barcode"
            placeholder="Id/Barcode"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setId(value);
            }}
            editable={false}
            selectTextOnFocus={false}
            showIcon={false}
          />
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
          placeholder="Harga Beli"
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
          placeholder="Harga Jual"
          prefix="Rp. "
          delimiter="."
          precision={0}
          onChangeText={(formattedValue) => {}}
          keyboardType="numeric"
        />

        <View style={{ marginTop: 20 }} />
        <Text style={{ fontSize: 16, color: COLORS.black }}>Stok barang :</Text>
        <View style={{ marginBottom: 10 }} />
        <CurrencyInput
          value={stock}
          onChangeValue={(value) => setStock(value)}
          style={[styles.input, { paddingVertical: 10, width: width / 1.12 }]}
          placeholder="Stock"
          prefix=" "
          delimiter="."
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
          <Text style={styles.textButton}>Update</Text>
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
