import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Dolar,
  Inventaris,
  Laporan,
  Logo,
  Print,
  Product,
  RiwayatTransaksi,
  StoreFront,
  Transaksi,
} from '../../assets/icons';
import { Person } from '../../assets/images';
import { COLORS } from '../../constants';

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Image source={Logo} resizeMode="cover" style={{ width: 35, height: 35 }} />
          <Text style={styles.textTitle}>ukKasir</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
          <Image
            source={Person}
            resizeMode="cover"
            style={{ width: 35, height: 35, borderRadius: 35 / 2 }}
          />
        </TouchableOpacity>
      </View>

      {/* body */}
      <ScrollView style={styles.body}>
        {/* Toko */}
        <View style={styles.toko}>
          <View style={styles.cardToko}>
            {/* <Icon name="storefront" size={70} color={COLORS.white} /> */}
            <Image
              source={StoreFront}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.white }}
            />
            <View style={{ marginLeft: 20, justifyContent: 'space-evenly' }}>
              <View style={styles.childCardToko}>
                <Icon name="store" color={COLORS.white} size={25} />
                <Text style={styles.textCardToko}>Toko Ibnu ALI</Text>
              </View>
              <View style={styles.childCardToko}>
                <Icon name="place" color={COLORS.white} size={25} />
                <View>
                  <Text style={styles.textCardToko}>Blambangan, Rt 01/05</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Row 1 Produk Transaksi */}
        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.cardMenu}
            onPress={() => {
              navigation.navigate('ProductPage');
            }}
          >
            <Image
              source={Product}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.primary }}
            />
            <Text style={styles.textCardMenu}>Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardMenu}
            onPress={() => {
              navigation.navigate('TransaksiPage');
            }}
          >
            <Image
              source={Transaksi}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.primary }}
            />
            <Text style={styles.textCardMenu}>Transaksi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.cardMenu}
            onPress={() => navigation.navigate('RiwayatTransaksiPage')}
          >
            <Image
              source={RiwayatTransaksi}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.primary }}
            />
            <Text style={styles.textCardMenu}>Riwayat Transaksi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardMenu}
            onPress={() => {
              navigation.navigate('PrintPage');
            }}
          >
            <Image
              source={Print}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.primary }}
            />
            <Text style={styles.textCardMenu}>Pengaturan Print</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <TouchableOpacity style={styles.cardMenu}>
            <Image
              source={Laporan}
              resizeMode="cover"
              style={{ width: 70, height: 70, tintColor: COLORS.primary }}
            />
            <Text style={styles.textCardMenu}>Laporan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardMenu}>
            <Image
              source={Person}
              resizeMode="cover"
              style={{ width: 70, height: 70, borderRadius: 50 }}
            />
            <Text style={styles.textCardMenu}>Profil</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: -5,
  },
  body: {
    height: '100%',
    // paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 30,
  },
  toko: {
    height: 150,
    // backgroundColor: COLORS.primary,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardToko: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  childCardToko: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCardToko: {
    marginLeft: 5,
    color: COLORS.white,
  },
  row1: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  cardMenu: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textCardMenu: {
    color: COLORS.black,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  row2: {
    height: '19%',
    // backgroundColor: "green"
  },
  row3: {
    height: '19%',
    // backgroundColor: "yellow"
  },
});

export default HomePage;
