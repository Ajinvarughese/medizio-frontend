import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Settings() {
    const router = useRouter();

    const confirmDelete = () => {
        Alert.alert(
            "Delete Account",
            "This action is permanent. Are you sure you want to delete your account?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => console.log("Account Deleted") },
            ]
        );
    };

    const logout = () => {
        Alert.alert("Logout", "Do you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: () => router.replace("/") },
        ]);
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Settings</Text>

            <View style={styles.card}>
                <SettingItem icon="👤" label="Edit Profile" onPress={() => router.push("/profile/edit")} />
                <SettingItem icon="🔑" label="Change Password" onPress={() => router.push("/profile/change-password")} />
                <SettingItem icon="🔔" label="Notifications" onPress={() => router.push("/profile/notifications")} />
            </View>

            <View style={styles.card}>
                <SettingItem icon="🔒" label="Privacy Policy" onPress={() => router.push("/profile/privacy")} />
                <SettingItem icon="📄" label="Terms & Conditions" onPress={() => router.push("/profile/terms")} />
            </View>

            <View style={styles.card}>
                <SettingItem icon="🗑️" label="Delete Account" danger onPress={confirmDelete} />
                <SettingItem icon="🚪" label="Logout" danger onPress={logout} />
            </View>
        </ScrollView>
    );
}

/* ---------- Reusable Item ---------- */

function SettingItem({
                         icon,
                         label,
                         onPress,
                         danger,
                     }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
}) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.label, danger && { color: "#DC2626" }]}>{label}</Text>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
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

    card: {
        marginHorizontal: 18,
        marginBottom: 16,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingVertical: 6,
        paddingHorizontal: 14,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    icon: { fontSize: 18, marginRight: 14 },
    label: { flex: 1, fontSize: 15, fontWeight: "800", color: "#102A43" },
    arrow: { fontSize: 18, color: "rgba(16,42,67,0.4)" },
});
