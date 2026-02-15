import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { doctors } from "@/mock/doctors";

const { width } = Dimensions.get("window");

/* ✅ CATEGORY OBJECT WITH ICONS */
const CATEGORIES = [
    { icon: "❤️", label: "Cardiologist" },
    { icon: "🧠", label: "Neurologist" },
    { icon: "👶", label: "Pediatrician" },
    { icon: "🦴", label: "Orthopedic" },
];

export default function AdminHome() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    /* ✅ FILTER LOGIC */
    const filteredDoctors = useMemo(() => {
        if (!activeCategory) return doctors;
        return doctors.filter(
            (doc) => doc.specialization === activeCategory
        );
    }, [activeCategory]);

    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Background Blobs */}
            <View style={styles.bg1} />
            <View style={styles.bg2} />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Admin Dashboard 👑</Text>
                <Text style={styles.subtitle}>
                    Monitor doctors and manage platform activity
                </Text>
            </View>

            {/* HERO CARD */}
            <View style={styles.heroCard}>
                <Text style={styles.heroTitle}>Platform Overview</Text>

                <View style={styles.statsRow}>
                    <StatBox
                        value={doctors.length}
                        label="Total Doctors"
                    />
                    <StatBox
                        value={
                            doctors.filter((d) => d.status === "Pending").length
                        }
                        label="Pending"
                    />
                </View>
            </View>

            {/* CATEGORY SECTION */}
            <Text style={styles.sectionTitle}>Specializations</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
            >
                {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.label;

                    return (
                        <TouchableOpacity
                            key={cat.label}
                            style={[
                                styles.categoryCard,
                                isActive && styles.categoryActive,
                            ]}
                            onPress={() =>
                                setActiveCategory(
                                    isActive ? null : cat.label
                                )
                            }
                        >
                            <Text style={styles.categoryIcon}>
                                {cat.icon}
                            </Text>
                            <Text
                                style={[
                                    styles.categoryText,
                                    isActive && { color: "#fff" },
                                ]}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* DOCTOR LIST */}
            <Text style={styles.sectionTitle}>Doctors</Text>

            {filteredDoctors.map((doc) => (
                <View key={doc.id} style={styles.doctorCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.docName}>
                            Dr. {doc.name}
                        </Text>

                        <Text style={styles.docSpec}>
                            {doc.specialization}
                        </Text>

                        <View style={styles.metaRow}>
                            <Text style={styles.meta}>
                                ⭐ {doc.rating}
                            </Text>
                            <Text style={styles.meta}>
                                ₹{doc.fee}
                            </Text>
                            <Text style={styles.meta}>
                                {doc.available ? "Online" : "Offline"}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            doc.status === "Approved"
                                ? styles.approved
                                : styles.pending,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                doc.status === "Approved"
                                    ? { color: "#16a34a" }
                                    : { color: "#b45309" },
                            ]}
                        >
                            {doc.status}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

/* ---------- COMPONENTS ---------- */

function StatBox({
                     value,
                     label,
                 }: {
    value: number;
    label: string;
}) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#f0fdf4",
        padding: 20,
        paddingTop: 60,
    },

    bg1: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.15)",
        top: -120,
        right: -100,
    },

    bg2: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 999,
        backgroundColor: "rgba(16,185,129,0.12)",
        bottom: -120,
        left: -100,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "900",
        color: "#102A43",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: "#64748b",
    },

    heroCard: {
        backgroundColor: "#16a34a",
        borderRadius: 26,
        padding: 20,
        marginBottom: 25,
    },

    heroTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#fff",
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    statBox: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 18,
        padding: 16,
        width: "48%",
    },

    statValue: {
        fontSize: 26,
        fontWeight: "900",
        color: "#fff",
    },

    statLabel: {
        fontSize: 12,
        color: "rgba(255,255,255,0.85)",
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#102A43",
        marginTop: 20,
        marginBottom: 10,
    },

    categoryCard: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginRight: 12,
        alignItems: "center",
        width: width * 0.32,
        elevation: 3,
    },

    categoryActive: {
        backgroundColor: "#37d06d",
    },

    categoryIcon: {
        fontSize: 26,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#102A43",
        marginTop: 6,
        textAlign: "center",
    },

    doctorCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
    },

    docName: {
        fontSize: 15,
        fontWeight: "900",
        color: "#102A43",
    },

    docSpec: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 4,
    },

    metaRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },

    meta: {
        fontSize: 11,
        color: "#475569",
        fontWeight: "600",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },

    approved: {
        backgroundColor: "rgba(22,163,74,0.12)",
    },

    pending: {
        backgroundColor: "rgba(234,179,8,0.15)",
    },

    statusText: {
        fontSize: 11,
        fontWeight: "800",
    },
});
