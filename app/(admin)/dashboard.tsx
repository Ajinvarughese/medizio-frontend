import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
} from "react-native-chart-kit";
import { doctors } from "@/mock/doctors";
import { patients } from "@/mock/patients";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;

    const approved = doctors.filter(d => d.status === "Approved").length;
    const pending = doctors.filter(d => d.status === "Pending").length;

    const revenue = totalPatients * 500;

    const doctorStatusData = [
        {
            name: "Approved",
            population: approved,
            color: "#37d06d",
            legendFontColor: "#cbd5e1",
            legendFontSize: 12,
        },
        {
            name: "Pending",
            population: pending,
            color: "#facc15",
            legendFontColor: "#cbd5e1",
            legendFontSize: 12,
        },
    ];

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>

            <Text style={styles.title}>Admin Dashboard</Text>

            {/* TOP STATS */}
            <View style={styles.row}>
                <Card label="Doctors" value={totalDoctors} />
                <Card label="Patients" value={totalPatients} />
            </View>

            <View style={styles.row}>
                <Card label="Revenue" value={`₹ ${revenue}`} />
                <Card label="Appointments" value="128" />
            </View>

            {/* BAR CHART */}
            <Text style={styles.section}>Monthly Patient Growth</Text>
            <View style={styles.chartCard}>
                <BarChart
                    data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [{ data: [20, 45, 28, 80, 60, 43] }],
                    }}
                    width={width - 60}
                    height={220}
                    yAxisLabel=""        // ✅ REQUIRED
                    yAxisSuffix=""       // ✅ REQUIRED
                    chartConfig={chartConfig}
                    style={{ borderRadius: 20 }}
                    showValuesOnTopOfBars
                />

            </View>

            {/* LINE CHART WITH GRADIENT */}
            <Text style={styles.section}>Appointments Trend</Text>
            <View style={styles.chartCard}>
                <LineChart
                    data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        datasets: [{ data: [12, 25, 18, 30, 22, 40] }],
                    }}
                    width={width - 60}
                    height={220}
                    chartConfig={{
                        ...chartConfig,
                        fillShadowGradient: "#37d06d",
                        fillShadowGradientOpacity: 0.4,
                    }}
                    bezier
                    style={{ borderRadius: 20 }}
                />
            </View>

            {/* PIE CHART */}
            <Text style={styles.section}>Doctor Status Overview</Text>
            <View style={styles.chartCard}>
                <PieChart
                    data={doctorStatusData}
                    width={width - 60}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        </ScrollView>
    );
}

/* ---------- Components ---------- */

function Card({ label, value }: any) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

/* ---------- Chart Config ---------- */

const chartConfig = {
    backgroundGradientFrom: "#142825",
    backgroundGradientTo: "#142825",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(55, 208, 109, ${opacity})`,
    labelColor: () => "#9ca3af",
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#37d06d",
    },
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#0f1f1c",
        padding: 20,
        paddingTop: 60,
    },

    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: 20,
    },

    section: {
        fontSize: 16,
        fontWeight: "800",
        color: "#cbd5e1",
        marginTop: 30,
        marginBottom: 14,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    statCard: {
        width: "48%",
        backgroundColor: "#162825",
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    statValue: {
        fontSize: 22,
        fontWeight: "900",
        color: "#37d06d",
    },

    statLabel: {
        marginTop: 6,
        fontSize: 12,
        color: "#9ca3af",
    },

    chartCard: {
        backgroundColor: "#162825",
        padding: 20,
        borderRadius: 24,
    },
});
