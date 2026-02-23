import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "./api";

const KEY = "appointments";

export const saveAppointment = async (appointment: any) => {
    await axios.post(`${API_URL}/appointment`, appointment);
};

export const getAppointments = async () => {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
};

export const deleteAppointment = async (id: string) => {
    const prev = await getAppointments();
    const next = prev.filter((a: any) => a.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
};

export const isAvailable = async (doctorId: number, date: string, time: string) => {
    const payload = {
        doctorId,
        date,
        time
    }

    const res = await axios.post(`${API_URL}/appointment/availability`, payload);
    return res.data;
}
