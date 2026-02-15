import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Availability() {
    return (
        <ScrollView style={styles.root}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Availability ⏳</Text>

            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => (
                <View key={day} style={styles.row}>
                    <Text style={styles.day}>{day}</Text>
                    <Switch value={true} />
                </View>
            ))}

            <View style={styles.card}>
                <Text style={styles.timeTitle}>Working Hours</Text>
                <Text style={styles.time}>09:00 AM — 05:00 PM</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },
    bgBlob1: { position: "absolute", top: -120, left: -90, width, height: width, borderRadius: width, backgroundColor: "rgba(70,205,255,0.18)" },
    bgBlob2: { position: "absolute", bottom: -140, right: -90, width, height: width, borderRadius: width, backgroundColor: "rgba(55,208,109,0.14)" },

    header: { fontSize: 24, fontWeight: "900", color: "#102A43", marginBottom: 20 },

    row: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    day: { fontSize: 14, fontWeight: "800", color: "#102A43" },

    card: { backgroundColor: "#fff", padding: 16, borderRadius: 20, marginTop: 20 },
    timeTitle: { fontSize: 14, fontWeight: "900", color: "#102A43" },
    time: { marginTop: 6, fontSize: 13, color: "#64748b" },
});
