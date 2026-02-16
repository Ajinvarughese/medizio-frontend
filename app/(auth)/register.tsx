import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { saveUser } from "@/utils/auth";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

type Role = "patient" | "doctor" | "admin";

export default function Register() {
    const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor specific
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setPhoto(res.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Email and password are required.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      setLoading(true);

      let payload: any = {
        email,
        password,
      };

      if (role === "patient") {
        payload.name = name;
      }

      if (role === "doctor") {
        payload.specialization = specialization;
        payload.experience = Number(experience);
        payload.picture = photo;
      }

      await saveUser(payload, role);

      Alert.alert("Success", `${role} registered successfully!`);
      
      if(role === "patient") router.push("/(tabs)");
      else if (role === "doctor") router.push("/(doctor)/(tabs)");
      else if (role === "admin") router.push("/(admin)");
    } catch (error) {
      const err = error as AxiosError;
      Alert.alert("Error", err.response?.data as string || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 22 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        {/* ROLE SELECTOR */}
        <View style={styles.roleRow}>
          {["Patient", "Doctor", "Admin"].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, role === r && styles.roleActive]}
              onPress={() => setRole(r as Role)}
            >
              <Text
                style={[
                  styles.roleText,
                  role === r && { color: "#fff" },
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {role !== "admin" && (
          <Input label="Full Name" value={name} onChange={setName} />
        )}

        <Input label="Email Address" value={email} onChange={setEmail} />
        <Input label="Password" secure value={password} onChange={setPassword} />
        <Input
          label="Confirm Password"
          secure
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {role === "doctor" && (
          <>
            <Input
              label="Specialization"
              value={specialization}
              onChange={setSpecialization}
            />
            <Input
              label="Experience (Years)"
              keyboard="numeric"
              value={experience}
              onChange={setExperience}
            />

            <Text style={styles.label}>Profile Photo</Text>
            <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <Text style={{ color: "#102A43" }}>Tap to Upload</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={handleRegister} style={styles.primaryBtn}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- Input Component ---------------- */

interface InputProps {
  label: string;
  secure?: boolean;
  keyboard?: any;
  value: string;
  onChange: (text: string) => void;
}

const Input = ({
  label,
  secure,
  keyboard,
  value,
  onChange,
}: InputProps) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      secureTextEntry={secure}
      keyboardType={keyboard || "default"}
      style={styles.input}
      value={value}
      onChangeText={onChange}
    />
  </>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f7f9fc" },

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

  roleRow: {
    flexDirection: "row",
    marginTop: 14,
    marginBottom: 10,
  },

  roleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(16,42,67,0.06)",
    alignItems: "center",
    marginHorizontal: 4,
  },

  roleActive: {
    backgroundColor: "#37d06d",
  },

  roleText: {
    fontWeight: "800",
    color: "#102A43",
  },

  label: {
    marginTop: 12,
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

  photoBox: {
    height: 110,
    borderRadius: 16,
    backgroundColor: "rgba(16,42,67,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
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
});
