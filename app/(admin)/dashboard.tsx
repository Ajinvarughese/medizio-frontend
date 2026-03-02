import React, { useEffect, useMemo, useState } from "react";
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
import { getAllPatients } from "@/utils/patients";
import { fetchAllDoctors } from "@/utils/doctor";
import { getAllAppointments } from "@/utils/appointments";
import { isCurrentWeek } from "@/utils/dateTime";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const load = async () => {
        const p = await getAllPatients();
        const d = await fetchAllDoctors();
        const a = await getAllAppointments();
        setPatients(p);
        setDoctors(d);
        setAppointments(a);
    }

    useEffect(() => {
        load();
    }, []);
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    
    const monthlyPatientData = useMemo(() => {
      const months = Array(12).fill(0);

      patients.forEach((p) => {
        if (!p?.createdAt) return;

        const date = new Date(p.createdAt);
        const monthIndex = date.getMonth();
        months[monthIndex] += 1;
      });

      return months;
    }, [patients]);

    const currentMonth = new Date().getMonth();
    const firstHalf = currentMonth < 6;
    const chartLabels = firstHalf
      ? monthLabels.slice(0, 6)
      : monthLabels.slice(6, 12);

    const chartData = firstHalf
      ? monthlyPatientData.slice(0, 6)
      : monthlyPatientData.slice(6, 12);

    const approved = doctors.filter(d => d?.verified).length;
    const pending = doctors.filter(d => !d?.verified).length;

    const appointmentsThisWeek = appointments.filter(d => isCurrentWeek(d?.date)).length;
    const totalAppointments = appointments.length;

    const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyAppointmentData = useMemo(() => {
      const days = Array(7).fill(0);

      appointments.forEach((a) => {
        if (!a?.date) return;

        const date = new Date(a.date);

        if (isCurrentWeek(a.date)) {
          const dayIndex = date.getDay(); // 0 = Sunday
          days[dayIndex] += 1;
        }
      });

      return days;
    }, [appointments]);

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
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text style={styles.title}>Admin Dashboard</Text>

        {/* TOP STATS */}
        <View style={styles.row}>
          <Card label="Doctors" value={totalDoctors} />
          <Card label="Patients" value={totalPatients} />
        </View>

        <View style={styles.row}>
          <Card label="Appointments this week " value={appointmentsThisWeek} />
          <Card label="Appointments" value={totalAppointments} />
        </View>

        {/* BAR CHART */}
        <Text style={styles.section}>Monthly Patient Growth</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }],
            }}
            width={width - 60}
            height={220}
            yAxisLabel="" // ✅ REQUIRED
            yAxisSuffix="" // ✅ REQUIRED
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
              labels: weekLabels,
              datasets: [{ data: weeklyAppointmentData }],
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
          {doctors.length > 0 && (
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
          )}
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
