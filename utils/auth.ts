import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "./api";
import { useRouter } from "expo-router";

const USER_KEY = "user";
const router = useRouter();


interface Login {
    loginId: string;
    password: string;
}

export const saveUser = async (user: any, role: string) => {
    const endpoint = role 
    const res = await axios.post(`${API_URL}/${endpoint}`, user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify({token: res.data.password, role}));
};

export const getUser = async () => {
    const data = await AsyncStorage.getItem(USER_KEY);

    if(data != null) {
        const token = JSON.parse(data).token;
        const endpoint = JSON.parse(data).role.toLowerCase();

        const res = await axios.get(`${API_URL}/${endpoint}/auth/token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userData = {...res.data, role: endpoint};
        return userData;
         
    }
    return null;
};

export const authUser = async (login: Login, endpoint: string) => {
    console.log(login)
    const res = await axios.post(`${API_URL}/${endpoint}/login`, login);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify({token: res.data.password, role: endpoint}));
}

export const logout = async () => {
    await AsyncStorage.removeItem(USER_KEY);
};



export const identifyUser = async () => {
    const res = await getUser();

    switch (res?.role) {
        case "patient":
            router.push("/(tabs)/home");
            break;
        case "doctor":
            router.push("/(doctor)/(tabs)");
            break;
        case "admin":
            router.push("/(admin)");
            break;    
        default:
            break;
    }
}