import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";

export default function ChangePassword() {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");

    const [showForgot, setShowForgot] = useState(false);
    const [email, setEmail] = useState("");

    const updatePassword = () => {
        if (!oldPass || !newPass) return Alert.alert("Error", "Fill all fields");
        Alert.alert("Success", "Password updated");
        setOldPass("");
        setNewPass("");
    };

    const sendResetLink = () => {
        if (!email) return Alert.alert("Error", "Enter your email address");
        Alert.alert(
            "Reset Link Sent",
            "If this email exists, a password reset link has been sent."
        );
        setEmail("");
        setShowForgot(false);
    };

    return (
        <ScrollView style={styles.root}>
            <Text style={styles.header}>Change Password</Text>

            {/* CHANGE PASSWORD CARD */}
            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={oldPass}
                    onChangeText={setOldPass}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPass}
                    onChangeText={setNewPass}
                />

                <TouchableOpacity style={styles.btn} onPress={updatePassword}>
                    <Text style={styles.btnText}>Update Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowForgot(!showForgot)}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            {/* FORGOT PASSWORD SECTION */}
            {showForgot && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Reset via Email</Text>
                    <Text style={styles.subText}>
                        Enter your registered email to receive a password reset link.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Email Address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity style={styles.btn} onPress={sendResetLink}>
                        <Text style={styles.btnText}>Send Reset Link</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF", padding: 20, paddingTop: 60 },

    header: {
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 20,
        color: "#102A43",
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },

    btn: {
        backgroundColor: "#37d06d",
        padding: 14,
        borderRadius: 12,
        marginTop: 4,
    },

    btnText: {
        textAlign: "center",
        fontWeight: "900",
        color: "#062118",
    },

    forgotText: {
        textAlign: "center",
        marginTop: 12,
        fontWeight: "700",
        color: "#2563eb",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 6,
        color: "#102A43",
    },

    subText: {
        fontSize: 13,
        marginBottom: 10,
        color: "rgba(16,42,67,0.65)",
    },
});
