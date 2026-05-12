import axios from "axios";
import { Platform } from "react-native";
import API_URL from "./api";
import { getUser } from "./auth";

export const uploadPatientDoc = async (file: any) => {
  try {
    const formData = new FormData();
    const user = await getUser();

    if (Platform.OS === "web") {
      // Convert blob URL → real blob (same as your working code)
      const blob = await fetch(file.uri).then((r) => r.blob());

      const realFile = new File([blob], file.name || "report.pdf", {
        type: file.type || "application/pdf",
      });

      formData.append("file", realFile);
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "report.pdf",
        type: file.mimeType || "application/pdf",
      } as any);
    }

    // (Optional) attach userId if backend expects it
    formData.append("userId", user.id.toString());

    const res = await axios.post(
      `${API_URL}/appointment/file/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`, // ✅ added auth like your working code
        },
        timeout: 20000,
      }
    );

    return res.data[0];
  } catch (error: any) {
    console.error(
      "Uploading File Error:",
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.message || "Failed to upload medical data"
    );
  }
};
