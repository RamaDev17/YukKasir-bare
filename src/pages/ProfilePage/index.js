import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Touchable, TouchableOpacity, Alert } from 'react-native';
import { ProfileImage } from '../../assets/images';
import { Header } from '../../components/Header';
import { COLORS } from '../../constants';
import { clearStorage, getData } from '../../utils/localStorage';
import { getAuth, signOut } from 'firebase/auth';
import { appFirebase } from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../../actions/authActions';
import AwesomeAlert from 'react-native-awesome-alerts';

const ProfilePage = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    getData('user').then((value) => {
      setUser(value);
    });
    appFirebase;
  }, []);

  const dispatch = useDispatch();

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      clearStorage();
      dispatch(loginUser(false, false));
      dispatch(registerUser(false, false));
      Alert.alert('Berhasil', 'Anda sudah Keluar', [
        {
          text: 'Ok',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginPage' }]
            });
          },
        },
      ]);
    });
  };
  return (
    <View style={styles.container}>
      {
        alert && (
          <AwesomeAlert
            show={alert}
            showProgress={false}
            title="Keluar"
            titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
            message="Yakin mau keluar aplikasi ?"
            messageStyle={{ fontSize: 20 }}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            confirmText="Iya"
            cancelText="Batal"
            confirmButtonColor={COLORS.primary}
            confirmButtonTextStyle={{ color: COLORS.white, fontSize: 18 }}
            cancelButtonColor={COLORS.red}
            cancelButtonTextStyle={{ color: COLORS.white, fontSize: 18 }}
            contentContainerStyle={{ padding: 20 }}
            onConfirmPressed={async () => { logout() }}
            onCancelPressed={() => {
              setAlert(false);
            }}
          />
        )
      }
      <Header navigation={navigation} name="Profile" />
      <View style={{ marginTop: 80 }} />
      <Image source={ProfileImage} style={{ width: 100, height: 200 }} />
      <View style={styles.card}>
        <Text style={styles.text}>{`Email : ${user.email}`}</Text>
        <View style={{ height: 20 }} />
        <Text style={styles.text}>{`Username : ${user.username}`}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setAlert(true)}>
        <Text style={styles.textButton}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderWidth: 0.3,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginVertical: 20,
  },
  text: {
    color: COLORS.black,
    fontSize: 16,
  },
  button: {
    padding: 20,
    width: '100%',
    backgroundColor: COLORS.red,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: COLORS.white,
    fontSize: 18,
  },
});

export default ProfilePage;
