import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function EditProfile() {
    const [name, setName] = useState("Patient Name");
    const [email, setEmail] = useState("Eg: patient@email.com");
    const [phone, setPhone] = useState("Enter Your phone number");

    const saveProfile = () => {
        Alert.alert("Success", "Profile updated successfully");
    };

    return (
        <ScrollView style={styles.root}>
            <Text style={styles.header}>Edit Profile</Text>

            <View style={styles.card}>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />

                <TouchableOpacity style={styles.btn} onPress={saveProfile}>
                    <Text style={styles.btnText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },
    header: { fontSize: 24, fontWeight: "900", marginBottom: 20, color: "#102A43" },
    card: { backgroundColor: "#fff", padding: 16, borderRadius: 20 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, marginBottom: 12 },
    btn: { backgroundColor: "#37d06d", padding: 14, borderRadius: 12 },
    btnText: { textAlign: "center", fontWeight: "900", color: "#062118" },
});
