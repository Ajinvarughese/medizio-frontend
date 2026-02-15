import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { patientReports } from "@/mock/report";

const { width } = Dimensions.get("window");

export default function DoctorReports() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Patient Reports 📁</Text>

            {patientReports.map((r) => (
                <View key={r.id} style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Text style={styles.icon}>📄</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.patient}>{r.patient}</Text>
                        <Text style={styles.reportType}>{r.type}</Text>

                        <View style={styles.actionsRow}>
                            <ActionBtn label="View" />
                            <ActionBtn label="Download" />
                            <ActionBtn label="Comment" />
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const ActionBtn = ({ label }: { label: string }) => (
    <TouchableOpacity style={styles.actionBtn}>
        <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
);

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
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "rgba(55,208,109,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    icon: {
        fontSize: 20,
    },

    patient: {
        fontSize: 15,
        fontWeight: "900",
        color: "#102A43",
    },

    reportType: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 2,
        marginBottom: 10,
        fontWeight: "600",
    },

    actionsRow: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },

    actionBtn: {
        backgroundColor: "#e2e8f0",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },

    actionText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#102A43",
    },
});
