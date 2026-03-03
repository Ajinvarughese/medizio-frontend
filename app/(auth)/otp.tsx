import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { send, EmailJSResponseStatus } from "@emailjs/react-native";
import { useRouter } from "expo-router";

export default function VerifyOTP() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      Alert.alert("Success", "OTP Verified");

      router.push("/(tabs)/home"); // navigate after verification
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 22 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />

        <TouchableOpacity style={styles.secondaryBtn} onPress={sendOtp}>
          {loading ? (
            <ActivityIndicator color="#102A43" />
          ) : (
            <Text style={styles.secondaryText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter OTP"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={verifyOtp}>
          <Text style={styles.primaryText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  card: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#102A43",
  },

  subtitle: {
    marginTop: 6,
    color: "#627D98",
    fontWeight: "600",
  },

  label: {
    marginTop: 16,
    fontWeight: "800",
    color: "#102A43",
  },

  input: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(16,42,67,0.08)",
  },

  primaryBtn: {
    marginTop: 22,
    backgroundColor: "#102A43",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "900",
  },

  secondaryBtn: {
    marginTop: 14,
    backgroundColor: "rgba(16,42,67,0.06)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#102A43",
    fontWeight: "800",
  },
});
