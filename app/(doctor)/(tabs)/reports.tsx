import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from "react-native";
import { patientReports } from "@/mock/report";
import { getDoctorAppointments } from "@/utils/appointments";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function DoctorReports() {
    const [patientsWithDoc, setPatientsWithDoc] = useState([]);
    const router = useRouter();

    const fetchPatients = async () => {
        const res = await getDoctorAppointments();
        setPatientsWithDoc(res.filter(item => item.document));
    }
    
    useEffect(() => {
        fetchPatients();
    }, []);
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Patient Reports 📁</Text>

            {patientsWithDoc.map((r) => (
                <View key={r?.id} style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Text style={styles.icon}>{r?.patient.name?.charAt(0)}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.patient}>{r?.patient.name}</Text>
                        <Text style={{...styles.reportType, margin: 0}}>{r?.patient.email}</Text>
                        <Text style={{...styles.reportType, margin: 0}}>{r?.date}</Text>
                        <Text style={styles.reportType}>{r?.reason}</Text>

                        <View style={styles.actionsRow}>
                            <ActionBtn label="View" onPress={() => router.push(`/(doctor)/(tabs)/appointment?appointmentId=${r.id}`)} />
                            <ActionBtn label="Download" onPress={() => Linking.openURL(r?.document)} />
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const ActionBtn = ({ label, onPress }) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
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
        fontSize: 27,
        fontWeight: 800,
        color: "#102A43",
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
