import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { ArrowBack } from "../../assets/icons";
import { COLORS } from "../../constants";

export const Header = ({ navigation, name }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{name}</Text>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                <Image source={ArrowBack} style={{ height: 30, width: 30, tintColor: COLORS.black }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 99,
        shadowColor: "#000",
        borderBottomWidth: 0.1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
        backgroundColor: COLORS.white
    },
    text: {
        color: COLORS.black,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    icon: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 12,
        left: 10
    }
})