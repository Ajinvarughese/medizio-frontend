import { Tabs } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { icons } from "@/interfaces/constants/icons";

const ACTIVE = "#37d06d";
const INACTIVE = "rgba(16,42,67,0.45)";
const BG = "rgba(255,255,255,0.92)";

type IconProps = {
    focused: boolean;
    icon: any;
    label: string;
};

function TabIcon({ focused, icon, label }: IconProps) {
    return (
        <View style={styles.iconWrapper}>
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Image
                    source={icon}
                    style={[styles.icon, { tintColor: focused ? "#0f2f47" : INACTIVE }]}
                />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
}

export default function DoctorTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home} label="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="appointment"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.appointment} label="Schedule" />
                    ),
                }}
            />

            <Tabs.Screen
                name="patients"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.user || icons.lungs} label="patients" />
                    ),
                }}
            />

            <Tabs.Screen
                name="reports"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.calendar || icons.doctorr} label="reports" />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        height: 74,
        paddingTop: 10,
        paddingBottom: 12,
        borderRadius: 26,
        backgroundColor: BG,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 18,
        elevation: 10,
    },

    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        width: 74,
    },

    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    iconBoxActive: {
        backgroundColor: "rgba(55,208,109,0.18)",
        borderWidth: 1,
        borderColor: "rgba(55,208,109,0.35)",
        transform: [{ translateY: -2 }],
    },

    icon: {
        width: 22,
        height: 22,
    },

    label: {
        marginTop: 6,
        fontSize: 11,
        fontWeight: "800",
        color: INACTIVE,
    },

    labelActive: {
        color: "#0f2f47",
    },
});
