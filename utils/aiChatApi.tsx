import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./auth";
import API_URL from "./api";
import { Platform } from "react-native";

export const getChatLog = async () => {
  const user = await AsyncStorage.getItem("user");
  const res = await axios.get(`${API_URL}/ai/chat`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(user).token}`,
    },
  });

  return res.data;
};

export const generateAiResponse = async (prompt: string, file?: any) => {
  const formData = new FormData();

  const user = await getUser();

  formData.append("text", prompt);
  formData.append("userId", user.id.toString());

  if (file) {
    if (Platform.OS === "web") {
      // convert blob url → real blob
      const blob = await fetch(file.uri).then((r) => r.blob());

      const realFile = new File([blob], file.name, {
        type: file.type || "application/pdf",
      });

      formData.append("patient_report", realFile);
    } else {
      formData.append("patient_report", {
        uri: file.uri,
        name: file.name || "report.pdf",
        type: file.mimeType || "application/pdf",
      } as any);
    }
  }

  const res = await axios.post(`${API_URL}/ai/chat`, formData);

  return res.data;
};

export const deleteChatLog = async () => {
  const token = await AsyncStorage.getItem("user");
  const res = await axios.delete(`${API_URL}/ai/chat`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(token).token}`,
    },
  });
  return res.data;
};
