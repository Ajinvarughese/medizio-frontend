import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";

export default function Notifications() {
    const [appointments, setAppointments] = useState(true);
    const [reports, setReports] = useState(false);
    const [offers, setOffers] = useState(true);

    return (
        <ScrollView style={styles.root}>
            <Text style={styles.header}>Notifications</Text>

            <View style={styles.card}>
                <Toggle label="Appointment Alerts" value={appointments} onChange={setAppointments} />
                <Toggle label="Lab Report Updates" value={reports} onChange={setReports} />
                <Toggle label="Health Tips & Offers" value={offers} onChange={setOffers} />
            </View>
        </ScrollView>
    );
}

function Toggle({ label, value, onChange }: any) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Switch value={value} onValueChange={onChange} trackColor={{ true: "#37d06d" }} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },
    header: { fontSize: 24, fontWeight: "900", marginBottom: 20, color: "#102A43" },
    card: { backgroundColor: "#fff", padding: 16, borderRadius: 20 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    label: { fontWeight: "700", color: "#102A43" },
});
