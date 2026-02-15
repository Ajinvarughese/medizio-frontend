export const mockPredictions = {
    pneumonia: {
        label: "Pneumonia Detected",
        confidence: 92,
        risk: "High",
        tips: [
            "Consult pulmonologist immediately",
            "Start antibiotics only after doctor's confirmation",
            "Drink warm fluids and take rest",
        ],
    },
    tb: {
        label: "Tuberculosis Suspected",
        confidence: 78,
        risk: "Medium",
        tips: [
            "Take sputum test for confirmation",
            "Avoid close contact until diagnosis is confirmed",
            "Book an appointment with chest specialist",
        ],
    },
    brainTumor: {
        label: "Tumor-like Pattern Found",
        confidence: 84,
        risk: "High",
        tips: [
            "Book MRI review with neuro specialist",
            "Avoid self diagnosis; need radiologist confirmation",
            "Immediate consultation recommended",
        ],
    },
    normal: {
        label: "No Critical Disease Detected",
        confidence: 88,
        risk: "Low",
        tips: [
            "Maintain healthy lifestyle",
            "Follow-up checkup if symptoms persist",
            "Track vitals regularly",
        ],
    },
};
