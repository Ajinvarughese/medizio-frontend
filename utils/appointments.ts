import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "appointments";

export const saveAppointment = async (appointment: any) => {
    const prev = await getAppointments();
    const payload = [
        ...prev,
        { id: Date.now().toString(), createdAt: new Date().toISOString(), ...appointment },
    ];
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
};

export const getAppointments = async () => {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
};

export const deleteAppointment = async (id: string) => {
    const prev = await getAppointments();
    const next = prev.filter((a: any) => a.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
};
