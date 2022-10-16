import { TextInput } from 'react-native-element-textinput';
import React, { useEffect, useState } from 'react'
import { ImageBackground, ScrollView, StatusBar, Text, Dimensions, StyleSheet, Alert, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Background } from '../../assets/images'
import { COLORS } from '../../constants';
import { Eye, EyeOff } from '../../assets/icons'
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../actions/authActions';

const { width, height } = Dimensions.get("window");

const LoginPage = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [visibel, setVisibel] = useState(true)

    const dispatch = useDispatch();

    const LoadingReducer = useSelector(state => state.AuthReducer.loginLoading)
    const LoginReducer = useSelector(state => state.AuthReducer.loginResult)
    
    useEffect(() => {
        if (LoginReducer) {
            navigation.replace("HomePage")
        }
    }, [LoginReducer])

    const onSubmit = () => {
        if (email && password) {
          dispatch(loginUser(email, password));
        } else {
          Alert.alert('Gagal', 'Form harus diisi semua');
        }
      };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <ImageBackground source={Background} resizeMode="cover" style={styles.imageBackground}>
                <Text style={styles.textBackground}>Login</Text>
            </ImageBackground>
            <ScrollView>

                <View style={styles.form}>
                    <TextInput
                        value={email}
                        style={styles.input}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle}
                        label="Email"
                        placeholder="Email"
                        placeholderTextColor="gray"
                        focusColor={COLORS.primary}
                        onChangeText={(value) => { setEmail(value) }}
                    />
                    <View style={{ marginTop: 30 }} />
                    <TextInput
                        value={password}
                        style={styles.input}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle}
                        label="Password"
                        placeholder="Password"
                        placeholderTextColor="gray"
                        focusColor={COLORS.primary}
                        onChangeText={(value) => { setPassword(value) }}
                        secureTextEntry={visibel ? true : false}
                        renderRightIcon={() => {
                            return (
                                <TouchableOpacity onPress={() => { setVisibel(!visibel) }}>
                                    <Image source={visibel ? Eye : EyeOff} style={{ width: 20, height: 20, tintColor: COLORS.primary }} resizeMode="cover" />
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={() => { onSubmit() }}>
                        {LoadingReducer ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.textButton}>Login</Text>}
                    </TouchableOpacity>
                    <View style={{ marginTop: 20, width: "100%", flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: COLORS.black, fontSize: 16 }}>Belum punya akun? </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("RegisterPage") }}>
                            <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: 'bold' }}>DAFTAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    imageBackground: {
        height: height / 2.8,
        width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBackground: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white
    },
    form: {
        height: height / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loginButton: {
        width: "100%",
        paddingVertical: 15,
        marginTop: 40,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    textButton: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#DDDDDD',
        width: '100%'
    },
    inputStyle: { fontSize: 16 },
    labelStyle: {
        fontSize: 14,
        position: 'absolute',
        top: -10,
        backgroundColor: 'white',
        paddingHorizontal: 4,
        marginLeft: -4,
        color: COLORS.black
    },
    placeholderStyle: { fontSize: 16, color: COLORS.black },
    textErrorStyle: { fontSize: 16 },
})

export default LoginPage