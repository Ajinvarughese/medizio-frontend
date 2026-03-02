import { getUser, logout } from "@/utils/auth";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function DoctorLayout() {
    const router = useRouter();

    const checkUser = async () => {
      try {
        const res = await getUser();
        if(res.role !== "doctor") {
            await logout();    
            router.push("/(auth)/welcome");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error?.response?.status === 403) {
            router.push("/(doctor)/verifying");
            return;
          } else if (error?.response?.status === 423) {
            router.push("/(auth)/suspended");
            return;
          }
        }
        router.push("/");
      }
    };

    useEffect(() => {
      checkUser();
    }, []);
    
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="availability" />
        </Stack>
    );
}
