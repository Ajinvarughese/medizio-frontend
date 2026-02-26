import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "./api";
import { getUser } from "./auth";

const KEY = "appointments";

export const saveAppointment = async (appointment: any) => {
    await axios.post(`${API_URL}/appointment`, appointment);
};

export const getAppointments = async () => {
    const user = await getUser()
    const res = await axios.get(`${API_URL}/appointment/${user.id}`);
    return res.data;
};

export const getDoctorAppointments = async () => {
    const user = await getUser()
    const res = await axios.get(`${API_URL}/appointment/doctor/${user.id}`);
    return res.data;
};

export const deleteAppointment = async (id: number) => {
    return await axios.delete(`${API_URL}/appointment?id=${id}`)
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
