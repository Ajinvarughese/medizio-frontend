import React, { useEffect, useState } from "react";
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
import { saveUser, uploadImage } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import API_URL from "@/utils/api";
import { Picker } from "@react-native-picker/picker";
import { getDoctorSpeciality } from "@/utils/doctor";

type Role = "patient" | "doctor" | "admin";

export default function Register() {
    const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [dob, setDob] = useState("");
  // Doctor specific
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [specialityId, setSpecialityId] = useState<number | null>(null);

  const [experience, setExperience] = useState("");

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const data = await getDoctorSpeciality();
        setSpecialities(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load specialities");
      }
    };

    fetchSpecialities();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setPhoto(res.assets[0]); // ✅ store full object
    }
  };


  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Email and password are required.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    if (password.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      // 🔥 STEP 2: Send register payload
      let payload: any = {
        email,
        password,
        dob,
        location,
      };

      if (role === "patient") {
        payload = {
          ...payload,
          name,
        };
      }
      

      if (role === "doctor") {
        const uploadedImageUrl = await uploadImage(photo);
        if (!specialityId) {
          return Alert.alert("Error", "Please select a speciality.");
        }

        payload = {
          ...payload,
          name,
          experience: Number(experience),
          picture: uploadedImageUrl,
          specialityId
        }
      } 
      

      await saveUser(payload, role);

      Alert.alert("Success", `${role} registered successfully!`);

      if (role === "patient") router.push("/(tabs)/home");
      else if (role === "doctor") router.push("/(doctor)/(tabs)");
      else router.push("/(admin)");
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
          {["patient", "doctor", "admin"].map((r) => (
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
                {r.toUpperCase()}
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
        <Input
            label="Date of birth"
            value={dob}
            onChange={setDob}
          />
        <Input
            label="Location"
            value={location}
            onChange={setLocation}
          />
        
        {role === "doctor" && (
          <>
           <Text style={styles.label}>Specialization</Text>

            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={specialityId}
                onValueChange={(itemValue) => setSpecialityId(itemValue)}
                style={styles.picker}
                dropdownIconColor="#102A43"
              >
                <Picker.Item label="Select Speciality" value={null} />
                {specialities.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </View>
            <Input
              label="Experience (Years)"
              keyboard="numeric"
              value={experience}
              onChange={setExperience}
            />
            
            <Text style={styles.label}>Profile Photo</Text>
            <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
              {photo ? (
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.photoPlaceholder}>Tap to Upload</Text>
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

        <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
          >
              <Text style={styles.link}>
                  Already have an account? Login
              </Text>
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

  photoBox: {
    height: 160,
    borderRadius: 20,
    backgroundColor: "rgba(16,42,67,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    overflow: "hidden",   // 🔥 VERY IMPORTANT
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  photoPlaceholder: {
    color: "#102A43",
    fontWeight: "600",
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

  link: {
        marginTop: 16,
        textAlign: "center",
        color: "#102A43",
        fontWeight: "700",
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
  dropdownWrapper: {
    marginTop: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16,42,67,0.08)",
    backgroundColor: "#fff",
    justifyContent: "center",
    height: 54,
    paddingHorizontal: 6,
  },

  picker: {
    color: "#102A43",
  },
});
