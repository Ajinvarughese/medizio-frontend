import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { authUser } from "@/utils/auth";

const { width } = Dimensions.get("window");

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
    const [showDropdown, setShowDropdown] = useState(false);

    const roles: ("patient" | "doctor" | "admin")[] = [
        "patient",
        "doctor",
        "admin",
    ];

    const handleLogin = async () => {
        try {
            await authUser({ loginId: email, password }, role);

            if(role === "patient") {
                router.push("/(tabs)/home");
            } else if(role === "doctor") {
                router.push("/(doctor)/(tabs)");
            } else if(role === "admin") {
                router.push("/(admin)");
            }
        } catch (error) {
            Alert.alert("Login Failed", "Please check your credentials.");
            console.log(error);
        }
    };

    return (
        <View style={styles.root}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>
                    Login to continue your care journey
                </Text>

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(16,42,67,0.5)"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(16,42,67,0.5)"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Role Dropdown */}
                <Text style={styles.label}>Login As</Text>

                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Text style={styles.dropdownText}>
                        {role.toUpperCase()}
                    </Text>
                    <Text style={styles.dropdownArrow}>
                        {showDropdown ? "▲" : "▼"}
                    </Text>
                </TouchableOpacity>

                {showDropdown && (
                    <View style={styles.dropdownList}>
                        {roles.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setRole(item);
                                    setShowDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {item.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => router.push("/(auth)/forgot")}
                >
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleLogin}
                >
                    <Text style={styles.primaryText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Text style={styles.link}>
                        Don’t have an account? Register
                    </Text>
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

    label: {
        fontWeight: "800",
        color: "#102A43",
        marginTop: 10,
    },

    input: {
        marginTop: 6,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.08)",
        color: "#102A43",
    },

    /* Dropdown Styles */
    dropdown: {
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.08)",
    },

    dropdownText: {
        color: "#102A43",
        fontWeight: "700",
    },

    dropdownArrow: {
        fontSize: 14,
        color: "#102A43",
    },

    dropdownList: {
        marginTop: 4,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(16,42,67,0.08)",
        overflow: "hidden",
    },

    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(16,42,67,0.05)",
    },

    dropdownItemText: {
        fontWeight: "600",
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

    primaryText: {
        color: "#fff",
        fontWeight: "900",
    },

    link: {
        marginTop: 16,
        textAlign: "center",
        color: "#102A43",
        fontWeight: "700",
    },
});
