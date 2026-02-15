import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { doctorNotifications } from "@/mock/notifications";

const { width } = Dimensions.get("window");

export default function DoctorNotifications() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Notifications 🔔</Text>

            {doctorNotifications.map((n, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.dot} />
                    <Text style={styles.text}>{n}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5FBFF",
        padding: 20,
        paddingTop: 60,
    },

    bgBlob1: {
        position: "absolute",
        top: -120,
        left: -90,
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "rgba(70,205,255,0.18)",
    },

    bgBlob2: {
        position: "absolute",
        bottom: -140,
        right: -90,
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "rgba(55,208,109,0.14)",
    },

    header: {
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 20,
        color: "#102A43",
    },

    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        marginRight: 12,
        marginTop: 6,
    },

    text: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: "#334155",
        fontWeight: "600",
    },
});
