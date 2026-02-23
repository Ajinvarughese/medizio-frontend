import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
} from "react-native";
import { icons } from "@/interfaces/constants/icons";

const { width } = Dimensions.get("window");

export default function About() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Background Blobs */}
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* Header */}
            <Text style={styles.header}>About Medicare</Text>

            {/* Logo + Tagline */}
            <View style={styles.centerBox}>
                <Image source={icons.logo} style={styles.logo} />
                <Text style={styles.tagline}>AI-Powered Smart Healthcare</Text>
            </View>

            {/* Description */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Who We Are</Text>
                <Text style={styles.text}>
                    Medicare is a modern healthcare platform that connects patients with
                    doctors, diagnostics, and AI-powered medical insights — all in one place.
                </Text>

                <Text style={styles.text}>
                    Our goal is to make healthcare accessible, intelligent, and convenient
                    for everyone by combining trusted medical services with advanced AI support.
                </Text>
            </View>

            {/* Features */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>What We Offer</Text>

                <Feature icon="🧠" text="AI Disease Prediction & Health Guidance" />
                <Feature icon="📅" text="Easy Appointment Booking" />
                <Feature icon="🧪" text="Lab Reports & Diagnostics" />
                <Feature icon="💊" text="Digital Prescriptions" />
                <Feature icon="🚑" text="24/7 Emergency Support" />
            </View>

            {/* Version Info */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>App Information</Text>
                <InfoRow label="Version" value="1.0.0" />
                <InfoRow label="Developed By" value="Medicare Tech Team" />
                <InfoRow label="Support" value="support@medicare.com" />
            </View>

            {/* Contact Button */}
            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => Linking.openURL("mailto:support@medicare.com")}
            >
                <Text style={styles.primaryText}>Contact Support</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ---------- Reusable Components ---------- */

function Feature({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", paddingTop: 60 },

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

    header: {
        fontSize: 26,
        fontWeight: "900",
        color: "#102A43",
        marginHorizontal: 20,
        marginBottom: 20,
    },

    centerBox: { alignItems: "center", marginBottom: 20 },
    logo: { width: 80, height: 80, marginBottom: 10 },
    tagline: { fontSize: 14, fontWeight: "800", color: "rgba(16,42,67,0.65)" },

    card: {
        marginHorizontal: 18,
        marginBottom: 16,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.92)",
        padding: 16,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#102A43",
        marginBottom: 10,
    },

    text: {
        fontSize: 13,
        fontWeight: "600",
        color: "rgba(16,42,67,0.65)",
        marginBottom: 8,
        lineHeight: 18,
    },

    featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    featureIcon: { fontSize: 16, marginRight: 10 },
    featureText: { fontSize: 13, fontWeight: "700", color: "#102A43" },

    infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    infoLabel: { color: "rgba(16,42,67,0.55)", fontWeight: "700", fontSize: 13 },
    infoValue: { color: "#102A43", fontWeight: "800", fontSize: 13 },

    primaryBtn: {
        marginHorizontal: 18,
        marginTop: 10,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#37d06d",
    },
    primaryText: {
        textAlign: "center",
        fontWeight: "900",
        color: "#062118",
    },
});
