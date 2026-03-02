import { getUser } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DoctorVerificationPending() {
  const router = useRouter();
  const checkDoctor = async () => {
    try {
      const res = await getUser();
      if(res.role == "doctor") {
        if(res.verified) {
          router.push("/(doctor)/(tabs)");
        }
      }else if(res.role == "admin") {
        router.push("/(admin)");
      }else if(res.role == "patient") {
        router.push("/(tabs)/home");
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error?.response?.status === 403) {
          console.log("Error: ", error);
        }else if(error?.response?.status === 423) {
          router.push("/(auth)/suspended");
        }
      }
    }
  }

  useEffect(() => {
    checkDoctor();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>⏳</Text>

        <Text style={styles.title}>Verification in Progress</Text>

        <Text style={styles.message}>
          Thank you for registering with Medizio.
          {"\n\n"}
          Our admin team is currently reviewing your profile and documents. Once
          verified, you will be able to start receiving appointments.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔎 Verification usually takes a few hours.
          </Text>
          <Text style={styles.infoText}>
            📧 You will be notified once your account is approved.
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/welcome")} style={styles.button}>
          <Text style={styles.buttonText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FBF7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },

  icon: {
    fontSize: 60,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#102A43",
    marginBottom: 12,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  infoBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    width: "100%",
  },

  infoText: {
    fontSize: 13,
    color: "#065f46",
    marginBottom: 4,
    textAlign: "center",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#37d06d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  buttonText: {
    color: "#062118",
    fontWeight: "900",
    fontSize: 14,
  },
});
