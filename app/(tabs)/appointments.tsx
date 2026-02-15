import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";

import { doctors } from "@/mock/doctors";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { saveAppointment } from "@/utils/appointments";

const { width } = Dimensions.get("window");

/* Enable animation on Android */
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function AppointmentBooking() {
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // booking fields
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return doctors;

        return doctors.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                d.location.toLowerCase().includes(q)
        );
    }, [search]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        setExpandedId(id);
        setSelectedSlot("");
        setSelectedDate("");
        setReason("");
    };

    const handleBook = async (doc: any) => {
        if (!doc.available) {
            Alert.alert("Not Available", "This doctor is not available right now.");
            return;
        }

        if (!selectedDate || !selectedSlot || !reason) {
            Alert.alert("Missing Info", "Please enter Date, Slot, and Reason.");
            return;
        }

        await saveAppointment({
            doctorId: doc.id,
            doctorName: doc.name,
            specialization: doc.specialization,
            hospital: doc.hospital,
            location: doc.location,
            fee: doc.fee,
            date: selectedDate,
            time: selectedSlot,
            reason,
            status: "Booked",
        });

        Alert.alert("Appointment Booked ✅", `Booked with ${doc.name} at ${selectedSlot}`);
        setExpandedId(null);
        setSelectedSlot("");
        setSelectedDate("");
        setReason("");
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 160 }}>
            {/* bg */}
            <Image source={images.bg} style={styles.bg} />
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.logoWrap}>
                        <Image source={icons.logo} style={styles.logo} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Book Appointment</Text>
                        <Text style={styles.subTitle}>
                            Search doctors and schedule appointment instantly
                        </Text>
                    </View>
                </View>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search doctor / specialization / location..."
                    placeholderTextColor="rgba(16,42,67,0.42)"
                    style={styles.searchInput}
                />
            </View>

            {/* LIST */}
            <View style={{ marginTop: 16 }}>
                {filtered.map((doc) => {
                    const isOpen = expandedId === doc.id;

                    const badge = doc.available
                        ? { bg: "rgba(22,163,74,0.14)", text: "#16a34a", label: "Available" }
                        : { bg: "rgba(239,68,68,0.14)", text: "#ef4444", label: "Unavailable" };

                    return (
                        <View key={doc.id} style={styles.card}>
                            {/* Main Card */}
                            <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpand(doc.id)}>
                                <View style={styles.topRow}>
                                    <View style={styles.leftRow}>
                                        <View style={styles.avatarWrap}>
                                            <Image source={icons.doctor} style={styles.avatar} />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.docName}>{doc.name}</Text>

                                            <View style={styles.subRow}>
                                                <View style={styles.specChip}>
                                                    <Text style={styles.specChipText}>{doc.specialization}</Text>
                                                </View>

                                                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                                                    <Text style={[styles.badgeText, { color: badge.text }]}>
                                                        {badge.label}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.expandText}>{isOpen ? "Hide ▲" : "Book ▼"}</Text>
                                </View>

                                <View style={styles.metaRow}>
                                    <Text style={styles.metaItem}>⭐ {doc.rating}</Text>
                                    <Text style={styles.metaDot}>•</Text>
                                    <Text style={styles.metaItem}>🧑‍⚕️ {doc.experience} yrs</Text>
                                    <Text style={styles.metaDot}>•</Text>
                                    <Text style={styles.metaItem}>₹ {doc.fee}</Text>
                                </View>

                                <Text style={styles.smallLine}>
                                    🏥 {doc.hospital}   •   📍 {doc.location}
                                </Text>

                                <Text style={styles.visitLine}>
                                    ⏰ {doc.visitingTime} ({doc.days})
                                </Text>
                            </TouchableOpacity>

                            {/* Expand Booking Form */}
                            {isOpen && (
                                <View style={styles.detailBox}>
                                    <Text style={styles.formTitle}>Appointment Details</Text>

                                    <Text style={styles.label}>Date</Text>
                                    <TextInput
                                        value={selectedDate}
                                        onChangeText={setSelectedDate}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="rgba(16,42,67,0.45)"
                                        style={styles.input}
                                    />

                                    <Text style={styles.label}>Select Time Slot</Text>

                                    <View style={styles.slotWrap}>
                                        {doc.slots.map((slot: string) => {
                                            const active = selectedSlot === slot;

                                            return (
                                                <TouchableOpacity
                                                    key={slot}
                                                    style={[styles.slotBtn, active && styles.slotBtnActive]}
                                                    onPress={() => setSelectedSlot(slot)}
                                                    activeOpacity={0.9}
                                                >
                                                    <Text style={[styles.slotText, active && styles.slotTextActive]}>
                                                        {slot}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <Text style={styles.label}>Reason</Text>
                                    <TextInput
                                        value={reason}
                                        onChangeText={setReason}
                                        placeholder="Explain symptoms or purpose"
                                        placeholderTextColor="rgba(16,42,67,0.45)"
                                        style={[styles.input, { height: 90 }]}
                                        multiline
                                    />

                                    <TouchableOpacity
                                        style={[styles.bookBtn, !doc.available && { opacity: 0.5 }]}
                                        onPress={() => handleBook(doc)}
                                        disabled={!doc.available}
                                        activeOpacity={0.9}
                                    >
                                        <Text style={styles.bookText}>Confirm Appointment</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}

                {filtered.length === 0 && (
                    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                        <Text style={styles.empty}>No doctors found.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", paddingTop: 50 },

    bg: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.06,
    },

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

    header: { paddingHorizontal: 18, marginBottom: 14 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },

    logoWrap: {
        width: 54,
        height: 54,
        borderRadius: 20,
        backgroundColor: "rgba(16,42,67,0.08)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    logo: { width: 42, height: 40 },

    title: { color: "#102A43", fontWeight: "900", fontSize: 22 },
    subTitle: {
        marginTop: 4,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "800",
        fontSize: 12,
    },

    searchBox: {
        marginHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 6,
    },
    searchIcon: {
        color: "#37d06d",
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: "#102A43",
        fontSize: 14,
        fontWeight: "800",
    },

    card: {
        marginHorizontal: 18,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 5,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
    },

    leftRow: { flexDirection: "row", gap: 12, flex: 1 },

    avatarWrap: {
        width: 54,
        height: 54,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(55,208,109,0.14)",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: { width: 54, height: 54 },

    docName: {
        color: "#102A43",
        fontWeight: "900",
        fontSize: 16,
    },

    subRow: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },

    specChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.16)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.04)",
    },
    specChipText: {
        color: "#0f2f47",
        fontWeight: "900",
        fontSize: 11,
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeText: { fontSize: 12, fontWeight: "900" },

    expandText: {
        color: "rgba(16,42,67,0.52)",
        fontWeight: "900",
        fontSize: 12,
    },

    metaRow: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
    },
    metaItem: {
        color: "rgba(16,42,67,0.78)",
        fontWeight: "900",
        fontSize: 12,
    },
    metaDot: { color: "rgba(16,42,67,0.28)", fontWeight: "900" },

    smallLine: {
        marginTop: 10,
        color: "rgba(16,42,67,0.62)",
        fontWeight: "800",
        fontSize: 12,
    },

    visitLine: {
        marginTop: 8,
        color: "rgba(16,42,67,0.62)",
        fontWeight: "800",
        fontSize: 12,
    },

    detailBox: {
        marginTop: 14,
        backgroundColor: "rgba(16,42,67,0.06)",
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    formTitle: {
        color: "#102A43",
        fontWeight: "900",
        marginBottom: 12,
        fontSize: 14,
    },

    label: {
        color: "rgba(16,42,67,0.58)",
        fontSize: 12,
        marginBottom: 6,
        marginTop: 10,
        fontWeight: "900",
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.96)",
        borderRadius: 16,
        padding: 14,
        color: "#102A43",
        fontSize: 14,
        fontWeight: "800",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },

    slotWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
    slotBtn: {
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    slotBtnActive: { backgroundColor: "#102A43" },
    slotText: { color: "rgba(16,42,67,0.70)", fontWeight: "900", fontSize: 12 },
    slotTextActive: { color: "#fff" },

    bookBtn: {
        marginTop: 16,
        backgroundColor: "#37d06d",
        paddingVertical: 14,
        borderRadius: 16,
    },
    bookText: {
        textAlign: "center",
        color: "#062118",
        fontWeight: "900",
        fontSize: 15,
    },

    empty: {
        color: "rgba(16,42,67,0.55)",
        textAlign: "center",
        fontWeight: "800",
    },
});
