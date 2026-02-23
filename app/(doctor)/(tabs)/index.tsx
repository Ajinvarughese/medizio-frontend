import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";


import { getUser } from "@/utils/auth";
import { fetchDoctorAppointments } from "@/mock/doctorAppointments";
import { dateClassify } from "@/utils/dateTime";

const { width } = Dimensions.get("window");

export default function DoctorHome() {
    const [doctor, setDoctor] = useState({});
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    
    const fetchDoctor = async () => {
        setDoctor(await getUser());
    }

    const fetchAppointments =async () => {
        setDoctorAppointments(await fetchDoctorAppointments());
    }
    
    useEffect(() => {
        fetchDoctor();
        fetchAppointments();
    }, []);
    console.log(doctor)
    const router = useRouter();
    const pulse = useRef(new Animated.Value(1)).current;

    const todayAppointments = doctorAppointments.filter(a => dateClassify(a?.date) === "Today");
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.25, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={styles.bg1} />
            <View style={styles.bg2} />

            {/* HEADER */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.push("/(doctor)/profile")}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.greeting}>Good Morning</Text>
                    <Text style={styles.name}>Dr. {doctor.name}</Text>
                </View>

                {/* Live Heartbeat Status */}
                <View style={styles.statusContainer}>
                    <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulse }] }]} />
                    <View style={styles.statusDot} />
                </View>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <TextInput placeholder="Search patients, reports..." style={styles.searchInput} />
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryRow}>
                <SummaryCard label="Today’s Patients" value={todayAppointments.length} color="#22c55e" />
                <SummaryCard label="Pending Reports" value="6" color="#f59e0b" />
            </View>

            {/* UPCOMING APPOINTMENTS CAROUSEL */}
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>

            <ScrollView
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={width * 0.72}
                snapToAlignment="start"

            >
                {doctorAppointments.slice(0, 5).map(item => (
                    <Swipeable
                        key={item.id}
                        renderRightActions={() => (
                            <View style={styles.swipeAction}>
                                <Text style={styles.swipeText}>✓ Done</Text>
                            </View>
                        )}
                    >
                        <View style={styles.appointmentCard}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.status}</Text>
                            </View>
                            <Text style={styles.patientName}>{item.patientName}</Text>
                            <Text style={styles.spec}>{item.specialization}</Text>
                            <Text style={styles.time}>🕒 {item.time}</Text>
                        </View>
                    </Swipeable>
                ))}
            </ScrollView>

            {/* RECENT PATIENTS */}
            <Text style={styles.sectionTitle}>Recent Patients</Text>
            <View style={styles.glassCard}>
                <Text style={styles.listItem}>👩‍🦰 Priya S — Fever Follow-up</Text>
                <Text style={styles.listItem}>👨 Rahul M — Diabetes Check</Text>
                <Text style={styles.listItem}>👩 Anjali K — Heart Consultation</Text>
            </View>

            {/* WEEK STATS */}
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsRow}>
                <Stat label="Patients" value="42" />
                <Stat label="Rating" value="4.8 ⭐" />
                <Stat label="Reports" value="18" />
            </View>

            {/* ALERTS */}
            <Text style={styles.sectionTitle}>Alerts</Text>
            <View style={styles.alertCard}>
                <Text style={styles.alertText}>🔔 2 patients uploaded new lab reports</Text>
            </View>
        </ScrollView>
    );
}

/* COMPONENTS */

function SummaryCard({ label, value, color }: any) {
    return (
        <View style={[styles.summaryCard, { backgroundColor: color }]}>
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* STYLES */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4FBF7", padding: 20, paddingTop: 60 },

    bg1: { position: "absolute", width: 280, height: 280, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.12)", top: -120, right: -100 },
    bg2: { position: "absolute", width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(59,130,246,0.10)", bottom: -100, left: -100 },

    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    menuIcon: { fontSize: 22 },
    greeting: { fontSize: 13, color: "#64748b" },
    name: { fontSize: 22, fontWeight: "900", color: "#102A43" },

    statusContainer: { width: 26, height: 26, justifyContent: "center", alignItems: "center" },
    pulseCircle: { position: "absolute", width: 26, height: 26, borderRadius: 999, backgroundColor: "rgba(34,197,94,0.25)" },
    statusDot: { width: 10, height: 10, borderRadius: 99, backgroundColor: "#22c55e" },

    searchBox: { marginTop: 20, backgroundColor: "#ffffff", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 },
    searchInput: { fontSize: 14, color: "#102A43" },

    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    summaryCard: { width: "48%", borderRadius: 22, padding: 20 },
    summaryValue: { fontSize: 30, fontWeight: "900", color: "#fff" },
    summaryLabel: { fontSize: 13, color: "#fff", marginTop: 6 },

    sectionTitle: { marginTop: 28, marginBottom: 12, fontSize: 17, fontWeight: "900", color: "#102A43" },

    appointmentCard: {
        width: width * 0.72,
        marginTop: 16,   
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
    },

    badge: { alignSelf: "flex-start", backgroundColor: "rgba(59,130,246,0.12)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
    badgeText: { fontSize: 11, fontWeight: "700", color: "#3b82f6" },

    swipeAction: { justifyContent: "center", alignItems: "center", backgroundColor: "#22c55e", width: 90, borderRadius: 22, marginVertical: 4 },
    swipeText: { color: "#fff", fontWeight: "900" },

    patientName: { fontWeight: "900", color: "#102A43" },
    spec: { fontSize: 12, color: "#64748b", marginTop: 4 },
    time: { marginTop: 10, fontSize: 13, color: "#16a34a", fontWeight: "800" },

    glassCard: { backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 20, padding: 16 },
    listItem: { fontSize: 13, marginBottom: 8, color: "#334155" },

    statsRow: { flexDirection: "row", justifyContent: "space-between" },
    statCard: { width: "31%", backgroundColor: "#fff", borderRadius: 18, padding: 14, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 },
    statValue: { fontSize: 18, fontWeight: "900", color: "#102A43" },
    statLabel: { fontSize: 11, color: "#64748b", marginTop: 4 },

    alertCard: { backgroundColor: "#fff7ed", padding: 16, borderRadius: 16 },
    alertText: { color: "#9a3412", fontWeight: "600" },
});
