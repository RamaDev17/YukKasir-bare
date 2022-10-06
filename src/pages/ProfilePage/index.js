import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from "../../constants";

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            <Text>ProfilePage</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    }
})

export default ProfilePage;