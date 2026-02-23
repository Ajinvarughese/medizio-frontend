import axios from "axios"
import API_URL from "./api";

export const getAllPatients = async () => {
    const res = await axios.get(`${API_URL}/patient`);
    return res.data;
}