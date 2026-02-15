import React, { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    Pressable,
    Animated,
    Easing,
} from "react-native";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

import { user } from "@/mock/user";
import { appointments } from "@/mock/appointments";

const { width } = Dimensions.get("window");

export default function Dashboard() {
    const router = useRouter();

    const [openMenu, setOpenMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const openDrawer = () => {
        setOpenMenu(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeDrawer = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => setOpenMenu(false));
    };

    const stats = useMemo(() => {
        const total = appointments.length;
        const booked = appointments.filter((a) => a.status === "Booked").length;
        const cancelled = appointments.filter((a) => a.status !== "Booked").length;
        const upcoming = appointments.find((a) => a.status === "Booked");
        return { total, booked, cancelled, upcoming };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 140 }}>
                <View style={styles.bgBlob1} />
                <View style={styles.bgBlob2} />

                {/* HEADER */}
                <View style={styles.headerCard}>
                    <View style={styles.profileRow}>
                        <View style={styles.avatarWrap}>
                            <Image source={icons.logo} style={styles.avatar} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.hello}>Welcome Back 👋</Text>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.sub}>{user.role} • ID: {user.id}</Text>
                        </View>

                        <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
                            <Text style={{ fontSize: 20 }}>☰</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STATS */}
                <View style={styles.statsGrid}>
                    <StatCard value={stats.total} label="Total Appointments" icon="📌" />
                    <StatCard value={stats.booked} label="Upcoming / Active" icon="🟢" green />
                    <StatCard value={stats.cancelled} label="Cancelled / Past" icon="🔴" />
                    <StatCard value={"24/7"} label="Emergency Support" icon="🚑" />
                </View>

                {/* UPCOMING */}
                <SectionHeader title="Upcoming Appointment" sub="Your next scheduled visit" />

                {stats.upcoming ? (
                    <View style={styles.glassCard}>
                        <View style={styles.upTop}>
                            <View>
                                <Text style={styles.upDoctor}>{stats.upcoming.doctorName}</Text>
                                <Text style={styles.upSpec}>{stats.upcoming.specialization}</Text>
                            </View>
                            <View style={styles.badge}><Text style={styles.badgeText}>Booked</Text></View>
                        </View>

                        <Text style={styles.upLine}>📅 {stats.upcoming.date}   🕒 {stats.upcoming.time}</Text>
                        <Text style={styles.upLine}>🏥 {stats.upcoming.hospital}</Text>
                        <Text style={styles.upLine}>📍 {stats.upcoming.location}</Text>
                        <Text style={styles.upLine}>📝 {stats.upcoming.reason}</Text>

                        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/(tabs)/appointments")}>
                            <Text style={styles.primaryText}>Manage Appointment</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.glassCard}>
                        <Text style={styles.emptyTitle}>No upcoming appointments</Text>
                        <Text style={styles.emptyText}>Book an appointment to see it appear here.</Text>
                    </View>
                )}

                {/* USER DETAILS */}
                <SectionHeader title="User Details" sub="Patient information" />

                <View style={styles.glassCard}>
                    <DetailRow label="Name" value={user.name} />
                    <DetailRow label="Phone" value={user.phone} />
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow label="Location" value={user.location} />
                </View>
            </ScrollView>

            {/* SIDEBAR DRAWER */}
            <Modal visible={openMenu} transparent animationType="none">
                <View style={styles.drawerWrap}>
                    <Animated.View style={[styles.drawerOverlay, { opacity: overlayAnim }]}>
                        <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
                    </Animated.View>

                    <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                        <Text style={styles.patientName}>Hello, {user.name} 👋</Text>

                        {drawerItem("🏠", "Home", () => { closeDrawer(); router.push("/"); })}
                        {drawerItem("📅", "Appointments", () => { closeDrawer(); router.push("/(tabs)/appointments"); })}
                        {drawerItem("📄", "About", () => { closeDrawer(); router.push("/profile/about"); })}
                        {drawerItem("⚙️", "Settings", () => { closeDrawer(); router.push("/profile/setting"); })}
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

/* ---------- Reusable Components ---------- */

function SectionHeader({ title, sub }: { title: string; sub: string }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionSub}>{sub}</Text>
        </View>
    );
}

function StatCard({ value, label, icon, green }: { value: any; label: string; icon: string; green?: boolean }) {
    return (
        <View style={[styles.statCard, green && styles.statGreen]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

function drawerItem(icon: string, label: string, onPress: () => void) {
    return (
        <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
            <Text style={styles.drawerIcon}>{icon}</Text>
            <Text style={styles.drawerLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF" },

    bgBlob1: { position: "absolute", top: -120, left: -90, width: width, height: width, borderRadius: width, backgroundColor: "rgba(70,205,255,0.18)" },
    bgBlob2: { position: "absolute", bottom: -140, right: -90, width: width, height: width, borderRadius: width, backgroundColor: "rgba(55,208,109,0.14)" },

    headerCard: { marginTop: 60, marginHorizontal: 18, borderRadius: 28, padding: 16, backgroundColor: "rgba(255,255,255,0.75)" },
    profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatarWrap: { width: 58, height: 58, borderRadius: 22, backgroundColor: "rgba(55,208,109,0.14)", justifyContent: "center", alignItems: "center" },
    avatar: { width: 44, height: 42 },

    hello: { color: "rgba(16,42,67,0.6)", fontWeight: "900", fontSize: 12 },
    name: { color: "#102A43", fontWeight: "900", fontSize: 18, marginTop: 4 },
    sub: { marginTop: 4, color: "rgba(16,42,67,0.55)", fontWeight: "800", fontSize: 12 },

    menuBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(16,42,67,0.08)", justifyContent: "center", alignItems: "center" },

    statsGrid: { marginTop: 18, paddingHorizontal: 18, flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },

    statCard: { width: "47.5%", backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 22, padding: 14 },
    statGreen: { backgroundColor: "rgba(55,208,109,0.15)" },
    statIcon: { fontSize: 20 },
    statValue: { marginTop: 8, color: "#102A43", fontSize: 20, fontWeight: "900" },
    statLabel: { marginTop: 4, color: "rgba(16,42,67,0.58)", fontWeight: "800", fontSize: 12 },

    sectionHeader: { marginTop: 24, paddingHorizontal: 18 },
    sectionTitle: { color: "#102A43", fontWeight: "900", fontSize: 18 },
    sectionSub: { marginTop: 4, color: "rgba(16,42,67,0.55)", fontWeight: "800", fontSize: 12 },

    glassCard: { marginTop: 12, marginHorizontal: 18, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 24, padding: 16 },

    upTop: { flexDirection: "row", justifyContent: "space-between" },
    upDoctor: { color: "#102A43", fontWeight: "900", fontSize: 16 },
    upSpec: { marginTop: 6, fontWeight: "900", fontSize: 12, color: "#37d06d" },

    badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(22,163,74,0.12)" },
    badgeText: { color: "#16a34a", fontWeight: "900", fontSize: 12 },

    upLine: { marginTop: 8, color: "rgba(16,42,67,0.65)", fontWeight: "800", fontSize: 12 },

    primaryBtn: { marginTop: 14, paddingVertical: 14, borderRadius: 16, backgroundColor: "#37d06d" },
    primaryText: { textAlign: "center", fontWeight: "900", color: "#062118" },

    emptyTitle: { color: "#102A43", fontWeight: "900", fontSize: 15 },
    emptyText: { marginTop: 6, color: "rgba(16,42,67,0.62)", fontWeight: "800", fontSize: 12 },

    detailRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
    detailLabel: { color: "rgba(16,42,67,0.56)", fontWeight: "900", fontSize: 12 },
    detailValue: { color: "#102A43", fontWeight: "900", fontSize: 12 },

    drawerWrap: { flex: 1 },
    drawerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
    drawer: { position: "absolute", left: 0, top: 0, bottom: 0, width: width * 0.75, backgroundColor: "#fff", paddingTop: 70, paddingHorizontal: 20, borderTopRightRadius: 28, borderBottomRightRadius: 28, elevation: 20 },
    drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 10 },
    drawerIcon: { fontSize: 18 },
    drawerLabel: { fontSize: 14, fontWeight: "800", color: "#102A43" },
    patientName: { fontSize: 16, fontWeight: "900", marginBottom: 20, color: "#102A43" },
});
