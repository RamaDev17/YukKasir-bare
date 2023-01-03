import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import SearchBar from 'react-native-platform-searchbar';
import * as Animatible from 'react-native-animatable';
import { COLORS, SIZES } from '../../constants';
import {
  ArrowBack,
  Delete,
  Edit,
  Add,
  Barcode,
  Close,
  FlashOff,
  FlashOn,
} from '../../assets/icons';
import { formatNumber } from '../../utils/formatNumber';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getData } from '../../utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import database from '@react-native-firebase/database';
import { uppercaseWord } from '../../utils/uppercaseWord';
import useSound from 'react-native-use-sound';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get('window');

// Search animasi
const headerHeight = 120;
let scrollValue = 0;
let headerVisible = true;
let focused = false;
// end search animasi

const ProductPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [barcode, setBarcode] = useState(false);
  const [productAscending, setproductAscending] = useState([]);

  // Handle ScanBarcode
  const soundScanner = 'soundbarcode.mp3';
  const [play, pause, stop, data] = useSound(soundScanner);

  const handleBarCodeScanned = (value) => {
    play();
    setOpen(false);
    setSearchQuery(value.data);
    setBarcode(true);
  };

  const onTorch = () => {
    setFlash(!flash);
  };

  // End Handle ScanBarcode

  const onChangeText = useCallback(
    (value) => {
      if (value != '') {
        setLoading(true);
      } else {
        setLoading(false);
      }
      setSearchQuery(value);
    },
    [searchQuery]
  );

  // Search Animation
  const animation = useRef(new Animated.Value(1)).current;
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, headerHeight / 2 - 2],
  });
  const inputTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [headerHeight / 4, 0],
  });
  const opacity = animation;
  const onScroll = (e) => {
    if (focused) return;
    const y = e.nativeEvent.contentOffset.y;
    if (y > scrollValue && headerVisible && y > headerHeight / 2) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
      headerVisible = false;
    }
    if (y < scrollValue && !headerVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
      headerVisible = true;
    }
    scrollValue = y;
  };
  // end search animation

  const dispatch = useDispatch();
  const GetProductReducer = useSelector((state) => state.ProductReducer.getProductResult);

  // get data product
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      dispatch(getProducts());
      setSearchQuery(null);
    });

    return unsubscribe;
  }, [navigation]);

  // search data product
  useEffect(() => {
    if (searchQuery && dataProduct) {
      dispatch(getProducts(searchQuery, barcode));
      setLoading(false);
      setBarcode(false);
    }
    if (searchQuery == '') {
      dispatch(getProducts());
      setBarcode(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (GetProductReducer) {
      setDataProduct(GetProductReducer);
    }
  }, [GetProductReducer]);

  useEffect(() => {
    setproductAscending([]);
    const keys = Object.keys(dataProduct);

    // Urutkan keys berdasarkan nama produk
    keys.sort((a, b) => {
      if (dataProduct[a].nameProduct < dataProduct[b].nameProduct) {
        return -1;
      }
      if (dataProduct[a].nameProduct > dataProduct[b].nameProduct) {
        return 1;
      }
      return 0;
    });

    keys.forEach((key) => {
      setproductAscending((oldArray) => [...oldArray, dataProduct[key]]);
    });
  }, [dataProduct]);

  console.log(productAscending);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight, backgroundColor: COLORS.white }}
        scrollEventThrottle={Platform.OS == 'ios' ? onScroll : undefined}
        onScroll={Platform.OS == 'android' ? onScroll : undefined}
      >
        {productAscending ? (
          Object.keys(productAscending).map((key, index) => {
            return (
              <Animatible.View
                style={styles.item}
                key={index}
                animation="fadeInUp"
                delay={index * 100}
                useNativeDriver
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '50%' }}>
                    <Text style={styles.textItemTitle} numberOfLines={2}>
                      {uppercaseWord(productAscending[key].nameProduct)}
                    </Text>
                    <Text style={styles.textOpacity}>{productAscending[key].id}</Text>
                  </View>
                  <View>
                    <Text style={styles.textItemTitle}>
                      {uppercaseWord(productAscending[key].category)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.textItemTitle}>
                      Rp. {formatNumber(productAscending[key].selling)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.textOpacity}>
                    Stock: {formatNumber(productAscending[key].stock)}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('UpdateProductPage', productAscending[key]);
                      }}
                    >
                      <Image
                        source={Edit}
                        style={{
                          width: 25,
                          height: 25,
                          tintColor: COLORS.green,
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setAlertDelete(true);
                        setId(productAscending[key].id);
                      }}
                    >
                      <Image
                        source={Delete}
                        style={{ width: 25, height: 25, tintColor: COLORS.red }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {alertDelete ? (
                  <AwesomeAlert
                    show={alertDelete}
                    showProgress={false}
                    title="Hapus Produk"
                    titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                    message="Yakin data mau dihapus ?"
                    messageStyle={{ fontSize: 20 }}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText="Hapus"
                    cancelText="Batal"
                    confirmButtonColor={COLORS.primary}
                    confirmButtonTextStyle={{ color: COLORS.white, fontSize: 18 }}
                    cancelButtonColor={COLORS.red}
                    cancelButtonTextStyle={{ color: COLORS.white, fontSize: 18 }}
                    contentContainerStyle={{ padding: 20 }}
                    onConfirmPressed={async () => {
                      await database().ref(`/products/${id}`).remove();
                      dispatch(getProducts());
                      navigation.replace('ProductPage');
                    }}
                    onCancelPressed={() => {
                      setAlertDelete(false);
                    }}
                  />
                ) : (
                  <View />
                )}
              </Animatible.View>
            );
          })
        ) : (
          <View
            style={{
              width: SIZES.width,
              height: SIZES.height / 1.15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>Data Kosong</Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.header]}>
        <Animated.View style={[styles.searchContainer, { transform: [{ translateY }] }]}>
          <Animated.View
            style={[
              styles.inputContainer,
              { opacity, transform: [{ translateY: inputTranslateY }] },
            ]}
          >
            <SearchBar
              value={searchQuery}
              onChangeText={onChangeText}
              placeholder="Cari Produk"
              theme="light"
              inputStyle={{ color: COLORS.black }}
              style={{ flex: 8 }}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.black} style={{ marginRight: 10 }} />
              ) : (
                <></>
              )}
            </SearchBar>

            <TouchableOpacity style={{ flex: 1, marginLeft: 10 }} onPress={() => setOpen(true)}>
              <Image
                source={Barcode}
                style={{ width: 30, height: 30, tintColor: COLORS.primary }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 10 }}
              onPress={() => navigation.navigate('CreateProductPage')}
            >
              <Image source={Add} style={{ width: 30, height: 30, tintColor: COLORS.primary }} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.firstContainer]}>
          <TouchableOpacity onPress={() => navigation.replace('HomePage')} style={styles.iconBack}>
            <Image source={ArrowBack} style={{ tintColor: 'black', height: 30, width: 30 }} />
          </TouchableOpacity>
          <Text style={styles.name}>Produk</Text>
        </Animated.View>
      </View>
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
    </View>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    padding: 10,
    marginVertical: 7,
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderRadius: 10,
  },
  header: {
    height: headerHeight / 2,
    width: '100%',
    position: 'absolute',
  },
  firstContainer: {
    height: headerHeight / 2,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  searchContainer: {
    height: headerHeight / 2,
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    elevation: 2,
    padding: 10,
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  iconBack: {
    position: 'absolute',
    left: 10,
    padding: 10,
    zIndex: 100,
  },
  textItemTitle: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
  txt: {
    color: '#fff',
    letterSpacing: 1,
  },
  textOpacity: {
    color: COLORS.black,
    opacity: 0.5,
    fontSize: 12,
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
});
