import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (item, value) => {
  try {
    await AsyncStorage.setItem(item, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log(e);
  }
};

export const clearStorage = async () => {
  AsyncStorage.clear();
};

export const mergeData = async (item, value) => {
  try {
    await AsyncStorage.mergeItem(item, JSON.stringify(value));
    console.log('success');
  } catch (e) {
    console.log(e);
  }
};
