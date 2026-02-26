import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import API_URL from "./api";

const KEY = "NUVICA_PREDICTION_HISTORY";

export async function getPredictionHistory() {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function savePredictionResult(data: any) {
    const all = await getPredictionHistory();
    const next = [
        ...all,
        {
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            ...data,
        },
    ];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
}

export async function clearPredictionHistory() {
    await AsyncStorage.removeItem(KEY);
}


export const extractFromFile = async (file: any, disease: string) => {
  try {
    const formData = new FormData();

    if (Platform.OS === "web") {
      formData.append("file", file.file);
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "report.pdf",
        type: file.mimeType || "application/pdf",
      } as any);
    }

    const res = await axios.post(
      `${API_URL}/disease/file/upload?disease=${disease}`,
      formData,
      {
        timeout: 20000, // 20 sec timeout for heavy PDFs
      }
    );

    return res.data;

  } catch (error: any) {
    console.error("Extract From File Error:", error?.response?.data || error.message);

    throw new Error(
      error?.response?.data?.message ||
      "Failed to extract medical data from file"
    );
  }
};