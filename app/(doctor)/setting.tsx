import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Settings() {
    const confirmDelete = () => Alert.alert("Delete Account", "This action cannot be undone.");

    return (
        <ScrollView style={styles.root}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Account Settings ⚙️</Text>

            <TouchableOpacity style={styles.card} onPress={() => router.push("/(doctor)/change-password")}>
                <Text style={styles.item}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => router.push("/(doctor)/edit-profile")}>
                <Text style={styles.item}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, { borderColor: "#f87171" }]} onPress={confirmDelete}>
                <Text style={[styles.item, { color: "#dc2626" }]}>Delete Account</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },
    bgBlob1: { position: "absolute", top: -120, left: -90, width, height: width, borderRadius: width, backgroundColor: "rgba(70,205,255,0.18)" },
    bgBlob2: { position: "absolute", bottom: -140, right: -90, width, height: width, borderRadius: width, backgroundColor: "rgba(55,208,109,0.14)" },

    header: { fontSize: 24, fontWeight: "900", color: "#102A43", marginBottom: 20 },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    item: { fontSize: 14, fontWeight: "800", color: "#102A43" },
});
