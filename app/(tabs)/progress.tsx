import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";

import ProgressLineChart from "@/components/ProgressLineChart";
import {
    getPredictionHistory,
    clearPredictionHistory,
} from "@/utils/predictionHistory";
import axios from "axios";
import API_URL from "@/utils/api";
import { getUser } from "@/utils/auth";

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
    const [expanded, setExpanded] = useState(false);

    const fetchPrediction = async () => {
        const user = await getUser();
        const res = await axios.get(`${API_URL}/disease?patientId=${user.id}`);
        setHistory(res.data.reverse());
    }

    const load = async () => {
        setLoading(true);
        await fetchPrediction();
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // chart confidence values (oldest -> latest)
    const chartData = useMemo(() => {
        return history.map((h) => Number(h.confidence || 0));
    }, [history]);

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

            {/* Chart Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Confidence Timeline</Text>

                {loading ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Loading...</Text>
                    </View>
                ) : chartData.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No Predictions Yet</Text>
                        <Text style={styles.emptyText}>
                            Upload a scan in AI Disease Prediction to start tracking progress.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.chartCard}>
                        <View style={styles.trendRow}>
                            <Text style={styles.trendLabel}>Trend</Text>
                            <Text style={[styles.trendValue, { color: trend.color }]}>
                                {trend.label}
                            </Text>
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <ProgressLineChart data={chartData} />
                        </View>

                        <Text style={styles.chartHint}>
                            Graph represents AI prediction confidence (%) for each scan upload.
                        </Text>
                    </View>
                )}
            </View>

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
});
