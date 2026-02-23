import { getUser } from "@/utils/auth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";


export default function EditDoctorProfile() {
    const [mockDoctor, setDoctor] = useState({});

    useEffect(() => {
        const fetchDoctor = async () => {
            setDoctor(await getUser());
        }
        fetchDoctor();
    }, []);

    const [name, setName] = useState(mockDoctor.name || "");
    const [specialization, setSpecialization] = useState(mockDoctor.specialization || "");
    const [phone, setPhone] = useState(mockDoctor.phone || "");
    const [email, setEmail] = useState(mockDoctor.email || "");

    const handleSave = () => {
        Alert.alert("Profile Updated", "Doctor details saved successfully");
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Edit Profile</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Specialization</Text>
                <TextInput style={styles.input} value={specialization} onChangeText={setSpecialization} />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={styles.label}>Email Address</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4FBF7", padding: 20, paddingTop: 60 },
    header: { fontSize: 22, fontWeight: "900", color: "#102A43", marginBottom: 20 },

    card: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 18,
    },

    label: { fontSize: 13, fontWeight: "700", color: "#334155", marginTop: 10 },
    input: {
        marginTop: 6,
        backgroundColor: "#f8fafc",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },

    button: {
        marginTop: 20,
        backgroundColor: "#102A43",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "900" },
});
