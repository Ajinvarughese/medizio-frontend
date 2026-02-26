import axios from "axios";
import { Platform } from "react-native";
import API_URL from "./api";

export const uploadPatientDoc = async (file: any) => {
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
      `${API_URL}/appointment/file/upload`,
      formData,
      {
        timeout: 20000, // 20 sec timeout for heavy PDFs
      }
    );

    return res.data[0];

  } catch (error: any) {
    console.error("Uploading File Error:", error?.response?.data || error.message);

    throw new Error(
      error?.response?.data?.message ||
      "Failed to upload medical data"
    );
  }
};