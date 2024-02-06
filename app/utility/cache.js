import AyncStorage from "@react-native-async-storage/async-storage/src";


const prefix = "cache"

const store = async (key, value) => {
    try {
        await AyncStorage.setItem(prefix + key, JSON.stringify(value))
    } catch (error) {
        console.log(error)
    }
}

const get = async (key) => {
    try {
        const value = await AyncStorage.getItem(prefix + key)
        return value ? JSON.parse(value) : null
    } catch (error) {
        console.log(error)
    }
}

const clear = async (key) => {
    try {
        await AyncStorage.removeItem(prefix + key);
    } catch (error) {
        console.log(error);
    }
};
export default {
    store,
    get,
    clear
}

