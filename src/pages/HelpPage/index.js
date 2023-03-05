import React from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import { Header } from '../../components/Header';
import { COLORS } from '../../constants';
import { Add, Edit, Delete, Print, Transaksi, Graph, Laporan } from '../../assets/icons';
import ButtonHelp from '../../components/ButtonHelp';
import Icon from 'react-native-vector-icons/Ionicons'

const HelpPage = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Header name={"Bantuan"} navigation={navigation} />
            <View style={{marginTop: 80}} />
            <ScrollView style={{marginLeft: 20}}>
                <ButtonHelp icon={Add} text="Cara menambah data produk" navigation={navigation} pdf={"tambahProduk.pdf"} />
                <ButtonHelp icon={Edit} text="Cara mengubah data produk" navigation={navigation} pdf={"updateProduk.pdf"} />
                <ButtonHelp icon={Delete} text="Cara menghapus data produk" navigation={navigation} pdf={"deleteProduk.pdf"} />
                <ButtonHelp icon={Print} text="Cara menyambungkan printer bluetooth" navigation={navigation} pdf={"printer.pdf"} />
                <ButtonHelp icon={Transaksi} text="Cara melakukan proses transaksi sampai mencetak struk transaksi" navigation={navigation} pdf={"transaksi.pdf"} />
                <ButtonHelp icon={Graph} text="Cara melihat grafik profit sesuai dengan bulan dan tahun yang diinginkan" navigation={navigation} pdf={"profit.pdf"} />
                <ButtonHelp icon={Laporan} text="Cara meng-export data penjualan sesuai dengan bulan dan tahun yang diinginkan" navigation={navigation} pdf={"laporan.pdf"} />
                <View style={{marginTop: 20}} />
                <View style={styles.card}>
                    <Text style={styles.textCard}>Jika Aplikasi YukKasir terjadi kesalahan, silahkan hubungi kontak dibawah ini:</Text>
                    <View style={{marginTop: 10}} />
                    <View style={styles.row}>
                        <Icon name="ios-mail" color={COLORS.primary} size={25} />
                        <View style={{marginLeft: 10}} />
                        <Text style={styles.textCard}>rwamdhaney2@gmail.com</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="ios-logo-whatsapp" color={COLORS.green} size={25} />
                        <View style={{marginLeft: 10}} />
                        <Text style={styles.textCard}>085867635654</Text>
                    </View>
                </View>
                <View style={{marginBottom: 100}} />
            </ScrollView>
            {/* <Pdf
                trustAllCerts={false}
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    card: {
        padding: 5,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        marginRight: 20
    },
    textCard: {
        color: COLORS.black,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default HelpPage