import axios from "axios";
import API_URL from "./api";

export const getDoctorSpeciality = async () => {
    const res = await axios.get(`${API_URL}/speciality`);
    return res.data;
}

export const updateDoctor = async (data : any) => {
    await axios.put(`${API_URL}/doctor`, data);
}

export const fetchAllDoctors = async () => {
    return (await axios.get(`${API_URL}/doctor`)).data;
}