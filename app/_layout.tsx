import 'react-native-gesture-handler'; // MUST be first import

import React from "react";
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews",
    ]);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar hidden />
            <Stack screenOptions={{ headerShown: false }}>
                {/* Public landing */}
                <Stack.Screen name="index" />

                {/* Auth flow */}
                <Stack.Screen name="(auth)" />

                {/* Doctor App */}
                <Stack.Screen name="(doctor)" />

                {/* Admin App */}
                <Stack.Screen name="(admin)" />
            </Stack>
        </GestureHandlerRootView>
    );
}
