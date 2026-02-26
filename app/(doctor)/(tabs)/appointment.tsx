import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    Linking
} from "react-native";
import { getDoctorAppointments } from "@/utils/appointments";
import { dateClassify } from "@/utils/dateTime";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "@/utils/api";
import * as DocumentPicker from "expo-document-picker";
import { uploadPatientDoc } from "@/utils/fileHandle";
import { useLocalSearchParams, useRouter } from "expo-router";



const TABS = ["Today", "Tomorrow", "Upcoming", "Recents"];

export default function DoctorAppointments() {
    const [activeTab, setActiveTab] = useState("Today");
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [noteText, setNoteText] = useState("");
    const [expandedNotes, setExpandedNotes] = useState<{ [key: number]: boolean }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const { appointmentId } = useLocalSearchParams();
    const [appointments, setAppointments] = useState([]);

    const router = useRouter();

    const loadData = async () => {
        const res = await getDoctorAppointments();
        if(activeTab == "Recents") {
            setAppointments(res.filter((item) => item?.status != "BOOKED"))  
        } else {
            setAppointments(res.filter((item) => dateClassify(item?.date) == activeTab && item?.status == "BOOKED"))  
        }
        
    }

    const updateAppointmentStatus = async (id: number, status : string) => {
        try {
            await axios.put(`${API_URL}/appointment/${id}/status`, null, {
                params: { status }
            });
            loadData();
        } catch(error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (appointmentId) {
            setActiveTab("Recents");

            // convert to string safely
            const idString = Array.isArray(appointmentId)
                ? appointmentId[0]
                : appointmentId;

            setSearchQuery(idString.toString());
        }
    }, [appointmentId]);

    useEffect(() => {
        loadData();
    }, [activeTab])

    const handleAddNotes = async () => {
        if (!selectedAppointmentId) return;

        try {
            const payload = {
                id: selectedAppointmentId,
                note: noteText, // ⚠ make sure backend field name matches
            };

            await axios.patch(`${API_URL}/appointment/update`, payload);
            console.log(payload)
            setNoteModalVisible(false);
            setNoteText("");
            loadData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUploadDocument = async (appointmentId: number) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            const url = await uploadPatientDoc(file)

            const payload = {
                id: appointmentId,
                document: url
            }
            console.log(payload)
            await axios.patch(`${API_URL}/appointment/update`, payload); 

            Alert.alert("Success", "Document uploaded successfully.");
            loadData();

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to upload document.");
        }
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons 
                    name="magnify" 
                    size={20} 
                    color="#64748b" 
                />
                <TextInput
                    placeholder="Search by patient, date or time..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            <Modal
                visible={noteModalVisible}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add Notes</Text>

                        <TextInput
                            placeholder="Type your notes here..."
                            value={noteText}
                            onChangeText={setNoteText}
                            multiline
                            style={styles.modalInput}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#e2e8f0" }]}
                                onPress={() => setNoteModalVisible(false)}
                            >
                                <Text style={{ fontWeight: "700" }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
                                onPress={handleAddNotes}
                            >
                                <Text style={{ color: "#fff", fontWeight: "700" }}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
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
            {
                appointments.length <= 0 && (
                    <View style={styles.container}>
                    <MaterialCommunityIcons 
                        name="calendar-remove-outline" 
                        size={80} 
                        color="#cbd5e1" 
                    />

                    <Text style={styles.title}>No Appointments {activeTab}</Text>

                    <Text style={styles.subtitle}>
                        You don’t have any scheduled appointments {activeTab.toLowerCase()}.
                        Once patients book a slot, it will appear here.
                    </Text>
                    </View>
                )
            }
            {appointments
            .filter(a => {
                // If appointmentId param exists → strict ID match
                if (appointmentId) {
                    const idString = Array.isArray(appointmentId)
                        ? appointmentId[0]
                        : appointmentId;
                    
                    return a.id === Number(idString);
                }

                // Normal search behavior
                if (!searchQuery.trim()) return true;

                const query = searchQuery.toLowerCase();

                return (
                    a.patient?.name?.toLowerCase().includes(query) ||
                    a.date?.toLowerCase().includes(query) ||
                    a.time?.toLowerCase().includes(query)
                );
            })
            .map(a => (
                <View key={a.id} style={styles.card}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={styles.name}>{a.patient.name}</Text>
                            <Text style={styles.meta}>{a.reason}</Text>
                        </View>

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{a.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.time}>📆 {a.date} 🕒 {a.time}</Text>

                    {/* ACTIONS */}
                    <View style={styles.actionsRow}>

                    {/* For BOOKED appointments */}
                    {activeTab !== "Recents" && (
                        <>
                            <ActionBtn text="Completed ✅" color="#22c55e" onPress={() => updateAppointmentStatus(a?.id, "RESOLVED")} /> 
                            <ActionBtn 
                                text="Add Notes 📝" 
                                color="#64748b" 
                                onPress={() => {
                                    setSelectedAppointmentId(a.id);
                                    setNoteText(a.notes || ""); // optional prefill
                                    setNoteModalVisible(true);
                                }} 
                            />
                        </>
                    )}
                    {
                        (activeTab !== "Recents" && activeTab !== "Today") && (
                            <ActionBtn 
                                text="Reject ✖️" 
                                color="#ef4444" 
                                onPress={() => updateAppointmentStatus(a.id, "CANCELLED")} 
                            />
                        )
                    }

                    {/* For completed / past */}
                    {activeTab === "Recents" && (
                        <>
                            <ActionBtn 
                                text="Add Notes 📝" 
                                color="#64748b" 
                                onPress={() => {
                                    setSelectedAppointmentId(a.id);
                                    setNoteText(a.notes || "");
                                    setNoteModalVisible(true);
                                }} 
                            />
                            <ActionBtn 
                                text="Upload Document 📤" 
                                color="#f59e0b" 
                                onPress={() => handleUploadDocument(a?.id)} 
                            />
                        </>
                    )}
                    {a?.note && (
                        <View style={styles.noteContainer}>
                            <Text style={{...styles.meta, fontWeight: 600, fontStyle: "italic"}}>Doctor said: </Text>
                            <Text
                                numberOfLines={expandedNotes[a.id] ? undefined : 3}
                                style={styles.noteText}
                            >
                                {a.note}
                            </Text>

                            {a.note.length > 120 && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setExpandedNotes(prev => ({
                                            ...prev,
                                            [a.id]: !prev[a.id],
                                        }))
                                    }
                                >
                                    <Text style={styles.readMore}>
                                        {expandedNotes[a.id] ? "Show Less" : "Read More"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {a?.document && (
                        <TouchableOpacity
                            style={styles.pdfBtn}
                            onPress={() => Linking.openURL(a.document)}
                        >
                            <MaterialCommunityIcons 
                                name="file-pdf-box" 
                                size={18} 
                                color="#fff" 
                            />
                            <Text style={styles.pdfBtnText}>
                                View Prescription PDF
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>
                    
                    
                </View>
            ))}
            {
                appointmentId && (
                    <TouchableOpacity
                        style={styles.clearSeatch}
                        onPress={() => {
                            router.replace("/(doctor)/(tabs)/appointment");
                            setSearchQuery("")
                        }}
                    >
                        <Text style={styles.pdfBtnText}>
                            Clear Patient Search
                        </Text>
                    </TouchableOpacity>
                )
            }
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
        maxWidth: 400,
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
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        color: "#1e293b",
    },
    subtitle: {
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14,
        color: "#102A43",
    },

    modalInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        textAlignVertical: "top",
    },

    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },

    modalBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    noteContainer: {
        marginTop: 12,
        backgroundColor: "#f1f5f9",
        padding: 12,
        maxWidth: 365,
        borderRadius: 14,
    },

    noteText: {
        fontSize: 13,
        marginTop: 6,
        color: "#334155",
        opacity: 0.8,
        lineHeight: 20,
    },

    readMore: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: "700",
        color: "#22c55e",
    },
    pdfBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginTop: 12,
        alignSelf: "flex-start",
    },

    pdfBtnText: {
        color: "#fff",
        fontWeight: "700",
        marginLeft: 6,
        fontSize: 13,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
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

    clearSeatch: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#64748b",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginTop: 12,
        alignSelf: "flex-start",
        justifyContent: 'center',
    
    }
});
