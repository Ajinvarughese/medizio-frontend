import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "NUVICA_PREDICTION_HISTORY";

export async function getPredictionHistory() {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function savePredictionResult(data: any) {
    const all = await getPredictionHistory();
    const next = [
        ...all,
        {
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            ...data,
        },
    ];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
}

export async function clearPredictionHistory() {
    await AsyncStorage.removeItem(KEY);
}
