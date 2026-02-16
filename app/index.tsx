import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { identifyUser } from "@/utils/auth";

const { width } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        identifyUser();
    }, []);

    return (
        <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

            {/* 🌌 TOP BACKGROUND LAYERS */}
            <View style={styles.bgLayer1} />
            <View style={styles.bgLayer2} />

            {/* 🧭 NAVBAR */}
            <View style={styles.navbar}>
                <View style={styles.brandRow}>
                    <View style={styles.logoCircle}>
                        <View style={styles.logoDot} />
                    </View>
                    <Text style={styles.brand}>Medicare</Text>
                </View>

                <TouchableOpacity onPress={() => router.push("/(auth)/welcome")} style={styles.navBtn}>
                    <Text style={styles.navBtnText}>Login</Text>
                </TouchableOpacity>
            </View>

            {/* 🧠 HERO SECTION */}
            <View style={styles.heroWrap}>
                <View style={styles.heroTextArea}>
                    <Text style={styles.badge}>AI Powered Healthcare</Text>

                    <Text style={styles.heroTitle}>
                        Smarter Care{"\n"}Starts Here
                    </Text>

                    <Text style={styles.heroDesc}>
                        Diagnose faster, manage records smarter, and deliver
                        better treatment using intelligent healthcare tools.
                    </Text>

                    <TouchableOpacity
                        style={styles.ctaPrimary}
                        onPress={() => router.push("/(auth)/welcome")}
                    >
                        <Text style={styles.ctaPrimaryText}>Get Started</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.heroImageArea}>
                    <View style={styles.imageGlass}>
                        <Image source={icons.doctor} style={styles.heroImg} />
                    </View>
                </View>
            </View>

            {/* 🩺 SERVICES SECTION */}
            <View style={styles.servicesSection}>
                <Text style={styles.sectionTitle}>Medical Services</Text>

                <View style={styles.servicesGrid}>
                    {service("🧠", "Brain AI", "Neuro scan & analysis")}
                    {service("🫀", "Cardio Care", "Heart monitoring")}
                    {service("🫁", "Lung Scan", "Respiratory AI")}
                    {service("🧬", "Lab Tests", "Fast diagnostics")}
                </View>
            </View>

            {/* 🏥 ABOUT SECTION */}
            <View style={styles.aboutSection}>
                <View style={styles.aboutCard}>
                    <Text style={styles.aboutBadge}>WHY MEDICARE?</Text>
                    <Text style={styles.aboutTitle}>
                        Healthcare Built For The Future
                    </Text>
                    <Text style={styles.aboutDesc}>
                        A connected ecosystem where patients, doctors and hospitals
                        work together through smart AI tools and real-time data.
                    </Text>

                    <TouchableOpacity
                        style={styles.ctaSecondary}
                        onPress={() => router.push("/(auth)/welcome")}
                    >
                        <Text style={styles.ctaSecondaryText}>Book Appointment</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 📊 STATS */}
            <View style={styles.statsSection}>
                {stat("200+", "Doctors")}
                {stat("20M+", "Patients")}
                {stat("95%", "Satisfaction")}
                {stat("24/7", "Emergency")}
            </View>

        </ScrollView>
    );
}

/* COMPONENTS */

const service = (icon: string, title: string, desc: string) => (
    <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>{icon}</Text>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDesc}>{desc}</Text>
    </View>
);

const stat = (value: string, label: string) => (
    <View style={styles.statCard}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

/* STYLES */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F4FAFD" },

    /* Background layers */
    bgLayer1: {
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: 999,
        backgroundColor: "rgba(0,180,216,0.15)",
        top: -160,
        right: -120,
    },
    bgLayer2: {
        position: "absolute",
        width: 380,
        height: 380,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.12)",
        bottom: -160,
        left: -120,
    },

    /* Navbar */
    navbar: {
        marginTop: 60,
        paddingHorizontal: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    brandRow: { flexDirection: "row", alignItems: "center" },
    logoCircle: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    logoDot: { width: 16, height: 16, borderRadius: 99, backgroundColor: "#000" },
    brand: { marginLeft: 10, fontSize: 20, fontWeight: "900" },

    navBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#fff",
        elevation: 3,
    },
    navBtnText: { fontWeight: "800" },

    /* Hero */
    heroWrap: {
        marginTop: 30,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
    },
    heroTextArea: { flex: 1, paddingRight: 10 },
    badge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#E6F9FF",
        fontSize: 12,
        fontWeight: "700",
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: "900",
        marginTop: 14,
        lineHeight: 38,
    },
    heroDesc: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 22,
        opacity: 0.7,
    },
    ctaPrimary: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 4,
    },
    ctaPrimaryText: { fontWeight: "900" },

    heroImageArea: {
        width: width * 0.42,
        alignItems: "center",
    },
    imageGlass: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    heroImg: { width: "100%", height: "100%" },

    /* Services */
    servicesSection: { marginTop: 50, paddingHorizontal: 22 },
    sectionTitle: { fontSize: 20, fontWeight: "900" },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 18,
        gap: 14,
    },
    serviceCard: {
        width: "47%",
        borderRadius: 24,
        padding: 18,
        backgroundColor: "#fff",
        elevation: 4,
    },
    serviceIcon: { fontSize: 26 },
    serviceTitle: { marginTop: 10, fontWeight: "900" },
    serviceDesc: { marginTop: 4, fontSize: 12, opacity: 0.6 },

    /* About */
    aboutSection: { marginTop: 60, paddingHorizontal: 22 },
    aboutCard: {
        borderRadius: 28,
        padding: 24,
        backgroundColor: "#fff",
        elevation: 6,
    },
    aboutBadge: { fontWeight: "800", fontSize: 12, opacity: 0.6 },
    aboutTitle: { marginTop: 8, fontSize: 20, fontWeight: "900" },
    aboutDesc: { marginTop: 10, fontSize: 14, lineHeight: 22, opacity: 0.7 },
    ctaSecondary: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 3,
    },
    ctaSecondaryText: { fontWeight: "900" },

    /* Stats */
    statsSection: {
        marginTop: 50,
        paddingHorizontal: 22,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 14,
        marginBottom: 40,
    },
    statCard: {
        width: "47%",
        borderRadius: 24,
        padding: 18,
        backgroundColor: "#fff",
        elevation: 4,
    },
    statValue: { fontSize: 18, fontWeight: "900" },
    statLabel: { marginTop: 4, fontSize: 12, opacity: 0.6 },
});
