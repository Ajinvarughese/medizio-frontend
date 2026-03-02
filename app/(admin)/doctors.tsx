import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { deleteDoctor, fetchAllDoctors, updateDoctorStatus, verifyDoctor } from "@/utils/doctor";
import API_URL from "@/utils/api";
import axios from "axios";

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [tab, setTab] = useState<"ACTIVE" | "SUSPENDED" | "PENDING">("ACTIVE");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };
    const load = async () => {
        const doc = await fetchAllDoctors();
        setDoctors(doc)   
    }

    const filteredDoctors = doctors.filter((doc) => {
        if (tab === "PENDING") return !doc.verified;
        if (tab === "ACTIVE") return doc.verified && doc.accountStatus === "ACTIVE";
        if (tab === "SUSPENDED") return doc.verified && doc.accountStatus === "SUSPENDED";
        return true;
    });

    useEffect(() => {
        load();
    }, [])

    const replaceUrl = (url : string ="") => {
        return url?.replace("http://localhost:8080/api", API_URL )                                           
    }

    const handleUpdateStatus = async (id : number, accountStatus : string) => {
        try {
            const payload = {
                id,
                accountStatus
            }
            await updateDoctorStatus(payload);
            load();
        } catch (error) {
            console.log(error)
        }
    }

    const handleVerify = async (id : number) => {
        try {
            const payload = {
                id
            }
            await verifyDoctor(payload);
            load();
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id : number) => {
        try {
            await deleteDoctor(id);
            load();
        } catch (error) {
            console.log(error)
        }
    }
   

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.header}>Manage Doctors</Text>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tabBtn, tab === "ACTIVE" && styles.tabActive]}
                    onPress={() => setTab("ACTIVE")}
                >
                    <Text style={[styles.tabText, tab === "ACTIVE" && styles.tabTextActive]}>
                        Active
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, tab === "SUSPENDED" && styles.tabActive]}
                    onPress={() => setTab("SUSPENDED")}
                >
                    <Text style={[styles.tabText, tab === "SUSPENDED" && styles.tabTextActive]}>
                        Suspended
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, tab === "PENDING" && styles.tabActive]}
                    onPress={() => setTab("PENDING")}
                >
                    <Text style={[styles.tabText, tab === "PENDING" && styles.tabTextActive]}>
                        Pending
                    </Text>
                </TouchableOpacity>
            </View>
            {filteredDoctors.map((doc) => {
                const expanded = expandedId === doc.id;

                return (
                    <TouchableOpacity
                        key={doc.id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => toggleExpand(doc.id)}
                    >
                        <View style={styles.topRow}>
                            <Image
                                source={{ uri: replaceUrl(doc?.picture) }}
                                resizeMode="cover"
                                style={styles.avatar}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>Dr. {doc.name}</Text>
                                <Text style={styles.special}>{doc.specialization}</Text>

                                <Text style={styles.meta}>
                                    📍 {doc.location}
                                </Text>

                                <View style={styles.infoRow}>
                                    <Text style={styles.info}>⭐ {doc.rating}</Text>
                                    <Text style={styles.info}>💼 {doc.experience} yrs</Text>
                                    <Text style={styles.info}>
                                        {doc.verified ? "✅ Verified" : "❌ Unverified"}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.statusBadge,
                                    doc.accountStatus === "ACTIVE"
                                        ? styles.approved
                                        : styles.pending,
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {doc.accountStatus}
                                </Text>
                            </View>
                        </View>

                        {expanded && (
                            <View style={styles.expandSection}>
                                
                                {tab === "ACTIVE" && (
                                    <TouchableOpacity onPress={() => {handleUpdateStatus(doc?.id, "SUSPENDED");}} style={styles.suspendBtn}>
                                        <Text style={styles.btnText}>Suspend</Text>
                                    </TouchableOpacity>
                                )}

                                {tab === "SUSPENDED" && (
                                    <TouchableOpacity onPress={() => {handleUpdateStatus(doc?.id, "ACTIVE")}} style={styles.activateBtn}>
                                        <Text style={styles.btnText}>Make Active</Text>
                                    </TouchableOpacity>
                                )}

                                {tab === "PENDING" && (
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity onPress={() => {handleVerify(doc?.id)}} style={styles.verifyBtn}>
                                            <Text style={styles.btnText}>Verify</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {handleDelete(doc?.id)}} style={styles.deleteBtn}>
                                            <Text style={styles.btnText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
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

    tabs: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#e2f8ea",
        padding: 4,
        borderRadius: 16,
    },

    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    tabActive: {
        backgroundColor: "#37d06d",
    },

    tabText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#064e3b",
    },

    tabTextActive: {
        color: "#ffffff",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    avatarText: {
        fontSize: 24,
        fontWeight: "900",
        color: "#fff",
    },

    name: {
        fontSize: 16,
        fontWeight: "900",
        color: "#102A43",
    },

    special: {
        fontSize: 13,
        fontWeight: "700",
        color: "#37d06d",
        marginTop: 2,
    },

    meta: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 4,
    },

    infoRow: {
        flexDirection: "row",
        marginTop: 6,
        gap: 10,
    },

    info: {
        fontSize: 11,
        color: "#475569",
        fontWeight: "600",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 10,
    },

    approved: {
        backgroundColor: "rgba(34,197,94,0.15)",
    },

    pending: {
        backgroundColor: "rgba(251,191,36,0.2)",
    },

    statusText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#102A43",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 14,
    },

    approveBtn: {
        flex: 1,
        backgroundColor: "#37d06d",
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
        marginRight: 8,
    },

    approveText: {
        color: "#052e16",
        fontWeight: "900",
    },

    rejectBtn: {
        flex: 1,
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
    },

    rejectText: {
        color: "#fff",
        fontWeight: "900",
    },

    expandSection: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        paddingTop: 14,
    },

    suspendBtn: {
        backgroundColor: "#f59e0b",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    activateBtn: {
        backgroundColor: "#16a34a",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    verifyBtn: {
        flex: 1,
        backgroundColor: "#22c55e",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginRight: 8,
    },

    deleteBtn: {
        flex: 1,
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    btnText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 13,
    },
});
