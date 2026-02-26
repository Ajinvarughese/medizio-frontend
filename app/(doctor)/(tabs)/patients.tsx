import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDoctorAppointments } from "@/utils/appointments";
import { calculateAge } from "@/utils/dateTime";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Patients() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadPastAppointments();
    }, []);

    const loadPastAppointments = async () => {
        const res = await getDoctorAppointments();

        const pastAppointments = res.filter(
            (item: any) =>
                item.status === "RESOLVED" ||
                item.status === "CANCELLED"
        );

        setAppointments(pastAppointments);
    };

    const filteredAppointments = appointments.filter((appointment) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();

        return (
            appointment.patient?.name?.toLowerCase().includes(query) ||
            appointment.date?.toLowerCase().includes(query)
        );
    });

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Recent Appointments 👥</Text>
            <Text style={styles.subHeader}>
                Resolved & Cancelled appointments
            </Text>

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color="#64748b"
                />
                <TextInput
                    placeholder="Search by name or date..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            {filteredAppointments.length === 0 && (
                <Text style={{ color: "#64748b", marginTop: 20 }}>
                    No past appointments found.
                </Text>
            )}

            {filteredAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.card}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {appointment.patient?.name?.charAt(0)}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>
                            {appointment.patient?.name}
                        </Text>

                        <Text style={styles.meta}>
                            {calculateAge(appointment.patient?.dob)} yrs • {appointment.patient?.location}
                        </Text>

                        <Text style={styles.meta}>
                            {appointment.patient?.email}
                        </Text>

                        <Text style={styles.issue}>
                            Issue: {appointment.reason}
                        </Text>

                        <Text style={styles.date}>
                            Visit Date: {appointment.date}
                        </Text>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() =>
                                router.push(
                                    `/(doctor)/(tabs)/appointment?appointmentId=${appointment.id}`
                                )
                            }
                        >
                            <Text style={styles.btnText}>
                                View Details
                            </Text>
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

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
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
    btnText: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: 12,
        color: "#102A43",
    },
    statusBadge: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
});