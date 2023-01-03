import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Add, Barcode, Close, Delete, FlashOff, FlashOn, Min } from '../../assets/icons';
import { COLORS, SIZES } from '../../constants';
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
import CurrencyInput from 'react-native-currency-input';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [tunai, setTunai] = useState(0);
  const [kembalian, setKembalian] = useState(0);

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
    const sellingTotal = parseInt(data.selling) * count;
    const purchaseTotal = parseInt(data.purchase) * count;
    const newData = {
      id: data.id,
      nameProduct: data.nameProduct,
      count: 1,
      purchase: data.purchase,
      selling: data.selling,
      total: sellingTotal,
      stock: data.stock,
      category: data.category,
      profit: sellingTotal - purchaseTotal,
    };
    setDataAdd((value) => [newData, ...value]);
    setSearchQuery('');
    setDataAsync(!dataAsync);
  };

  useEffect(() => {
    setAmount(dataAdd.reduce((n, { total }) => n + total, 0));
  }, [dataAsync]);

  const onIncrement = (value) => {
    const sellingTotal = parseInt(value.count + 1) * parseInt(value.selling);
    const firstProfit = value.selling - value.purchase;
    const profitTotal = parseInt(value.count + 1) * parseInt(firstProfit);
    const newDataCount = {
      count: value.count + 1,
      total: sellingTotal,
      profit: profitTotal,
    };
    Object.assign(value, newDataCount);
    setDataAsync(!dataAsync);
  };

  const onDecrement = (value) => {
    const sellingTotal = parseInt(value.count - 1) * parseInt(value.selling);
    const firstProfit = value.selling - value.purchase;
    const profitTotal = parseInt(value.count - 1) * parseInt(firstProfit);
    if (value.count != 1) {
      const newDataCount = {
        count: value.count - 1,
        total: sellingTotal,
        profit: profitTotal,
      };
      Object.assign(value, newDataCount);
      setDataAsync(!dataAsync);
    }
  };

  const onChangeInputNumber = (count, value) => {
    const sellingTotal = parseInt(count) * parseInt(value.selling);
    const firstProfit = value.selling - value.purchase;
    const profitTotal = parseInt(count) * parseInt(firstProfit);
    if (count != '') {
      const newDataCount = {
        count: parseInt(count),
        total: sellingTotal,
        profit: profitTotal,
      };
      Object.assign(value, newDataCount);
      setDataAsync(!dataAsync);
    }
  };

  useEffect(() => {
    setKembalian(tunai - amount);
  }, [tunai]);

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
                <View style={{ width: '60%' }}>
                  <Text style={styles.textTitleCard} numberOfLines={2}>
                    {uppercaseWord(productSearch[key].nameProduct)}
                  </Text>
                  <Text style={styles.textSubTitleCard}>{productSearch[key].id}</Text>
                  <Text style={styles.textSubTitleCard}>Stock: {productSearch[key].stock}</Text>
                </View>
                <View style={{ justifyContent: 'space-between' }}>
                  <Text style={styles.textTitleCard}>
                    Rp. {formatNumber(productSearch[key].selling)}
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
        {dataAdd.length != 0 ? (
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
                  <View style={{ width: '60%' }}>
                    <Text style={styles.textTitleCard} numberOfLines={2}>
                      {uppercaseWord(value.nameProduct)}
                    </Text>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          onDecrement(value);
                        }}
                      >
                        <Image
                          source={Min}
                          style={{ width: 25, height: 25, tintColor: COLORS.primary }}
                        />
                      </TouchableOpacity>
                      {/* <Text style={{ fontSize: 16 }}> {value.count} </Text> */}
                      <TextInput
                        value={value.count.toString()}
                        style={styles.inputCount}
                        keyboardType="numeric"
                        textAlign="center"
                        onChangeText={(text) => {
                          onChangeInputNumber(text, value);
                        }}
                        selectTextOnFocus={true}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          onIncrement(value);
                        }}
                      >
                        <Image
                          source={Add}
                          style={{ width: 25, height: 25, tintColor: COLORS.primary }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{ height: SIZES.height - 300, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Silahkan scan barcode atau tulis product di pencarian</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.cardBayar}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black }}>
          Rp. {formatNumber(amount)}
        </Text>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: COLORS.primary, borderRadius: 10 }}
          onPress={() => {
            if (amount != 0) {
              setModalVisible(!modalVisible);
            }
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.white }}>Bayar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, color: COLORS.black, fontWeight: 'bold' }}>
              Total Belanja Rp. {formatNumber(amount)}
            </Text>
            <View style={{ marginTop: 20 }} />
            <View style={{ width: '100%' }}>
              <CurrencyInput
                value={tunai}
                onChangeValue={(value) => {
                  setTunai(value);
                }}
                prefix="Rp. "
                delimiter="."
                precision={0}
                onChangeText={(formattedValue) => {}}
                placeholder="Uang Tunai"
                style={{
                  borderWidth: 0.5,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  borderRadius: 10,
                  borderColor: COLORS.primary,
                  paddingVertical: 20,
                }}
              />
              <Text style={{ fontSize: 20, color: COLORS.black, fontWeight: 'bold' }}>
                Kembalian Rp. {formatNumber(kembalian)}
              </Text>
              <View style={{ marginTop: 20 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  if (tunai != 0) {
                    navigation.navigate('FinalTransaksiPage', {
                      dataAdd: [...dataAdd],
                      amount,
                      tunai,
                      kembalian,
                    });
                    setDataAdd([]);
                    setAmount(0);
                    setTunai(0);
                    setKembalian(0);
                  }
                }}
              >
                <Text style={styles.textStyle}>Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    bottom: 10,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.3,
    borderTopColor: COLORS.primary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: COLORS.primary,
  },
  buttonClose: {
    backgroundColor: COLORS.red,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputCount: {
    width: 30,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.primary,
  },
});
