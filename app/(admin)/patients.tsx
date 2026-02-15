import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { patients } from "@/mock/patients";

const { width } = Dimensions.get("window");

export default function Patients() {
    const [search, setSearch] = useState("");

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Background Glow */}
            <View style={styles.bg1} />
            <View style={styles.bg2} />

            {/* HEADER */}
            <Text style={styles.title}>My Patients 👩‍⚕️</Text>
            <Text style={styles.subtitle}>
                Manage consultations & view recent visits
            </Text>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <TextInput
                    placeholder="Search patient..."
                    placeholderTextColor="rgba(16,42,67,0.5)"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
                <StatCard label="Total" value={patients.length} />
                <StatCard label="This Week" value="12" />
                <StatCard label="Follow-ups" value="5" />
            </View>

            {/* PATIENT LIST */}
            <Text style={styles.sectionTitle}>Recent Consultations</Text>

            {filtered.map(p => (
                <View key={p.id} style={styles.glassCard}>
                    {/* Avatar */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {p.name.charAt(0)}
                        </Text>
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{p.name}</Text>
                        <Text style={styles.meta}>
                            {p.age} yrs • {p.gender}
                        </Text>
                        <Text style={styles.issue}>{p.issue}</Text>
                        <Text style={styles.visit}>
                            Last Visit: {p.lastVisit}
                        </Text>
                    </View>

                    {/* Status Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Active</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

/* ---------- Components ---------- */

function StatCard({
                      label,
                      value,
                  }: {
    label: string;
    value: any;
}) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5FBFF",
        padding: 20,
        paddingTop: 60,
    },

    bg1: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.18)",
        top: -120,
        right: -100,
    },

    bg2: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 999,
        backgroundColor: "rgba(16,42,67,0.05)",
        bottom: -100,
        left: -100,
    },

    title: {
        fontSize: 26,
        fontWeight: "900",
        color: "#102A43",
    },

    subtitle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 20,
        color: "rgba(16,42,67,0.6)",
    },

    searchBox: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.06)",
        marginBottom: 20,
    },

    searchInput: {
        fontSize: 14,
        color: "#102A43",
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    statCard: {
        width: "31%",
        backgroundColor: "rgba(55,208,109,0.12)",
        borderRadius: 20,
        padding: 14,
        alignItems: "center",
    },

    statValue: {
        fontSize: 18,
        fontWeight: "900",
        color: "#37d06d",
    },

    statLabel: {
        fontSize: 11,
        marginTop: 4,
        color: "#102A43",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#102A43",
        marginBottom: 14,
    },

    glassCard: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 6,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 20,
        backgroundColor: "#37d06d",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    avatarText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 18,
    },

    name: {
        fontSize: 15,
        fontWeight: "900",
        color: "#102A43",
    },

    meta: {
        fontSize: 12,
        color: "rgba(16,42,67,0.6)",
        marginTop: 2,
    },

    issue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#37d06d",
        marginTop: 6,
    },

    visit: {
        fontSize: 11,
        color: "rgba(16,42,67,0.6)",
        marginTop: 4,
    },

    badge: {
        backgroundColor: "rgba(55,208,109,0.15)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#16a34a",
    },
});
