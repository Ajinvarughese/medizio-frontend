import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Alert,
    TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { icons } from "@/interfaces/constants/icons";
import { mockPredictions } from "@/mock/prediction";
import { Picker } from "@react-native-picker/picker";
import API_URL from "@/utils/api";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { extractFromFile } from "@/utils/predictionHistory";

const { width } = Dimensions.get("window");

type DiseaseKey = "diabetes" | "heart" | "parkinson" | "normal";

export default function PredictDisease() {
    const router = useRouter();

    const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>("diabetes");
    const [file, setFile] = useState<any>(null);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [expanded, setExpanded] = useState(false);

    // ADD this inside your component, after state declarations

    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const renderInput = (label: string, key: string, type: string = "text") => (
        <View style={styles.inputGroup} key={key}>
        <Text style={styles.inputLabel}>{label}</Text>

        {type === "dropdown" ? (
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={formData[key]}
                    onValueChange={(value) => handleInputChange(key, value)}
                    dropdownIconColor="#102A43"
                >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="1" />
                    <Picker.Item label="Female" value="0" />
                </Picker>
            </View>
        ) : (
            <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                placeholder={`Enter ${label}`}
                placeholderTextColor="rgba(16,42,67,0.35)"
                value={formData[key] || ""}
                onChangeText={(text) => handleInputChange(key, text)}
            />
        )}
    </View>
    );

    const renderDiseaseForm = () => {
        switch (selectedDisease) {
            case "diabetes":
                return (
                    <>
                        {renderInput("Pregnancies", "Pregnancies")}
                        {renderInput("Glucose", "Glucose")}
                        {renderInput("Blood Pressure", "BloodPressure")}
                        {renderInput("Skin Thickness", "SkinThickness")}
                        {renderInput("Insulin", "Insulin")}
                        {renderInput("BMI", "BMI")}
                        {renderInput("Diabetes Pedigree Function", "DiabetesPedigreeFunction")}
                        {renderInput("Age", "Age")}
                    </>
                );

            case "heart":
                return (
                    <>
                        {renderInput("Age", "age")}
                        {renderInput("Gender", "sex", "dropdown")}
                        {renderInput("Chest Pain Type", "cp")}
                        {renderInput("Resting BP", "trestbps")}
                        {renderInput("Cholesterol", "chol")}
                        {renderInput("Fasting Blood Sugar", "fbs")}
                        {renderInput("Rest ECG", "restecg")}
                        {renderInput("Max Heart Rate", "thalach")}
                        {renderInput("Exercise Induced Angina", "exang")}
                        {renderInput("Oldpeak", "oldpeak")}
                        {renderInput("Slope", "slope")}
                        {renderInput("CA", "ca")}
                        {renderInput("Thal", "thal")}
                    </>
                );

            case "parkinson":
                return (
                    <>
                        {renderInput("Fo", "fo")}
                        {renderInput("Fhi", "fhi")}
                        {renderInput("Flo", "flo")}
                        {renderInput("Jitter %", "Jitter_percent")}
                        {renderInput("Jitter Abs", "Jitter_Abs")}
                        {renderInput("RAP", "RAP")}
                        {renderInput("PPQ", "PPQ")}
                        {renderInput("DDP", "DDP")}
                        {renderInput("Shimmer", "Shimmer")}
                        {renderInput("Shimmer dB", "Shimmer_dB")}
                        {renderInput("APQ3", "APQ3")}
                        {renderInput("APQ5", "APQ5")}
                        {renderInput("APQ", "APQ")}
                        {renderInput("DDA", "DDA")}
                        {renderInput("NHR", "NHR")}
                        {renderInput("HNR", "HNR")}
                        {renderInput("RPDE", "RPDE")}
                        {renderInput("DFA", "DFA")}
                        {renderInput("Spread1", "spread1")}
                        {renderInput("Spread2", "spread2")}
                        {renderInput("D2", "D2")}
                        {renderInput("PPE", "PPE")}
                    </>
                );

            case "normal":
                return (
                    <Text style={styles.generalText}>
                        General Check selected. Describe your symptoms to AI.
                    </Text>
                );

            default:
                return null;
        }
    };

    const diseaseOptions = useMemo(
        () => [
            { key: "diabetes", title: "Diabetes", desc: "Blood sugar level analysis" },
            { key: "heart", title: "Heart Disease", desc: "ECG analysis" },
            { key: "parkinson", title: "Parkinson's", desc: "Speech analysis" },
            { key: "normal", title: "General Check", desc: "Tell AI your symptoms" },
        ],
        []
    );

    const pickFromGallery = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert("Permission required", "Please allow gallery permission.");
            return;
        }

        const picked = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (picked.canceled) return;

        const asset = picked.assets[0];
        setFile({
            uri: asset.uri,
            name: asset.fileName || "scan.jpg",
            type: "image",
        });
        setResult(null);
    };

    const pickDocument = async () => {
        try {
            const picked = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf"],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (picked.canceled) return;

            const doc = picked.assets[0];

            // Clear previous prediction
            setResult(null);
            setPredicting(true);

            // Save file locally for UI preview
            setFile({
                uri: doc.uri,
                name: doc.name,
                type: doc.mimeType || "application/pdf",
            });

            // Call backend extraction
            const extracted = await extractFromFile(doc, selectedDisease);

            if (!extracted || Object.keys(extracted).length === 0) {
                Alert.alert("Extraction Failed", "No valid medical values found in PDF.");
                return;
            }

            // Clean null values
            const cleanedData: any = {};
            Object.keys(extracted).forEach((key) => {
                cleanedData[key] =
                    extracted[key] !== null && extracted[key] !== undefined
                        ? String(extracted[key])
                        : "";
            });

            setFormData(cleanedData);

            Alert.alert("Success", "Medical values extracted successfully!");

        } catch (error: any) {
            console.error("PDF Extraction Error:", error);
            Alert.alert("Error", "Could not extract values from file.");
        } finally {
            setPredicting(false);
        }
    };
    
    const handlePrediction = async () => {
        const user = await getUser();
        setPredicting(true);
        try {
            const res = await axios.post(`${API_URL}/disease/predict/${selectedDisease}?patientId=${user.id}`, formData); 
            setResult(res.data);
            setFormData({})
        } catch (error) {
            Alert.alert("Couldn't predict", "Something went wrong while prediction");
        } finally {
            setPredicting(false);
        }
        
    }

    const handleSave = async () => {
        setPredicting(true);
        try {
            await axios.post(`${API_URL}/disease`, result); 
            setResult(null);
            setFormData({});
        } catch (error) {
            Alert.alert("Couldn't save", "Something went wrong while saving");
        } finally {
            setPredicting(false);
        }
    }

    const runPrediction = async () => {
        if (!file) {
            Alert.alert("Upload Required", "Please upload scan/report to predict.");
            return;
        }

        setPredicting(true);

        // ✅ MOCK prediction (later replace with API call)
        setTimeout(() => {
            const r = mockPredictions[selectedDisease];
            setResult(r);
            setPredicting(false);
        }, 1200);
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 160 }}>
            {/* Background blobs */}
            <View style={styles.bgBlob1} />
            <View style={styles.bgBlob2} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.logoWrap}>
                        <Image source={icons.logo} style={styles.logo} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>AI Disease Prediction</Text>
                        <Text style={styles.subTitle}>
                            Upload medical scan/report for instant analysis
                        </Text>
                    </View>
                </View>
            </View>

            {/* Disease Selector */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Prediction Type</Text>

                <View style={styles.diseaseGrid}>
                    {diseaseOptions.map((d) => {
                        const active = selectedDisease === d.key;
                        return (
                            <TouchableOpacity
                                key={d.key}
                                style={[styles.diseaseCard, active && styles.diseaseCardActive]}
                                activeOpacity={0.9}
                                onPress={() => {
                                    setSelectedDisease(d.key as DiseaseKey);
                                    setResult(null);
                                }}
                            >
                                <Text style={styles.diseaseTitle}>{d.title}</Text>
                                <Text style={styles.diseaseDesc}>{d.desc}</Text>
                                {active && <Text style={styles.activeTag}>Selected</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {!result && (
                <View>
                    {/* Dynamic Disease Form */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Enter Medical Parameters</Text>

                <View style={styles.formCard}>
                    {renderDiseaseForm()}
                    <TouchableOpacity
                        style={[styles.predictBtn, predicting && { opacity: 0.7 }]}
                        onPress={handlePrediction}
                        disabled={predicting}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.predictText}>
                            {predicting ? "Predicting..." : "Predict Disease"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Upload */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Scan / Report</Text>

                <View style={styles.uploadCard}>
                    {file ? (
                        <View>
                            <Text style={styles.fileName}>📎 {file.name}</Text>

                            {String(file.type).includes("image") && (
                                <Image source={{ uri: file.uri }} style={styles.preview} />
                            )}

                            <View style={styles.uploadActions}>
                                <TouchableOpacity style={styles.ghostBtn} onPress={pickFromGallery}>
                                    <Text style={styles.ghostText}>Change Image</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ghostBtn} onPress={pickDocument}>
                                    <Text style={styles.ghostText}>Change File</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.uploadIcon}>⬆️</Text>
                            <Text style={styles.uploadTitle}>Upload your file</Text>
                            <Text style={styles.uploadHint}>
                                Supported: JPG, PNG, PDF
                            </Text>

                            <View style={styles.uploadActions}>
                                <TouchableOpacity style={styles.ghostBtn} onPress={pickDocument}>
                                    <Text style={styles.ghostText}>Upload PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
                </View>
            )}

            {/* Result */}
            {result && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prediction Result</Text>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>{result.affected ? `Affected with ${result.disease?.toLowerCase()}` : `Not affected with ${result.disease?.toLowerCase()}`}</Text>

                        <View style={styles.resultRow}>
                            <View style={styles.metric}>
                                 <Text style={styles.metricLabel}>You are</Text>
                                <Text style={styles.metricValue}>{(100 - result.confidence).toFixed(2)}%</Text>
                                <Text style={styles.metricLabel}>Healthy</Text>
                            </View>

                            <View
                                style={[
                                    styles.riskBadge,
                                    result.riskClass === "HIGH"
                                        ? styles.riskHigh
                                        : result.riskClass === "RISKY"
                                            ? styles.riskMedium
                                            : styles.riskLow,
                                ]}
                            >
                                <Text style={styles.riskText}>{result.riskClass}</Text>
                            </View>
                        </View>

                        <Text style={styles.recoTitle}>Recommendations</Text>
                        <>
                            <Text
                                style={styles.recoItem}
                                numberOfLines={expanded ? undefined : 3}
                            >
                                {result.aiAnalysis}
                            </Text>

                            {result.aiAnalysis.length > 120 && (
                                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                                <Text style={styles.readMoreText}>
                                    {expanded ? "Read Less ▲" : "Read More ▼"}
                                </Text>
                                </TouchableOpacity>
                            )}
                        </>

                        <TouchableOpacity
                            disabled={predicting}
                            style={styles.bookBtn}
                            onPress={handleSave}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.bookText}>{predicting ? "Saving Result..." : "Save Result"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={predicting}
                            style={styles.bookBtnSecond}
                            onPress={() => {setResult(null); setFile(null)}}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.bookText}>Do not save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5FBFF" },

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

    header: { paddingTop: 60, paddingHorizontal: 18, marginBottom: 12 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },

    logoWrap: {
        width: 54,
        height: 54,
        borderRadius: 20,
        backgroundColor: "rgba(16,42,67,0.08)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    logo: { width: 42, height: 40 },

    title: { color: "#102A43", fontWeight: "900", fontSize: 20 },
    subTitle: {
        marginTop: 4,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "800",
        fontSize: 12,
    },

    section: { marginTop: 18, paddingHorizontal: 18 },
    sectionTitle: { color: "#102A43", fontWeight: "900", fontSize: 16 },

    diseaseGrid: {
        marginTop: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },

    diseaseCard: {
        width: "47.6%",
        borderRadius: 22,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    diseaseCardActive: {
        borderColor: "rgba(55,208,109,0.35)",
        backgroundColor: "rgba(55,208,109,0.14)",
    },

    diseaseTitle: { color: "#102A43", fontWeight: "900" },
    diseaseDesc: {
        marginTop: 6,
        color: "rgba(16,42,67,0.56)",
        fontWeight: "800",
        fontSize: 12,
        lineHeight: 16,
    },
    activeTag: {
        marginTop: 10,
        color: "#0f2f47",
        fontWeight: "900",
        fontSize: 12,
    },

    uploadCard: {
        marginTop: 12,
        borderRadius: 24,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    uploadIcon: { fontSize: 34 },
    uploadTitle: { marginTop: 10, fontWeight: "900", color: "#102A43" },
    uploadHint: { marginTop: 6, fontWeight: "800", color: "rgba(16,42,67,0.55)", fontSize: 12 },

    uploadActions: { marginTop: 14, flexDirection: "row", gap: 10, flexWrap: "wrap" },

    ghostBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: "rgba(16,42,67,0.06)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    ghostText: { fontWeight: "900", color: "#102A43" },

    fileName: { fontWeight: "900", color: "#102A43" },

    preview: {
        marginTop: 12,
        width: "100%",
        height: 200,
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.06)",
    },

    predictBtn: {
        marginTop: 16,
        backgroundColor: "#37d06d",
        paddingVertical: 14,
        borderRadius: 18,
    },
    predictText: { textAlign: "center", fontWeight: "900", color: "#062118" },

    resultCard: {
        marginTop: 12,
        borderRadius: 24,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    resultTitle: { fontWeight: "900", color: "#102A43", fontSize: 16 },

    resultRow: { marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

    metric: {
        backgroundColor: "rgba(70,205,255,0.14)",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 18,
    },
    metricValue: { fontWeight: "900", color: "#0f2f47", fontSize: 18 },
    metricLabel: { marginTop: 4, fontWeight: "900", color: "rgba(15,47,71,0.55)", fontSize: 12 },

    riskBadge: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
    riskHigh: { 
    backgroundColor: "#d65858"   
    },
    riskMedium: { 
    backgroundColor: "#e6ae65"
    },
    riskLow: { 
    backgroundColor: "#3ede79"      
    },
    riskText: { fontWeight: "900", color: "#102A43" },

    recoTitle: { marginTop: 16, fontWeight: "900", color: "#102A43" },
    recoItem: {
        marginTop: 8,
        color: "rgba(16,42,67,0.55)",
        fontWeight: "600",
        fontSize: 13,
        lineHeight: 18,
    },
    readMoreText: {
        marginTop: 6,
        fontWeight: "900",
        color: "#37d06d",
        fontSize: 12,
    },

    bookBtn: {
        marginTop: 16,
        borderRadius: 18,
        paddingVertical: 14,
        backgroundColor: "#37d06d",
    },
    bookBtnSecond: {
        marginTop: 16,
        borderRadius: 18,
        paddingVertical: 14,
        backgroundColor: "#102A43",
        opacity: 0.8
    },
    bookText: { textAlign: "center", fontWeight: "900", color: "#fff" },

    formCard: {
        marginTop: 12,
        borderRadius: 24,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.94)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    inputGroup: {
        marginBottom: 12,
    },

    inputLabel: {
        fontWeight: "900",
        color: "#102A43",
        marginBottom: 6,
        fontSize: 12,
    },

    formInput: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
    },

    generalText: {
        fontWeight: "800",
        color: "rgba(16,42,67,0.75)",
        fontSize: 14,
    },
    pickerWrapper: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
    },
});
