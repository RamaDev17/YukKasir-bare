import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Linking, Text, Dimensions, Image, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Barcode, Close, FlashOff, FlashOn } from '../../assets/icons';
import { COLORS } from '../../constants';
const { width, height } = Dimensions.get("window");
import SearchBar from 'react-native-platform-searchbar';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import useSound from "react-native-use-sound";
import { Header } from '../../components/Header';
import { getData } from '../../utils/localStorage';

const TransaksiPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [flash, setFlash] = useState(false)
  const [productLocal, setProductLocal] = useState([])
  const [productSearch, setProductSearch] = useState([])

  const soundScanner = "soundbarcode.mp3";
  const [play, pause, stop, data] = useSound(soundScanner, { volume: 3 });

  const onChangeText = (value) => {
    if (value != '') {
      setLoading(true)
    } else {
      setLoading(false)
    }
    setSearchQuery(value);
  }

  const handleBarCodeScanned = (value) => {
    play()
    setScanned(true);
    setSearchQuery(value.data)
  };

  const onTorch = () => {
    setFlash(!flash)
  }

  useEffect(() => {
    getData("products")
      .then(res => {
        setProductLocal(res)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    Object.keys(productLocal).map((key, index) => {
      if (searchQuery == productLocal[key].id || searchQuery == productLocal[key].nameProduct) {
        const data = productLocal[key]
        const newDataSearch = {
          id: data.id,
          nameProduct: data.nameProduct,
          category: data.category,
          price: data.price,
          stock: data.stock
        }
        setProductSearch(newDataSearch)
        setLoading(false)
      } else if(searchQuery == '') {
        setProductSearch([])
      }
    })
  }, [searchQuery])

  return (
    <ScrollView style={styles.container}>
      <Header name="Transaksi" navigation={navigation} />
      <View style={styles.header}>
        <View style={{ flex: 4 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={onChangeText}
            placeholder="Search"
            theme="light"
            style={styles.searchBar}
          >
            {loading ? (
              <ActivityIndicator style={{ marginRight: 10 }} />
            ) : <></>}
          </SearchBar>

        </View>
        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => { setOpen(!open) }}>
          <Image source={Barcode} style={{ height: 50, width: 50, tintColor: COLORS.primary }} resizeMode="cover" />
        </TouchableOpacity>
      </View>
      {
        open ? (
          <Modal
            animationType='slide'
            transparent={true}
            visible={open}
            onRequestClose={() => {
              setOpen(!open)
            }}
            statusBarTranslucent={true}
          >
            <QRCodeScanner
              onRead={handleBarCodeScanned}
              flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
              reactivate={true}
              reactivateTimeout={1500}
              cameraStyle={{ width, height }}
              fadeIn={true}
              showMarker={true}
              containerStyle={{ backgroundColor: COLORS.white }}
            />
            {scanned &&
              <TouchableOpacity style={styles.buttonAgain} onPress={() => setOpen(false)}>
                <Text style={{ color: COLORS.white }}>Tutup</Text>
              </TouchableOpacity>
            }

            <TouchableOpacity style={styles.iconClose} onPress={() => setOpen(!open)}>
              <Image source={Close} resizeMode="cover" style={{ height: 30, width: 30, tintColor: COLORS.white }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTorch} onPress={() => onTorch()}>
              <Image source={flash ? FlashOff : FlashOn} resizeMode="cover" style={{ height: 30, width: 30, tintColor: COLORS.white }} />
            </TouchableOpacity>
          </Modal>
        ) : <View />
      }
      <Text>{productSearch.nameProduct}</Text>
    </ScrollView>
  )
}

export default TransaksiPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 80
  },
  textHeader: {
    color: COLORS.black,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonBack: {
    padding: 10,
    position: 'absolute',
    top: 25,
    left: 10
  },
  textInput: {
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    flex: 4
  },
  searchView: {
    borderWidth: 1.5,
    borderColor: COLORS.primary
  },
  iconClose: {
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  iconTorch: {
    position: 'absolute',
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
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
    borderRadius: 50
  }
});