import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { doctorAppointments } from "@/mock/doctorAppointments";

const TABS = ["Today", "Tomorrow", "Upcoming"];

export default function DoctorAppointments() {
    const [activeTab, setActiveTab] = useState("Today");

    const appointments = doctorAppointments.filter(a => a.date === activeTab);

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.header}>Appointments</Text>

            {/* TABS */}
            <View style={styles.tabs}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* APPOINTMENT CARDS */}
            {appointments.map(a => (
                <View key={a.id} style={styles.card}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={styles.name}>{a.patientName}</Text>
                            <Text style={styles.meta}>{a.specialization}</Text>
                        </View>

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{a.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.time}>🕒 {a.time}</Text>

                    {/* ACTIONS */}
                    <View style={styles.actionsRow}>
                        <ActionBtn text="Accept" color="#22c55e" onPress={() => Alert.alert("Accepted")} />
                        <ActionBtn text="Reject" color="#ef4444" onPress={() => Alert.alert("Rejected")} />
                        <ActionBtn text="Done" color="#3b82f6" onPress={() => Alert.alert("Completed")} />
                    </View>

                    <View style={styles.actionsRow}>
                        <ActionBtn text="Add Notes" color="#64748b" onPress={() => Alert.alert("Add Notes")} />
                        <ActionBtn text="Reschedule" color="#f59e0b" onPress={() => Alert.alert("Reschedule")} />
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

/* ---------- Button Component ---------- */

function ActionBtn({ text, color, onPress }: { text: string; color: string; onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: color }]}>
            <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4FBF7", padding: 20, paddingTop: 60 },

    header: { fontSize: 26, fontWeight: "900", marginBottom: 18, color: "#102A43" },

    /* Tabs */
    tabs: { flexDirection: "row", marginBottom: 18 },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#e2e8f0",
        marginRight: 10,
    },
    activeTab: { backgroundColor: "#22c55e" },
    tabText: { fontWeight: "700", color: "#334155" },
    activeTabText: { color: "#fff" },

    /* Card */
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },

    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

    name: { fontWeight: "900", fontSize: 16, color: "#102A43" },
    meta: { color: "#64748b", marginTop: 4, fontSize: 12 },

    badge: {
        backgroundColor: "rgba(59,130,246,0.12)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: { fontSize: 11, fontWeight: "700", color: "#3b82f6" },

    time: { marginTop: 10, fontSize: 13, color: "#16a34a", fontWeight: "700" },

    actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },

    btn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 14,
    },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
