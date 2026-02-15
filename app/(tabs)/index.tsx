import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Modal,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import AIChat from "@/components/AIChat";

const { width, height } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();
    const [openAI, setOpenAI] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.root}
                contentContainerStyle={{ paddingBottom: 180 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Background */}
                <View style={styles.bg}>
                    <View style={styles.bgBlob1} />
                    <View style={styles.bgBlob2} />
                </View>

                {/* Navbar */}
                <View style={styles.navbar}>
                    <View style={styles.brand}>
                        <View style={styles.logoBox}>
                            <View style={styles.logoDot} />
                        </View>
                        <Text style={styles.brandText}>Medicare</Text>
                    </View>
                </View>

                {/* Main Card */}
                <View style={styles.container}>
                    {/* HERO */}
                    <View style={styles.hero}>
                        {/* LEFT */}
                        <View style={styles.heroLeft}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>✨ AI Smart Healthcare</Text>
                            </View>

                            <Text style={styles.heroTitle}>
                                Care That{"\n"}
                                <Text style={styles.heroAccent}>Feels</Text> Better.
                            </Text>

                            <Text style={styles.heroDesc}>
                                Consult trusted doctors, track your health and detect diseases early
                                with smart AI prediction & diagnostics.
                            </Text>

                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={() => router.push("/(tabs)")}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.primaryBtnText}>Explore Services</Text>
                                <View style={styles.primaryBtnArrowWrap}>
                                    <Text style={styles.primaryBtnArrow}>↗</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* RIGHT */}
                        <View style={styles.heroRight}>
                            <View style={styles.doctorWrap}>
                                <Image source={icons.doctor} style={styles.doctorImg} resizeMode="cover" />
                            </View>

                            {/* Floating Cards */}
                            <View style={[styles.floatCard, { top: 8, right: -10 }]}>
                                <Text style={styles.floatValue}>490+</Text>
                                <Text style={styles.floatLabel}>Achievements</Text>
                            </View>

                            <View style={[styles.floatCard, { bottom: 28, left: -14 }]}>
                                <Text style={styles.floatValue}>24/7</Text>
                                <Text style={styles.floatLabel}>Emergency</Text>
                            </View>

                            <View style={[styles.floatCard, { bottom: -10, right: -10 }]}>
                                <Text style={styles.floatValue}>6.7K+</Text>
                                <Text style={styles.floatLabel}>Recovered</Text>
                            </View>
                        </View>
                    </View>

                    {/* SERVICES */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Our Medical Services</Text>
                        <Text style={styles.sectionSub}>
                            Modern treatment, quick diagnosis, better results.
                        </Text>
                    </View>

                    <View style={styles.servicesGrid}>
                        {serviceCard("🧠", "Brain Scan", "Neuro + memory check")}
                        {serviceCard("🫀", "Heart Care", "ECG & risk report")}
                        {serviceCard("🫁", "Lung AI", "Pneumonia detection")}
                        {serviceCard("🧬", "Lab Tests", "Fast reports")}
                    </View>

                    {/* ABOUT */}
                    <View style={styles.aboutWrap}>
                        <View style={styles.aboutTop}>
                            <Text style={styles.aboutMini}>ABOUT MEDICARE</Text>
                            <Text style={styles.aboutTitle}>Personalized healthcare made simple.</Text>
                        </View>

                        <Text style={styles.aboutDesc}>
                            Medicare connects patients, doctors and hospital services in one platform —
                            making treatment smooth, secure and efficient.
                        </Text>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => router.push("/(tabs)/appointments")}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.secondaryBtnText}>Book Appointment</Text>
                            <View style={styles.secondaryArrow}>
                                <Text style={styles.secondaryArrowText}>↗</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* STATS */}
                    <View style={styles.statsWrap}>
                        {stat("250M+", "Funding")}
                        {stat("20M+", "Patients")}
                        {stat("95%", "Satisfaction")}
                        {stat("200+", "Doctors")}
                    </View>
                </View>
            </ScrollView>

            {/* ✅ Premium Floating AI Button */}
            <TouchableOpacity style={styles.aiBtn} activeOpacity={0.9} onPress={() => setOpenAI(true)}>
                <View style={styles.aiBtnGlow} />

                {/* Notification dot */}
                <View style={styles.aiDot} />

                <View style={styles.aiIconWrap}>
                    <Image source={icons.chat} style={styles.aiIconImg} />
                </View>

                <Text style={styles.aiLabel}>AI</Text>
            </TouchableOpacity>

            {/* ✅ AI CHAT MODAL */}
            <Modal visible={openAI} transparent animationType="slide" onRequestClose={() => setOpenAI(false)}>
                <View style={styles.modalWrap}>
                    <Pressable style={styles.overlay} onPress={() => setOpenAI(false)} />

                    <View style={styles.sheet}>
                        {/* Sheet Header */}
                        <View style={styles.sheetTop}>
                            <View style={styles.sheetBrand}>
                                <View style={styles.sheetIconWrap}>
                                    <Image source={icons.chat} style={styles.sheetIcon} />
                                </View>

                                <View>
                                    <Text style={styles.sheetTitle}>Medicare AI Assistant</Text>
                                    <Text style={styles.sheetSub}>Ask symptoms, reports & health guidance</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpenAI(false)}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Chat */}
                        <View style={{ flex: 1 }}>
                            <AIChat />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ---------------- Components ---------------- */

function serviceCard(icon: string, title: string, desc: string) {
    return (
        <View style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
                <Text style={{ fontSize: 24 }}>{icon}</Text>
            </View>

            <Text style={styles.serviceTitle}>{title}</Text>
            <Text style={styles.serviceDesc}>{desc}</Text>

            <View style={styles.serviceArrow}>
                <Text style={styles.serviceArrowText}>→</Text>
            </View>
        </View>
    );
}

function stat(v: string, t: string) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{v}</Text>
            <Text style={styles.statLabel}>{t}</Text>
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF" },

    bg: { position: "absolute", width: "100%", height: "100%" },
    bgBlob1: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: 999,
        backgroundColor: "rgba(70, 205, 255, 0.22)",
        top: -110,
        left: -90,
    },
    bgBlob2: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 999,
        backgroundColor: "rgba(55, 208, 109, 0.18)",
        bottom: -120,
        right: -80,
    },

    navbar: {
        paddingTop: 55,
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    brand: { flexDirection: "row", alignItems: "center", gap: 10 },
    logoBox: {
        width: 42,
        height: 42,
        borderRadius: 16,
        backgroundColor: "#102A43",
        justifyContent: "center",
        alignItems: "center",
    },
    logoDot: { width: 16, height: 16, borderRadius: 99, backgroundColor: "#37d06d" },
    brandText: { fontWeight: "900", fontSize: 18, color: "#102A43" },

    container: {
        marginTop: 20,
        marginHorizontal: 16,

        padding: 21,
        backgroundColor: "rgba(255,255,255,0.75)",

        borderColor: "rgba(0,0,0,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 18,
        elevation: 8,
    },

    hero: { flexDirection: "row", gap: 14 },
    heroLeft: { flex: 1 },
    heroRight: { width: width * 0.42 },

    tag: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "rgba(55, 208, 109, 0.16)",
    },
    tagText: { fontWeight: "900", color: "#0f2f47", fontSize: 12 },

    heroTitle: {
        marginTop: 16,
        fontSize: 40,
        fontWeight: "900",
        lineHeight: 44,
        color: "#102A43",
    },
    heroAccent: { color: "#37d06d" },

    heroDesc: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 20,
        color: "rgba(16,42,67,0.72)",
    },

    primaryBtn: {
        marginTop: 16,
        backgroundColor: "#102A43",
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    primaryBtnText: { color: "#fff", fontWeight: "900" },
    primaryBtnArrowWrap: {
        width: 34,
        height: 34,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        justifyContent: "center",
        alignItems: "center",
    },
    primaryBtnArrow: { fontWeight: "900", color: "#0f2f47" },

    doctorWrap: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "rgba(70, 205, 255, 0.15)",
    },
    doctorImg: { width: "100%", height: "100%" },

    floatCard: {
        position: "absolute",
        width: 95,
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    floatValue: { fontWeight: "900", color: "#102A43", fontSize: 15 },
    floatLabel: { marginTop: 2, fontWeight: "800", color: "rgba(16,42,67,0.6)", fontSize: 11 },

    sectionHeader: { marginTop: 24, marginBottom: 14 },
    sectionTitle: { fontWeight: "900", fontSize: 18, color: "#102A43" },
    sectionSub: { marginTop: 4, fontWeight: "700", color: "rgba(16,42,67,0.6)", fontSize: 12 },

    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },

    serviceCard: {
        width: "47.8%",
        borderRadius: 24,
        padding: 14,
        backgroundColor: "rgba(245, 251, 255, 0.9)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    serviceIcon: {
        width: 46,
        height: 46,
        borderRadius: 18,
        backgroundColor: "rgba(55, 208, 109, 0.14)",
        justifyContent: "center",
        alignItems: "center",
    },
    serviceTitle: { marginTop: 12, fontWeight: "900", color: "#102A43" },
    serviceDesc: {
        marginTop: 6,
        fontWeight: "700",
        fontSize: 11,
        lineHeight: 16,
        color: "rgba(16,42,67,0.65)",
    },
    serviceArrow: {
        marginTop: 12,
        width: 40,
        height: 40,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
    },
    serviceArrowText: { fontWeight: "900", color: "#0f2f47", fontSize: 16 },

    aboutWrap: {
        marginTop: 24,
        borderRadius: 28,
        padding: 16,
        backgroundColor: "rgba(16, 42, 67, 0.06)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    aboutTop: { gap: 6 },
    aboutMini: { fontWeight: "900", color: "#37d06d", fontSize: 12, letterSpacing: 1 },
    aboutTitle: { fontWeight: "900", fontSize: 18, color: "#102A43", lineHeight: 24 },
    aboutDesc: {
        marginTop: 10,
        fontWeight: "700",
        fontSize: 12,
        lineHeight: 18,
        color: "rgba(16,42,67,0.70)",
    },

    secondaryBtn: {
        marginTop: 14,
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#102A43",
    },
    secondaryBtnText: { color: "#fff", fontWeight: "900" },
    secondaryArrow: {
        width: 34,
        height: 34,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryArrowText: { fontWeight: "900", color: "#0f2f47" },

    statsWrap: {
        marginTop: 18,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },
    statItem: {
        width: "47.5%",
        borderRadius: 22,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    statValue: { fontWeight: "900", color: "#102A43", fontSize: 20 },
    statLabel: { marginTop: 4, fontWeight: "800", fontSize: 11, color: "rgba(16,42,67,0.6)" },

    /* ✅ premium floating AI button */
    aiBtn: {
        position: "absolute",
        right: 18,
        bottom: 96, // above bottom tabs
        width: 66,
        height: 66,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.07)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        elevation: 12,
        overflow: "hidden",
    },

    aiBtnGlow: {
        position: "absolute",
        width: 110,
        height: 110,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.18)",
    },

    aiDot: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 10,
        height: 10,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        borderWidth: 2,
        borderColor: "#fff",
    },

    aiIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 18,
        backgroundColor: "rgba(16,42,67,0.08)",
        justifyContent: "center",
        alignItems: "center",
    },
    aiIconImg: { width: 26, height: 26, tintColor: "#102A43" },

    aiLabel: { marginTop: 4, fontWeight: "900", fontSize: 11, color: "#102A43" },

    /* modal sheet */
    modalWrap: { flex: 1, justifyContent: "flex-end" },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

    sheet: {
        height: height * 0.78,
        backgroundColor: "#F5FBFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
    },

    sheetTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingBottom: 10,
    },

    sheetBrand: { flexDirection: "row", alignItems: "center", gap: 10 },
    sheetIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 18,
        backgroundColor: "rgba(55,208,109,0.16)",
        justifyContent: "center",
        alignItems: "center",
    },
    sheetIcon: { width: 22, height: 22, tintColor: "#102A43" },

    sheetTitle: { fontWeight: "900", color: "#102A43", fontSize: 15 },
    sheetSub: {
        marginTop: 2,
        fontWeight: "800",
        fontSize: 12,
        color: "rgba(16,42,67,0.55)",
    },

    closeBtn: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: "rgba(16,42,67,0.08)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeText: { fontWeight: "900", color: "#102A43", fontSize: 14 },
});
