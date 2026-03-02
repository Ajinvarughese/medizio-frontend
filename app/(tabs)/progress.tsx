import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Linking,
    Image
} from "react-native";

import axios from "axios";
import API_URL from "@/utils/api";
import { getUser } from "@/utils/auth";
import { getAppointments } from "@/utils/appointments";
import FILLED_STAR from "@/assets/icons/star_filled.png";
import EMPTY_STAR from "@/assets/icons/star_blank.png";

const { width } = Dimensions.get("window");

const ExpandableAnalysis = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <>
      <Text
        style={styles.recoItem}
        numberOfLines={expanded ? undefined : 3}
      >
        {text}
      </Text>

      {text.length > 120 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMoreText}>
            {expanded ? "Read Less ▲" : "Read More ▼"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default function Progress() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [selectedRatings, setSelectedRatings] = useState<{ [key: number]: number }>({});

    const fetchPrediction = async () => {
        const user = await getUser();
        const res = await axios.get(`${API_URL}/disease?patientId=${user.id}`);
        setHistory(res.data.reverse());
    }

    const handleRating = async (appointmentId: number, rating: number) => {
        try {
            await axios.patch(`${API_URL}/appointment/update/rating`, {
                id: appointmentId,
                rating: rating
            });

            // Refresh appointments
            load();
        } catch (error) {
            console.log("Rating error:", error);
        }
    };

    const load = async () => {
        setLoading(true);

        const user = await getUser();

        // Fetch prediction history (keep if you still need it below)
        await fetchPrediction();

        // Fetch appointments
        const apptRes = await getAppointments();
        setAppointments(apptRes);

        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // chart confidence values (oldest -> latest)
    const chartData = useMemo(() => {
        return history.map((h) => Number(h.confidence || 0));
    }, [history]);
    const getRatingLabel = (rating: number) => {
        switch (rating) {
            case 5: return "Excellent";
            case 4: return "Good";
            case 3: return "Average";
            case 2: return "Bad";
            case 1: return "Very Bad";
            default: return "";
        }
    };
    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "#16a34a";      // green
        if (rating === 3) return "#f59e0b";     // orange
        return "#ef4444";                       // red
    };
    const getRatingBgColor = (rating: number) => {
        if (rating >= 4) return "rgba(22,163,74,0.15)";     // soft green
        if (rating === 3) return "rgba(245,158,11,0.15)";   // soft orange
        return "rgba(239,68,68,0.15)";                      // soft red
    };

    const trend = useMemo(() => {
        if (chartData.length < 2) return { label: "Not enough data", color: "#102A43" };

        const last = chartData[chartData.length - 1];
        const prev = chartData[chartData.length - 2];

        if (last > prev + 3) return { label: "Improving ✅", color: "#16a34a" };
        if (last < prev - 3) return { label: "Worsening ⚠️", color: "#ef4444" };
        return { label: "Stable ⚖️", color: "#f59e0b" };
    }, [chartData]);

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 160 }}>
            {/* Background */}
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Progress Tracker</Text>
                <Text style={styles.subTitle}>
                    Track disease prediction confidence and trends over time.
                </Text>
            </View>

            {/* Recent Appointments */}
            <ScrollView style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Appointments</Text>

                {loading ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Loading...</Text>
                    </View>
                ) : appointments.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No Appointments Yet</Text>
                        <Text style={styles.emptyText}>
                            Book an appointment to see it here.
                        </Text>
                    </View>
                ) : (
                    appointments.map((appt, index) => (
                        <View key={index} style={styles.historyCard}>
                            <View style={styles.hTop}>
                                <Text style={styles.hTitle}>
                                    Dr. {appt.doctor.name}
                                </Text>
                                <Text style={styles.hConfidence}>
                                    {appt.status}
                                </Text>
                            </View>
                            <Text style={styles.hFile}>
                                {appt.doctor.speciality.name}
                            </Text>

                            <Text style={styles.hSub}>
                               📆 {appt.date} • 🕙 {appt.time}
                            </Text>

                            <Text style={styles.hSub}>
                               {appt.reason}
                            </Text>
                            {/* ⭐ Rating Section */}
                            <View style={styles.starWrapper}>
                                <View style={styles.starContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isRated = appt.rating && appt.rating > 0;
                                        const currentRating = isRated
                                            ? appt.rating
                                            : selectedRatings[appt.id] || 0;

                                        return (
                                            <TouchableOpacity
                                                key={star}
                                                disabled={isRated}
                                                onPress={() => {
                                                    setSelectedRatings(prev => ({
                                                        ...prev,
                                                        [appt.id]: star
                                                    }));
                                                }}
                                            >
                                                <Image
                                                    source={
                                                        star <= currentRating
                                                            ? FILLED_STAR
                                                            : EMPTY_STAR
                                                    }
                                                    style={[
                                                        styles.star,
                                                        isRated && styles.starDisabled
                                                    ]}
                                                />
                                            </TouchableOpacity>
                                        );
                                    })}

                                    {/* Rating Count */}
                                    {(() => {
                                        const ratingValue = appt.rating 
                                            ? appt.rating 
                                            : selectedRatings[appt.id] || 0;

                                        return ratingValue > 0 ? (
                                            <Text 
                                                style={[
                                                    styles.ratingText, 
                                                    { color: getRatingColor(ratingValue), backgroundColor: getRatingBgColor(ratingValue) }
                                                ]}
                                            >
                                                {ratingValue} {getRatingLabel(ratingValue)}
                                            </Text>
                                        ) : null;
                                    })()}
                                </View>

                                {/* Confirm Button (Only if not rated and selected) */}
                                {!appt.rating && selectedRatings[appt.id] > 0 && (
                                    <TouchableOpacity
                                        style={styles.confirmBtn}
                                        onPress={() =>
                                            handleRating(appt.id, selectedRatings[appt.id])
                                        }
                                    >
                                        <Text style={styles.confirmText}>Confirm Rating</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View>
                                <ActionBtn
                                    text="Download Document"
                                    color="#36454F"
                                    onPress={() => Linking.openURL(appt.document)}
                                />
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            

            {/* History */}
            <View style={styles.section}>
                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Prediction History</Text>
                </View>
                {history.map((h, index) => (
                    <View key={index} style={styles.section}>

                        <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>
                            {h.affected
                            ? `Affected with ${h.disease?.toLowerCase()}`
                            : `Not affected with ${h.disease?.toLowerCase()}`}
                        </Text>

                        <View style={styles.resultRow}>
                            <View style={styles.metric}>
                            <Text style={styles.metricLabel}>You are</Text>
                            <Text style={styles.metricValue}>
                                {(100 - Number(h.confidence)).toFixed(2)}%
                            </Text>
                            <Text style={styles.metricLabel}>Healthy</Text>
                            </View>

                            <View
                            style={[
                                styles.riskBadge,
                                h.riskClass === "HIGH"
                                ? styles.riskHigh
                                : h.riskClass === "RISKY"
                                ? styles.riskMedium
                                : styles.riskLow,
                            ]}
                            >
                            <Text style={styles.riskText}>{h.riskClass}</Text>
                            </View>
                        </View>

                        <Text style={styles.recoTitle}>Recommendations</Text>

                        <ExpandableAnalysis text={h.aiAnalysis} />
                        </View>
                    </View>
                    ))}
            </View>
        </ScrollView>
    );
}

function ActionBtn({ text, color, onPress }: { text: string; color: string; onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: color }]}>
            <Text style={styles.btnText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF" },

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

    header: { paddingTop: 60, paddingHorizontal: 18, marginBottom: 10 },
    title: { color: "#102A43", fontWeight: "900", fontSize: 22 },
    subTitle: {
        marginTop: 6,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "800",
        fontSize: 12,
        lineHeight: 18,
    },

    section: { marginTop: 18, paddingHorizontal: 18 },
    sectionTitle: { color: "#102A43", fontWeight: "900", fontSize: 16 },

    chartCard: {
        marginTop: 12,
        borderRadius: 24,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    trendRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    trendLabel: { color: "rgba(16,42,67,0.55)", fontWeight: "900" },
    trendValue: { fontWeight: "900" },

    chartHint: {
        marginTop: 12,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "800",
        fontSize: 12,
        lineHeight: 16,
    },

    emptyCard: {
        marginTop: 12,
        borderRadius: 24,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    emptyTitle: { fontWeight: "900", color: "#102A43" },
    emptyText: {
        marginTop: 6,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "800",
        fontSize: 12,
    },

    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    clearBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "rgba(239,68,68,0.10)",
        borderWidth: 1,
        borderColor: "rgba(239,68,68,0.15)",
    },
    clearText: { color: "#ef4444", fontWeight: "900", fontSize: 12 },

    historyCard: {
        marginTop: 12,
        borderRadius: 22,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    hTop: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    hTitle: { fontWeight: "900", color: "#102A43", flex: 1 },
    hConfidence: { fontWeight: "900", color: "#37d06d" },

    hSub: {
        marginTop: 6,
        fontWeight: "900",
        fontSize: 12,
        color: "rgba(16,42,67,0.55)",
    },

    hFile: {
        marginTop: 8,
        fontWeight: "800",
        fontSize: 12,
        color: "rgba(16,42,67,0.70)",
    },

    badge: {
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.14)",
        alignSelf: "flex-start",
    },
    badgeText: { fontWeight: "900", color: "#0f2f47", fontSize: 12 },

    resultCard: {
    marginTop: 12,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    },

    resultTitle: {
    fontWeight: "900",
    color: "#102A43",
    fontSize: 16,
    },

    resultRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    },

    metric: {
    backgroundColor: "rgba(70,205,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    },

    metricValue: {
    fontWeight: "900",
    color: "#0f2f47",
    fontSize: 18,
    },

    metricLabel: {
    marginTop: 4,
    fontWeight: "900",
    color: "rgba(15,47,71,0.55)",
    fontSize: 12,
    },

    riskBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    },

    riskHigh: {
    backgroundColor: "#d65858",
    },

    riskMedium: {
    backgroundColor: "#e6ae65",
    },

    riskLow: {
    backgroundColor: "#3ede79",
    },

    riskText: {
    fontWeight: "900",
    color: "#102A43",
    },

    recoTitle: {
    marginTop: 16,
    fontWeight: "900",
    color: "#102A43",
    },

    recoItem: {
    marginTop: 8,
    color: "rgba(16,42,67,0.55)",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
    },

    readMoreText: {
    marginTop: 6,
    fontWeight: "900",
    color: "#37d06d",
    fontSize: 12,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 14,
        marginTop: 12,
        alignSelf: "flex-start",
    },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 24,
    }, 
    starContainer: {
        flexDirection: "row",
        marginTop: 10,
        gap: 10,
    },
    star: {
        width: 28,
        height: 28,
    }, 
    starWrapper: {
        marginTop: 12,
    },

    starDisabled: {
        opacity: 0.7,
    },

    ratingText: {
        marginLeft: 8,
        fontWeight: "900",
        fontSize: 14,
        color: "#102A43",
        alignSelf: "center",
        borderRadius: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },

    confirmBtn: {
        marginTop: 8,
        backgroundColor: "#16a34a",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignSelf: "flex-start",
    },

    confirmText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 12,
    },

});
