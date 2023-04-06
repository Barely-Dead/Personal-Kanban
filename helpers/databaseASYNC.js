import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value != null ? value : null
    } catch(e) {
        console.log("error getting value:", e);
    }
  }

  export const getDataObject = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log("error getting object:", e);
    }
  }

  export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      return 200
    } catch (e) {
      console.log("error saving value:", e);
    }
  }
  

  export const storeDataObject = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return 200
    } catch (e) {
      console.log("error saving object:", e);
    }
  }

  export const placeholders = [
    {
        id: -1,
        name: 'placeholder',
        status: 'backlog',
        visible: 0
    },
    {
        id: -2,
        name: 'placeholder',
        status: 'To do',
        visible: 0
    },
    {
        id: -3,
        name: 'placeholder',
        status: 'inProgress',
        visible: 0
    },
    {
        id: -4,
        name: 'placeholder',
        status: 'review',
        visible: 0
    },
    {
        id: -5,
        name: 'placeholder',
        status: 'complete',
        visible: 0
    },
  ]
  