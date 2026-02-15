import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Register() {
    const [role, setRole] = useState("Patient");
    const [photo, setPhoto] = useState<string | null>(null);

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!res.canceled) setPhoto(res.assets[0].uri);
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ padding: 22 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>

                {/* ROLE SELECTOR */}
                <View style={styles.roleRow}>
                    {["Patient", "Doctor", "Admin"].map((r) => (
                        <TouchableOpacity
                            key={r}
                            style={[styles.roleBtn, role === r && styles.roleActive]}
                            onPress={() => setRole(r)}
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

                <Input label="Full Name" />
                <Input label="Email Address" />
                <Input label="Password" secure />
                <Input label="Confirm Password" secure />

                {role === "Doctor" && (
                    <>
                        <Input label="Specialization" />
                        <Input label="Experience (Years)" keyboard="numeric" />
                        <Input label="Hospital Name" />
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

                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryText}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const Input = ({ label, secure, keyboard }: any) => (
    <>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            secureTextEntry={secure}
            keyboardType={keyboard || "default"}
            style={styles.input}
        />
    </>
);
const styles = StyleSheet.create({
    root: { flex: 1 },

    bgBlob1: {
        position: "absolute",
        width: 340,
        height: 340,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.18)",
        top: -120,
        left: -100,
    },
    bgBlob2: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.15)",
        bottom: -140,
        right: -80,
    },

    card: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: "rgba(255,255,255,0.75)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },

    title: { fontSize: 26, fontWeight: "900", color: "#102A43" },

    roleRow: { flexDirection: "row", marginTop: 14, marginBottom: 10 },
    roleBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 14,
        backgroundColor: "rgba(16,42,67,0.06)",
        alignItems: "center",
        marginHorizontal: 4,
    },
    roleActive: { backgroundColor: "#37d06d" },
    roleText: { fontWeight: "800", color: "#102A43" },

    label: { marginTop: 12, fontWeight: "800", color: "#102A43" },
    input: {
        marginTop: 6,
        backgroundColor: "rgba(255,255,255,0.9)",
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
    photo: { width: "100%", height: "100%", borderRadius: 16 },

    primaryBtn: {
        marginTop: 22,
        backgroundColor: "#102A43",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },
    primaryText: { color: "#fff", fontWeight: "900" },
});
