import React, { useEffect, useMemo, useState } from "react";
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

import { icons } from "@/interfaces/constants/icons";
import { images } from "@/interfaces/constants/images";
import { isAvailable, saveAppointment } from "@/utils/appointments";
import { fetchAllDoctors } from "@/utils/doctor";
import { isValidFutureDate } from "@/utils/dateTime";
import { getUser } from "@/utils/auth";
import axios from "axios";

const { width } = Dimensions.get("window");

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function AppointmentBooking() {
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [availability, setAvailability] = useState<boolean | null>(null);
    
    const [reason, setReason] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchAllDoctors();

            // Sort: true first, false last
            const sorted = data.sort((a: any, b: any) => {
                return Number(b.availability) - Number(a.availability);
            });

            setDoctors(sorted);
        };

        loadData();
    }, []);

    const checkAvailability = async () => {

        if (!selectedDate || !selectedTime || !expandedId || !isValidFutureDate(selectedDate)) return;
        
        const res = await isAvailable(expandedId, selectedDate, selectedTime);
        setAvailability(res);
        return res;
    }

    useEffect(() => {
        checkAvailability();
    },[expandedId, selectedDate, selectedTime]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return doctors;

        return doctors.filter(
            (d: any) =>
                d?.name?.toLowerCase().includes(q) ||
                d?.speciality?.name?.toLowerCase().includes(q) ||
                d?.location?.toLowerCase().includes(q)
        );
    }, [search, doctors]);

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        setExpandedId(id);
        setSelectedDate("");
        setReason("");
    };

    const handleBook = async (doc: any) => {
        if (!selectedDate || !reason || !selectedTime) {
            Alert.alert("Missing Info", "Please enter Date and Reason.");
            return;
        }

        if(!checkAvailability()) return;

        const patientId = await getUser();
        const payload = {
            date: selectedDate,
            time: selectedTime,
            reason,
            doctor: {
                id: doc.id
            },
            patient: {
                id: patientId.id
            }
        }  
        try {
            await saveAppointment(payload);
        } catch (error) {
            if(axios.isAxiosError(error)) {
                if(error.response?.status === 409) {
                    Alert.alert("Appointment Conflict", "Appointment already exists for this time.");
                }
            }
        }

        Alert.alert("Appointment Booked ✅", `Booked with ${doc.name}`);
        setExpandedId(null);
        setSelectedDate("");
        setReason("");
        setAvailability(null);
    };

    const generateTimeSlots = (start: string, end: string) => {
        const parseTime = (time: string) => {
            const [clock, modifier] = time.split(" ");
            let [hours, minutes] = clock.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        const formatTime = (minutes: number) => {
            let hrs = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const modifier = hrs >= 12 ? "PM" : "AM";

            if (hrs > 12) hrs -= 12;
            if (hrs === 0) hrs = 12;

            return `${hrs}:${mins.toString().padStart(2, "0")} ${modifier}`;
        };

        const startMin = parseTime(start);
        const endMin = parseTime(end);

        const slots: string[] = [];

        for (let t = startMin; t <= endMin; t += 10) {
            slots.push(formatTime(t));
        }

        return slots;
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <Image source={images.bg} style={styles.bg} />
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.logoWrap}>
                        <Image source={icons.logo} style={styles.logo} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Book Appointment</Text>
                        <Text style={styles.subTitle}>
                            Search doctors and schedule appointment
                        </Text>
                    </View>
                </View>
            </View>

            {/* Search */}
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

            {/* Doctor List */}
            <View style={{ marginTop: 16 }}>
                {filtered.map((doc: any) => {
                    const isOpen = expandedId === doc.id;

                    return (
                        <View key={doc.id} style={{
                            ...styles.card,
                            opacity: doc?.availability ? 1 : 0.7
                        }}>
                            <TouchableOpacity
                                disabled={!doc?.availability}
                                activeOpacity={0.9}
                                onPress={() => toggleExpand(doc.id)}
                            >
                                <View style={styles.topRow}>
                                    <View style={styles.leftRow}>
                                        <View style={styles.avatarWrap}>
                                            <Image
                                                source={{ uri: doc.picture }}
                                                style={styles.avatar}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.docName}>{doc.name}</Text>

                                            <View style={styles.specChip}>
                                                <Text style={styles.specChipText}>
                                                    {doc.speciality?.name}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.expandText}>
                                        {isOpen ? "Hide ▲" : "Book ▼"}
                                    </Text>
                                </View>

                                <Text style={styles.metaLine}>
                                    🧑‍⚕️ {doc.experience} yrs experience
                                </Text>

                                <Text style={styles.metaLine}>
                                    📍 {doc.location}
                                </Text>

                                <Text style={styles.metaLine}>
                                    ⏰ {doc.startTime} - {doc.endTime}
                                </Text>
                            </TouchableOpacity>
                                {
                                    !doc?.availability &&
                                        <Text style={{color: "red", fontWeight: 700, marginTop: 10}}> Doctor unavailable </Text>
                                }     
                        
                        
                        {isOpen && (
                            <View style={styles.detailBox}>
                                <Text style={styles.label}>Date</Text>
                                <TextInput
                                    value={selectedDate}
                                    onChangeText={setSelectedDate}
                                    placeholder="YYYY-MM-DD"
                                    style={styles.input}
                                />
                                {selectedDate.length > 0 && (
                                        !isValidFutureDate(selectedDate) ? (
                                        <Text style={{color: "red", marginLeft: 5}}>Please enter a valid date</Text>
                                        ) : ""
                                )}

                                <Text style={styles.label}>Select Time</Text>

                                <ScrollView
                                    style={styles.slotContainer}
                                    contentContainerStyle={styles.slotWrap}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {generateTimeSlots(doc.startTime, doc.endTime).map((time) => {
                                        const active = selectedTime === time;

                                        return (
                                            <TouchableOpacity
                                                key={time}
                                                style={[
                                                    styles.slotBtn,
                                                    active && styles.slotBtnActive,
                                                ]}
                                                onPress={() => setSelectedTime(time)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.slotText,
                                                        active && styles.slotTextActive,
                                                    ]}
                                                >
                                                    {time}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                                <Text style={styles.label}>Reason</Text>
                                <TextInput
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder="Explain symptoms"
                                    style={[styles.input, { height: 90 }]}
                                    multiline
                                />
                                <Text
                                    style={[
                                        styles.label,
                                        availability === true && { color: "green" },
                                        availability === false && { color: "red" },
                                    ]}
                                >
                                    {availability === null
                                        ? ""
                                        : availability
                                        ? "Doctor is available"
                                        : "Doctor is unavailable"}
                                </Text>
                                <TouchableOpacity
                                    style={styles.bookBtn}
                                    onPress={() => handleBook(doc)}
                                >
                                    <Text style={styles.bookText}>
                                        Confirm Appointment
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                        </View>
                    );
                })}

                {filtered.length === 0 && (
                    <Text style={styles.empty}>No doctors found.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", paddingTop: 50 },

    bg: { position: "absolute", width: "100%", height: "100%", opacity: 0.05 },

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
    },
    logo: { width: 42, height: 40 },

    title: { color: "#102A43", fontWeight: "900", fontSize: 22 },
    subTitle: { marginTop: 4, color: "rgba(16,42,67,0.55)", fontSize: 12 },

    searchBox: {
        marginHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    searchIcon: { fontSize: 18, marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14 },

    card: {
        marginHorizontal: 18,
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
    },

    topRow: { flexDirection: "row", justifyContent: "space-between" },
    leftRow: { flexDirection: "row", gap: 12, flex: 1 },

    avatarWrap: {
        width: 54,
        height: 54,
        borderRadius: 20,
        overflow: "hidden",
    },
    avatar: { width: 54, height: 54 },

    docName: { fontWeight: "900", fontSize: 16 },
    specChip: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.16)",
    },
    specChipText: { fontSize: 11, fontWeight: "900" },

    expandText: { fontSize: 12 },

    metaLine: { marginTop: 8, fontSize: 12 },

    detailBox: {
        marginTop: 14,
        backgroundColor: "rgba(16,42,67,0.06)",
        padding: 14,
        borderRadius: 18,
    },

    label: { marginTop: 10, marginBottom: 6, fontSize: 12 },

    input: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        fontSize: 14,
    },

    bookBtn: {
        marginTop: 16,
        backgroundColor: "#37d06d",
        paddingVertical: 14,
        borderRadius: 16,
    },

    bookText: { textAlign: "center", fontWeight: "900" },

    empty: {
        textAlign: "center",
        marginTop: 24,
    },
    slotContainer: {
        maxHeight: 180,   
    },

    slotWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    slotBtn: {
        width: "30%",   
        marginBottom: 10,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },

    slotBtnActive: {
        backgroundColor: "#102A43",
    },

    slotText: {
        fontSize: 12,
    },

    slotTextActive: {
        color: "#fff",
    },
});