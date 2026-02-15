import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";

export default function ChangePassword() {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleChange = () => {
        if (!current || !newPass || !confirm) {
            return Alert.alert("Error", "Please fill all fields");
        }
        if (newPass !== confirm) {
            return Alert.alert("Error", "Passwords do not match");
        }

        Alert.alert("Success", "Password updated successfully");
        setCurrent("");
        setNewPass("");
        setConfirm("");
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Change Password</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput secureTextEntry style={styles.input} value={current} onChangeText={setCurrent} />

                <Text style={styles.label}>New Password</Text>
                <TextInput secureTextEntry style={styles.input} value={newPass} onChangeText={setNewPass} />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />

                <TouchableOpacity style={styles.button} onPress={handleChange}>
                    <Text style={styles.buttonText}>Update Password</Text>
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
        backgroundColor: "#37d06d",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonText: { color: "#062118", fontWeight: "900" },
});
