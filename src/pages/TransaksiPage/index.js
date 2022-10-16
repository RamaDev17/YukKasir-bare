import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Add, Barcode, Close, Delete, FlashOff, FlashOn, Min } from '../../assets/icons';
import { COLORS } from '../../constants';
const { width, height } = Dimensions.get('window');
import SearchBar from 'react-native-platform-searchbar';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import useSound from 'react-native-use-sound';
import { Header } from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import { uppercaseWord } from '../../utils/uppercaseWord';
import { formatNumber } from '../../utils/formatNumber';

let total = 0;

const TransaksiPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [productSearch, setProductSearch] = useState([]);
  const [get, setGet] = useState(false);
  const [searchBarcode, setSearchBarcode] = useState(false);
  // data ketika sudah ditambahkan
  const [dataAdd, setDataAdd] = useState([]);
  const [dataAsync, setDataAsync] = useState(false);
  const [amount, setAmount] = useState(0);

  const soundScanner = 'soundbarcode.mp3';
  const [play, pause, stop, data] = useSound(soundScanner, { volume: 3 });

  const onChangeText = (value) => {
    setLoading(true);
    setSearchQuery(value);
  };

  const handleBarCodeScanned = (value) => {
    play();
    setSearchQuery(value.data);
    setOpen(false);
    setSearchBarcode(true);
  };

  const onTorch = () => {
    setFlash(!flash);
  };

  const dispatch = useDispatch();
  const GetProductReducer = useSelector((state) => state.ProductReducer.getProductResult);
  const LoadingProductReducer = useSelector((state) => state.ProductReducer.getProductLoading);

  useEffect(() => {
    if (searchQuery) {
      dispatch(getProducts(searchQuery, searchBarcode));
      setGet(true);
    }
    if (searchQuery == '') {
      setProductSearch([]);
      setGet(false);
      setSearchBarcode(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (get) {
      setProductSearch(GetProductReducer);
      setLoading(false);
    }
  }, [LoadingProductReducer]);

  const onAddHandle = (data, count) => {
    const newData = {
      id: data.id,
      nameProduct: data.nameProduct,
      count: 1,
      price: data.price,
      total: parseInt(data.price) * count,
    };
    setDataAdd((value) => [newData, ...value]);
    setSearchQuery('');
    setDataAsync(!dataAsync);
  };

  useEffect(() => {
    setAmount(dataAdd.reduce((n, { total }) => n + total, 0));
  }, [dataAsync]);

  const onIncrement = (value) => {
    const newDataCount = {
      count: value.count + 1,
      total: parseInt(value.count + 1) * parseInt(value.price),
    };
    Object.assign(value, newDataCount);
    setDataAsync(!dataAsync);
  };

  const onDecrement = (value) => {
    if (value.count != 1) {
      const newDataCount = {
        count: value.count - 1,
        total: parseInt(value.count - 1) * parseInt(value.price),
      };
      Object.assign(value, newDataCount);
      setDataAsync(!dataAsync);
    }
  };

  return (
    <View style={{ width, height }}>
      <Header name="Transaksi" navigation={navigation} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 4 }}>
            <SearchBar
              value={searchQuery}
              onChangeText={onChangeText}
              placeholder="Search"
              theme="light"
              style={styles.searchBar}
            >
              {loading ? <ActivityIndicator style={{ marginRight: 10 }} /> : <></>}
            </SearchBar>
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end' }}
            onPress={() => {
              setOpen(!open);
            }}
          >
            <Image
              source={Barcode}
              style={{ height: 50, width: 50, tintColor: COLORS.primary }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
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
              reactivate={true}
              reactivateTimeout={1500}
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
        {Object.keys(productSearch).map((key, index) => {
          return (
            <View key={index}>
              <View style={styles.cardSearch} key={index}>
                <View>
                  <Text style={styles.textTitleCard}>
                    {uppercaseWord(productSearch[key].nameProduct)}
                  </Text>
                  <Text style={styles.textSubTitleCard}>{productSearch[key].id}</Text>
                  <Text style={styles.textSubTitleCard}>Stock: {productSearch[key].stock}</Text>
                </View>
                <View style={{ justifyContent: 'space-between' }}>
                  <Text style={styles.textTitleCard}>
                    Rp. {formatNumber(productSearch[key].price)}
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonCard}
                    onPress={() => onAddHandle(productSearch[key], 1)}
                  >
                    <Text style={styles.textButtonCard}>Tambah</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ borderWidth: 1, marginHorizontal: 20, borderColor: '#BCCEF8' }} />
            </View>
          );
        })}
        {dataAdd ? (
          dataAdd.map((value, index) => {
            return (
              <View style={[styles.cardSearch, { flexDirection: 'column' }]} key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text style={styles.textTitleCard}>{uppercaseWord(value.nameProduct)}</Text>
                    <Text style={styles.textSubTitleCard}>{uppercaseWord(value.id)}</Text>
                  </View>
                  <View>
                    <Text style={styles.textTitleCard}>Rp. {formatNumber(value.total)}</Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        dataAdd.splice(index, index + 1);
                        setDataAsync(!dataAsync);
                      }}
                    >
                      <Image
                        source={Delete}
                        style={{ width: 22, height: 22, tintColor: COLORS.red }}
                      />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => {
                          onDecrement(value);
                        }}
                      >
                        <Image
                          source={Min}
                          style={{ width: 22, height: 22, tintColor: COLORS.primary }}
                        />
                      </TouchableOpacity>
                      <Text> {value.count} </Text>
                      <TouchableOpacity
                        onPress={() => {
                          onIncrement(value);
                        }}
                      >
                        <Image
                          source={Add}
                          style={{ width: 22, height: 22, tintColor: COLORS.primary }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View />
        )}
      </ScrollView>
      <View style={styles.cardBayar}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black }}>
          Rp. {formatNumber(amount)}
        </Text>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: COLORS.primary, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, color: COLORS.white }}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransaksiPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginBottom: 70,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 80,
    paddingVertical: 10,
  },
  textHeader: {
    color: COLORS.black,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonBack: {
    padding: 10,
    position: 'absolute',
    top: 25,
    left: 10,
  },
  textInput: {
    flex: 4,
  },
  searchView: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
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
  cardSearch: {
    margin: 20,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textTitleCard: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  textSubTitleCard: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.black,
    opacity: 0.5,
  },
  buttonCard: {
    padding: 7,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  textButtonCard: {
    color: COLORS.white,
    fontSize: 12,
  },
  cardBayar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.3,
    borderTopColor: COLORS.primary,
  },
});
