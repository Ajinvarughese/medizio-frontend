import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.root}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>Login to continue your care journey</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(16,42,67,0.5)"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(16,42,67,0.5)"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Patient Login */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.replace("/(tabs)")}
                >
                    <Text style={styles.primaryText}>Login as Patient</Text>
                </TouchableOpacity>

                {/* Doctor Login */}
                <TouchableOpacity
                    style={[styles.primaryBtn, styles.doctorBtn]}
                    onPress={() => router.replace("/(doctor)")}
                >
                    <Text style={[styles.primaryText, { color: "#062118" }]}>
                        Login as Doctor
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.primaryBtn, styles.doctorBtn]}
                    onPress={() => router.replace("/(admin)")}
                >
                    <Text style={[styles.primaryText, { color: "#062118" }]}>
                        Login as Admin
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                    <Text style={styles.link}>Don’t have an account? Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5FBFF",
        justifyContent: "center",
        paddingHorizontal: 22,
    },

    bgBlob1: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: 999,
        backgroundColor: "rgba(70,205,255,0.18)",
        top: -120,
        left: -100,
    },
    bgBlob2: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 999,
        backgroundColor: "rgba(55,208,109,0.15)",
        bottom: -140,
        right: -80,
    },

    card: {
        borderRadius: 28,
        padding: 22,
        backgroundColor: "rgba(255,255,255,0.75)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },

    title: { fontSize: 26, fontWeight: "900", color: "#102A43" },
    subtitle: {
        marginTop: 6,
        marginBottom: 18,
        color: "rgba(16,42,67,0.6)",
        fontWeight: "600",
    },

    label: { fontWeight: "800", color: "#102A43", marginTop: 10 },
    input: {
        marginTop: 6,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.08)",
        color: "#102A43",
    },

    forgot: {
        alignSelf: "flex-end",
        marginTop: 10,
        color: "#37d06d",
        fontWeight: "700",
    },

    primaryBtn: {
        marginTop: 18,
        backgroundColor: "#102A43",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },

    doctorBtn: {
        backgroundColor: "#37d06d",
        marginTop: 10,
    },

    primaryText: { color: "#fff", fontWeight: "900" },

    link: {
        marginTop: 16,
        textAlign: "center",
        color: "#102A43",
        fontWeight: "700",
    },
});
