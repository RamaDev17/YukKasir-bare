import React from "react";
import { StyleSheet, View } from 'react-native'
import { Header } from "../../components/Header";
import { SIZES } from "../../constants";
import Pdf from 'react-native-pdf';

const HelpPdfPage = ({ navigation, route }) => {
    const pdf = route.params.pdf
    const source = {uri:`bundle-assets://${pdf}`};
    return (
        <View style={styles.container}>
            <Header name={"PDF"} navigation={navigation} />
            <View style={{marginTop: 75}} />
            <Pdf
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
                style={styles.pdf} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: SIZES.width,
        height: SIZES.height,
    }
})

export default HelpPdfPage