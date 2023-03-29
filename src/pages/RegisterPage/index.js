import { TextInput } from 'react-native-element-textinput';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Background, RegisterImage } from '../../assets/images';
import { COLORS } from '../../constants';
import { Eye, EyeOff, Email, ArrowBack } from '../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { async } from '@firebase/util';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vertifikasiPassword, setVertifikasiPassword] = useState('');
  const [visibel, setVisibel] = useState(true);
  const [loading, setLoading] = useState(false);
  const [colorInputEmail, setColorInputEmail] = useState('#ddd')
  const [colorInputPassword, setColorInputPassword] = useState('#ddd')

  const dispatch = useDispatch();

  const LoadingReducer = useSelector((state) => state.AuthReducer.registerLoading);
  const RegisterReducer = useSelector((state) => state.AuthReducer.registerResult);

  useEffect(() => {
    if (RegisterReducer) {
      navigation.replace('LoginPage');
    }
  }, [RegisterReducer]);

  const onSubmit = async () => {
    setLoading(true)
    setColorInputEmail('#ddd')
    setColorInputPassword('#ddd')
    const emailValid = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=5eb7899ad09242369581b5064ec6b8bd&email=${email}`)
    if ((username, email, password, vertifikasiPassword)) {
      if (password === vertifikasiPassword) {
        if (emailValid.data.is_smtp_valid.value) {
          setLoading(true);
          const datas = {
            username,
            email,
          };
          dispatch(registerUser(datas, password))

          setTimeout(() => {
            setLoading(false)
          }, 4000)

        } else {
          setLoading(false)
          setColorInputEmail(COLORS.red)
          Alert.alert('Gagal', 'Email harus terdaftar di platform email');
        }
      } else {
        setLoading(false)
        setColorInputPassword(COLORS.red)
        Alert.alert('Gagal', 'Password dan Kofirmasi Password harus sama');
      }
    } else {
      Alert.alert('Gagal', 'Form harus diisi semua');
      setLoading(false)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <TouchableOpacity
        style={styles.iconBack}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={ArrowBack}
          resizeMode="cover"
          style={{ width: 30, height: 30, tintColor: COLORS.black }}
        />
      </TouchableOpacity>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Image source={RegisterImage} style={{ width: 100, height: 200 }} />
        </View>
        <View style={styles.form}>
          <TextInput
            value={username}
            style={[styles.input, {borderColor: '#ddd'}]}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Nama"
            placeholder="Nama"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setUsername(value);
            }}
          />
          <View style={{ marginTop: 30 }} />
          <TextInput
            value={email}
            style={[styles.input, {borderColor: colorInputEmail}]}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Email"
            placeholder="Email"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setEmail(value);
            }}
          />
          <View style={{ marginTop: 30 }} />
          <TextInput
            value={password}
            style={[styles.input, {borderColor: colorInputPassword}]}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Password"
            placeholder="Password"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setPassword(value);
            }}
            secureTextEntry={visibel ? true : false}
            renderRightIcon={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setVisibel(!visibel);
                  }}
                >
                  <Image
                    source={visibel ? Eye : EyeOff}
                    style={{ width: 20, height: 20, tintColor: COLORS.primary }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            }}
          />
          <View style={{ marginTop: 30 }} />
          <TextInput
            value={vertifikasiPassword}
            style={[styles.input, {borderColor: colorInputPassword}]}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Konfirmasi Password"
            placeholder="Konfirmasi Password"
            placeholderTextColor="gray"
            focusColor={COLORS.primary}
            onChangeText={(value) => {
              setVertifikasiPassword(value);
            }}
            secureTextEntry={visibel ? true : false}
            renderRightIcon={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setVisibel(!visibel);
                  }}
                >
                  <Image
                    source={visibel ? Eye : EyeOff}
                    style={{ width: 20, height: 20, tintColor: COLORS.primary }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              onSubmit();
            }}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.textButton}>Registrasi</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: height / 3,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBackground: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  form: {
    height: height / 1.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    marginTop: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconBack: {
    padding: 10,
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 100,
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  inputStyle: { fontSize: 16 },
  labelStyle: {
    fontSize: 14,
    position: 'absolute',
    top: -10,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
    color: COLORS.black,
  },
  placeholderStyle: { fontSize: 16, color: COLORS.black },
  textErrorStyle: { fontSize: 16 },
});

export default RegisterPage;
