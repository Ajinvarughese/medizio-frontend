import axios from "axios";
import API_URL from "./api";

export const getDoctorSpeciality = async () => {
    const res = await axios.get(`${API_URL}/speciality`);
    return res.data;
}

export const updateDoctor = async (data : any) => {
    await axios.put(`${API_URL}/doctor`, data);
}

export const updateDoctorStatus = async (payload : any) => {
    await axios.put(`${API_URL}/doctor/update/status`, payload)
}

export const verifyDoctor = async (payload : any) => {
    await axios.put(`${API_URL}/doctor/verify`, payload)
}

export const fetchAllDoctors = async () => {
    return (await axios.get(`${API_URL}/doctor`)).data;
}

export const deleteDoctor =async (id:number) => {
    await axios.delete(`${API_URL}/doctor/${id}`);
}