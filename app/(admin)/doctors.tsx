import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { doctors as mockDoctors } from "@/mock/doctors";

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState(mockDoctors);

    const updateStatus = (id: string, status: string) => {
        setDoctors((prev) =>
            prev.map((doc) =>
                doc.id === id ? { ...doc, status } : doc
            )
        );
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.header}>Manage Doctors</Text>

            {doctors.map((doc) => (
                <View key={doc.id} style={styles.card}>
                    {/* TOP BADGES */}
                    <View style={styles.badgeRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>⭐ {doc.rating}</Text>
                        </View>

                        <View style={styles.feeBadge}>
                            <Text style={styles.feeText}>₹{doc.fee}/hr</Text>
                        </View>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.contentRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{doc.name}</Text>
                            <Text style={styles.special}>{doc.specialization}</Text>
                            <Text style={styles.meta}>
                                {doc.experience} yrs • {doc.hospital}
                            </Text>

                            {/* STATUS */}
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
                                            : { color: "#f59e0b" },
                                    ]}
                                >
                                    {doc.status}
                                </Text>
                            </View>

                            {/* ACTIONS */}
                            {doc.status === "Pending" && (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.approveBtn}
                                        onPress={() => updateStatus(doc.id, "Approved")}
                                    >
                                        <Text style={styles.approveText}>Approve</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.rejectBtn}
                                        onPress={() => updateStatus(doc.id, "Rejected")}
                                    >
                                        <Text style={styles.rejectText}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* RIGHT SIDE IMAGE PLACEHOLDER */}
                        <View style={styles.imageBox}>
                            <Text style={styles.imageText}>
                                {doc.name.charAt(0)}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F4FBF7",
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    header: {
        fontSize: 24,
        fontWeight: "900",
        color: "#102A43",
        marginBottom: 24,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 28,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
    },

    badgeRow: {
        flexDirection: "row",
        marginBottom: 12,
    },

    ratingBadge: {
        backgroundColor: "#ecfdf5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 8,
    },

    ratingText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#16a34a",
    },

    feeBadge: {
        backgroundColor: "#e0f2fe",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },

    feeText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#0284c7",
    },

    contentRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    name: {
        fontSize: 16,
        fontWeight: "900",
        color: "#102A43",
    },

    special: {
        fontSize: 13,
        color: "#37d06d",
        fontWeight: "700",
        marginTop: 2,
    },

    meta: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 6,
    },

    statusBadge: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: "flex-start",
    },

    approved: {
        backgroundColor: "#ecfdf5",
    },

    pending: {
        backgroundColor: "#fef3c7",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "800",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 12,
    },

    approveBtn: {
        backgroundColor: "#37d06d",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginRight: 10,
    },

    approveText: {
        color: "#062118",
        fontWeight: "900",
    },

    rejectBtn: {
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
    },

    rejectText: {
        color: "#fff",
        fontWeight: "900",
    },

    imageBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: "#37d06d",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 16,
    },

    imageText: {
        fontSize: 28,
        fontWeight: "900",
        color: "#fff",
    },
});
