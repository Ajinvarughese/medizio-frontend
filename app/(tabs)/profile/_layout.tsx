import { getUser, logout } from "@/utils/auth";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ProfileLayout() {
    const router = useRouter();
    const checkUser = async () => {
      try {
        const res = await getUser();
        if (res.role !== "patient") {
          await logout();
          router.push("/(auth)/welcome");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error?.response?.status === 423) {
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
        <Stack
            initialRouteName="index"   // 🔥 THIS FIXES IT
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
