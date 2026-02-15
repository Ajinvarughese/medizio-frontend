import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { patients } from "@/mock/patients";

const { width } = Dimensions.get("window");

export default function Patients() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Recent Patients 👥</Text>
            <Text style={styles.subHeader}>Patients you recently consulted</Text>

            {patients.map((patient) => (
                <View key={patient.id} style={styles.card}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {patient.name.charAt(0)}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{patient.name}</Text>
                        <Text style={styles.meta}>
                            {patient.age} yrs • {patient.gender}
                        </Text>
                        <Text style={styles.issue}>Issue: {patient.issue}</Text>
                        <Text style={styles.date}>Last Visit: {patient.lastVisit}</Text>

                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },

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

    header: { fontSize: 24, fontWeight: "900", color: "#102A43" },
    subHeader: { fontSize: 13, color: "#64748b", marginBottom: 20 },

    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: "rgba(55,208,109,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    avatarText: { fontSize: 20, fontWeight: "900", color: "#102A43" },

    name: { fontSize: 15, fontWeight: "900", color: "#102A43" },
    meta: { fontSize: 12, color: "#64748b", marginTop: 2 },
    issue: { fontSize: 12, marginTop: 6, color: "#334155" },
    date: { fontSize: 11, marginTop: 4, color: "#94a3b8" },

    btn: {
        marginTop: 10,
        backgroundColor: "#e2e8f0",
        paddingVertical: 6,
        borderRadius: 10,
        width: 120,
    },
    btnText: { textAlign: "center", fontWeight: "700", fontSize: 12, color: "#102A43" },
});
