import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
    const router = useRouter();

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" />

            {/* Background Blobs */}
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* Glass Card */}
            <View style={styles.card}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>AI Powered Healthcare</Text>
                </View>

                <Text style={styles.title}>
                    Smart Care for a{"\n"}
                    <Text style={styles.highlight}>Healthier Life</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Consult doctors, manage records, and get AI-based insights — all in
                    one intelligent platform.
                </Text>

                <View style={styles.featureList}>
                    {feature("🩺", "Seamless Patient Care")}
                    {feature("📊", "Real-time Health Monitoring")}
                    {feature("📁", "Comprehensive Medical Records")}
                </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Text style={styles.primaryText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text style={styles.loginText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const feature = (icon: string, text: string) => (
    <View style={styles.featureRow}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5FBFF",
        justifyContent: "space-between",
        paddingTop: 90,
        paddingBottom: 50,
        paddingHorizontal: 20,
    },

    bgBlob1: {
        position: "absolute",
        width: 340,
        height: 340,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.18)",
        top: -120,
        left: -100,
    },
    bgBlob2: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.15)",
        bottom: -140,
        right: -90,
    },

    card: {
        borderRadius: 33,
        padding: 45,
        backgroundColor: "rgba(255,255,255,0.75)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },

    badge: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.15)",
    },
    badgeText: {
        color: "#102A43",
        fontWeight: "900",
        fontSize: 12,
    },

    title: {
        marginTop: 18,
        fontSize: 34,
        fontWeight: "900",
        lineHeight: 40,
        color: "#102A43",
    },
    highlight: {
        color: "#37d06d",
    },

    subtitle: {
        marginTop: 12,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "600",
        color: "rgba(16,42,67,0.75)",
    },

    featureList: {
        marginTop: 26,
        gap: 14,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.85)",
        padding: 12,
        borderRadius: 16,
    },
    featureIcon: { fontSize: 18, marginRight: 12 },
    featureText: {
        fontWeight: "800",
        color: "#102A43",
    },

    bottom: {
        marginTop: 30,
    },

    primaryBtn: {
        backgroundColor: "#102A43",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#102A43",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    primaryText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 15,
    },

    loginText: {
        textAlign: "center",
        marginTop: 18,
        color: "#102A43",
        fontWeight: "700",
    },
});
