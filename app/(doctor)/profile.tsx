import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { getUser, logout } from "@/utils/auth";
import { Image } from "react-native";
import { getAllPatients } from "@/utils/patients";
import { getDoctorAppointments } from "@/utils/appointments";
import API_URL from "@/utils/api";

export default function DoctorSidebar() {
    const router = useRouter();

    const [doctor, setDoctor] = useState({});
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            setDoctor(await getUser());
            setAppointments(await getDoctorAppointments());
        }
        fetchDetails();
    }, []);

    const totalPatientCount = React.useMemo(() => {
        const uniqueEmails = new Set(
            appointments
                ?.map(a => a?.patient?.email)
                ?.filter(Boolean) 
        );

        return uniqueEmails.size;
    }, [appointments]);

    const replaceUrl = (url : string ="") => {
        return url?.replace("http://localhost:8080/api", API_URL )                                           
    }

    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* PROFILE HEADER */}
            <View style={styles.headerCard}>
                <View style={styles.avatar}>
                    <Image source={{uri: replaceUrl(doctor?.picture)}} resizeMode="cover" style={styles.avatar} />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>Dr. {doctor?.name}</Text>
                    <Text style={styles.special}>{doctor?.specialization}</Text>

                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>
            </View>

            {/* QUICK STATS */}
            <View style={styles.statsRow}>
                <Stat label="Patients" value={totalPatientCount} />
                <Stat label="Rating" value={`${doctor?.rating} ⭐`} />
                <Stat label="Appointments" value={appointments?.length} />
            </View>

            {/* MAIN SECTION */}
            <Text style={styles.sectionTitle}>MAIN</Text>
            <MenuItem icon="📅" label="My Schedule" onPress={() => router.push("/(doctor)/(tabs)/appointment")} />
            <MenuItem icon="🧑‍⚕️" label="Patients" onPress={() => router.push("/(doctor)/(tabs)/patients")} />
            <MenuItem icon="📁" label="Reports Center" onPress={() => router.push("/(doctor)/(tabs)/reports")} />

            {/* SETTINGS SECTION */}
            <Text style={styles.sectionTitle}>SETTINGS</Text>
            <MenuItem icon="⏰" label="Availability" onPress={() => router.push("/(doctor)/availability")} />
            <MenuItem icon="🔔" label="Notifications" onPress={() => router.push("/(doctor)/(tabs)/notifications")} />
            <MenuItem icon="⚙" label="Settings" onPress={() => router.push("/(doctor)/setting")} />

            {/* LOGOUT */}
            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                    logout();
                    router.push("/(auth)/welcome")
                }}   // back to main index
            >
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ---------- Components ---------- */

function MenuItem({ icon, label, onPress }: any) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.menuIcon}>{icon}</Text>
            <Text style={styles.menuLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

function Stat({ label, value }: any) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4FBF7" },

    content: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    headerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        marginBottom: 20,
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    avatarText: { color: "#fff", fontWeight: "900", fontSize: 24 },

    name: { fontSize: 18, fontWeight: "900", color: "#102A43" },
    special: { fontSize: 13, color: "#64748b", marginTop: 2 },

    statusRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    statusDot: { width: 10, height: 10, borderRadius: 99, backgroundColor: "#22c55e", marginRight: 6 },
    statusText: { fontSize: 12, fontWeight: "700", color: "#16a34a" },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    statCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
        width: "31%",
    },
    statValue: { fontWeight: "900", fontSize: 14, color: "#102A43" },
    statLabel: { fontSize: 11, color: "#64748b", marginTop: 2 },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "900",
        color: "#94a3b8",
        marginBottom: 8,
        marginTop: 10,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginBottom: 10,
    },

    menuIcon: { fontSize: 18, width: 28 },
    menuLabel: { fontSize: 14, fontWeight: "700", color: "#102A43" },

    logoutBtn: {
        marginTop: 30,
        backgroundColor: "#fee2e2",
        padding: 16,
        borderRadius: 20,
        alignItems: "center",
    },
    logoutText: { color: "#b91c1c", fontWeight: "900" },
});
