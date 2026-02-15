import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Privacy() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Privacy Policy</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
                <Text style={styles.text}>
                    Medicare is committed to protecting your personal and health information.
                    We only collect data necessary to provide medical services and improve your experience.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Information We Collect</Text>
                <Text style={styles.text}>
                    This may include your name, contact details, appointment history,
                    and health-related inputs you choose to share within the app.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>How We Use Your Data</Text>
                <Text style={styles.text}>
                    Your data helps us provide appointment booking, AI health guidance,
                    and personalized healthcare support. We do not sell your information.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Data Security</Text>
                <Text style={styles.text}>
                    We use secure technologies and industry-standard safeguards to protect
                    your information from unauthorized access or misuse.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Your Control</Text>
                <Text style={styles.text}>
                    You can update or request deletion of your data through the app settings.
                    For any concerns, contact us at support@medicare.com.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5FBFF",
        padding: 20,
        paddingTop: 60,
    },

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
        marginBottom: 20,
        color: "#102A43",
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 6,
        color: "#102A43",
    },

    text: {
        fontSize: 14,
        lineHeight: 20,
        color: "#334155",
    },
});
