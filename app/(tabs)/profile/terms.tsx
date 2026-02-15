import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Terms() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            <Text style={styles.header}>Terms & Conditions</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>1. Medical Disclaimer</Text>
                <Text style={styles.text}>
                    Medicare provides AI-powered health insights and appointment services to assist users.
                    However, the platform does NOT replace professional medical advice, diagnosis, or treatment.
                </Text>
                <Text style={styles.text}>
                    Always consult a qualified healthcare provider for medical concerns. In case of emergencies,
                    contact local emergency services immediately.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
                <Text style={styles.text}>
                    Users are responsible for providing accurate and complete information while using the app.
                    Medicare is not liable for issues arising from incorrect or incomplete data submitted by users.
                </Text>
                <Text style={styles.text}>
                    You agree not to misuse the platform or attempt unauthorized access to other accounts or systems.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>3. Privacy & Data Usage</Text>
                <Text style={styles.text}>
                    Your personal and medical data is securely stored and handled according to our Privacy Policy.
                    We use industry-standard security practices to protect your information.
                </Text>
                <Text style={styles.text}>
                    By using Medicare, you consent to the collection and use of your information for providing healthcare services and improving our platform.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>4. AI-Based Recommendations</Text>
                <Text style={styles.text}>
                    The AI assistant provides automated health guidance based on available data and patterns.
                    These insights are informational and should not be considered a medical diagnosis.
                </Text>
                <Text style={styles.text}>
                    Medicare is not responsible for decisions made solely based on AI recommendations without consulting a doctor.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>5. Appointments & Services</Text>
                <Text style={styles.text}>
                    Appointment availability depends on healthcare providers and hospitals. Medicare does not guarantee
                    doctor availability or service outcomes.
                </Text>
                <Text style={styles.text}>
                    Cancellations, delays, or rescheduling may occur due to circumstances beyond our control.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
                <Text style={styles.text}>
                    Medicare and its team shall not be held liable for any direct or indirect damages arising from
                    the use of the app, including medical outcomes, service interruptions, or data issues.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
                <Text style={styles.text}>
                    We may update these Terms & Conditions from time to time. Continued use of the app after updates
                    means you accept the revised terms.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>8. Contact Information</Text>
                <Text style={styles.text}>
                    If you have questions about these Terms, please contact our support team at support@medicare.com.
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
        marginBottom: 8,
    },
});
