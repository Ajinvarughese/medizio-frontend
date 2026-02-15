import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from "react-native";
import { feedback } from "@/mock/feedback";

const { width } = Dimensions.get("window");

export default function AdminFeedback() {
    const [replies, setReplies] = useState<{ [key: string]: string }>({});
    const [resolved, setResolved] = useState<string[]>([]);

    const handleReply = (id: string) => {
        if (!replies[id]) return;
        setResolved([...resolved, id]);
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 60 }}>
            <View style={styles.container}>

                {/* LEFT PANEL (Design Style Like Image) */}
                <View style={styles.leftPanel}>
                    <Text style={styles.brand}>Admin Feedback Center</Text>
                    <Text style={styles.subtitle}>
                        Manage and respond to feedback from doctors and patients.
                    </Text>

                    <View style={styles.statsCard}>
                        <Text style={styles.statNumber}>{feedback.length}</Text>
                        <Text style={styles.statLabel}>Total Feedback</Text>
                    </View>
                </View>

                {/* RIGHT PANEL */}
                <View style={styles.rightPanel}>
                    <Text style={styles.heading}>Feedback Messages</Text>

                    {feedback.map((item) => (
                        <View key={item.id} style={styles.feedbackCard}>

                            {/* Header */}
                            <View style={styles.row}>
                                <Text style={styles.user}>{item.user}</Text>

                                <View
                                    style={[
                                        styles.roleBadge,
                                        item.role === "Doctor"
                                            ? styles.doctorBadge
                                            : styles.patientBadge,
                                    ]}
                                >
                                    <Text style={styles.roleText}>{item.role}</Text>
                                </View>
                            </View>

                            <Text style={styles.rating}>⭐ {item.rating}/5</Text>
                            <Text style={styles.message}>{item.message}</Text>

                            {/* Reply Section */}
                            {!resolved.includes(item.id) ? (
                                <>
                                    <TextInput
                                        placeholder="Reply to this feedback..."
                                        style={styles.input}
                                        value={replies[item.id] || ""}
                                        onChangeText={(text) =>
                                            setReplies({ ...replies, [item.id]: text })
                                        }
                                    />

                                    <TouchableOpacity
                                        style={styles.replyBtn}
                                        onPress={() => handleReply(item.id)}
                                    >
                                        <Text style={styles.replyText}>Send Reply</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.resolvedBox}>
                                    <Text style={styles.resolvedText}>
                                        ✅ Replied & Marked as Resolved
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F4F8FF",
        padding: 20,
        paddingTop: 60,
    },

    container: {
        flexDirection: width > 800 ? "row" : "column",
        gap: 20,
    },

    leftPanel: {
        flex: 1,
        backgroundColor: "#1E40AF",
        borderRadius: 28,
        padding: 30,
        justifyContent: "center",
    },

    brand: {
        fontSize: 22,
        fontWeight: "900",
        color: "#ffffff",
    },

    subtitle: {
        marginTop: 10,
        color: "#dbeafe",
        fontSize: 14,
    },

    statsCard: {
        marginTop: 30,
        backgroundColor: "rgba(255,255,255,0.15)",
        padding: 20,
        borderRadius: 18,
    },

    statNumber: {
        fontSize: 28,
        fontWeight: "900",
        color: "#ffffff",
    },

    statLabel: {
        marginTop: 4,
        color: "#e0f2fe",
    },

    rightPanel: {
        flex: 2,
        backgroundColor: "#ffffff",
        borderRadius: 28,
        padding: 24,
    },

    heading: {
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 20,
        color: "#102A43",
    },

    feedbackCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    user: {
        fontWeight: "900",
        fontSize: 14,
        color: "#102A43",
    },

    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    doctorBadge: {
        backgroundColor: "#dcfce7",
    },

    patientBadge: {
        backgroundColor: "#dbeafe",
    },

    roleText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#0f172a",
    },

    rating: {
        marginTop: 6,
        fontWeight: "700",
    },

    message: {
        marginTop: 8,
        color: "#475569",
        fontSize: 13,
    },

    input: {
        marginTop: 12,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    replyBtn: {
        marginTop: 10,
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: "center",
    },

    replyText: {
        color: "#ffffff",
        fontWeight: "900",
    },

    resolvedBox: {
        marginTop: 12,
        backgroundColor: "#ecfdf5",
        padding: 10,
        borderRadius: 12,
    },

    resolvedText: {
        color: "#16a34a",
        fontWeight: "700",
        fontSize: 12,
    },
});
