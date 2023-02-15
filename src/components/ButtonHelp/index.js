import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { Next } from "../../assets/icons";
import { COLORS } from "../../constants";

const ButtonHelp = ({navigation, icon, text, pdf}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => {navigation.navigate("HelpPdfPage", {pdf})}}>
            <View style={{ width: '8%' }}>
                <Image source={icon} style={styles.imageCard} />
            </View>
            <View style={{ marginRight: '2%' }} />
            <View style={{ width: '80%' }}>
                <Text style={styles.textCard}>{text}</Text>
            </View>
            <View style={{ marginRight: '2%' }} />
            <View style={{ width: '8%' }}>
                <Image source={Next} style={styles.imageCard} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary
    },
    imageCard: {
        tintColor: COLORS.primary,
        height: 25,
        width: 25
    },
    textCard: {
        color: COLORS.black,
        fontSize: 16
    }
})

export default ButtonHelp