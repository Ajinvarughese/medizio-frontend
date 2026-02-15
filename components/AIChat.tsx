import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from "react-native";

import { askGPT } from "@/utils/gpt";

type Msg = {
    id: string;
    role: "user" | "assistant";
    text: string;
};

export default function AIChat() {
    const [messages, setMessages] = useState<Msg[]>([
        {
            id: "1",
            role: "assistant",
            text:
                "Hi 👋 I'm your AI Medical Assistant. Tell me your symptoms or upload reports and I can guide you.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const listRef = useRef<FlatList>(null);

    // typing animation dots
    const dot1 = useRef(new Animated.Value(0.2)).current;
    const dot2 = useRef(new Animated.Value(0.2)).current;
    const dot3 = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        if (!loading) return;

        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(dot1, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot1, { toValue: 0.2, duration: 250, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 0.2, duration: 250, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 0.2, duration: 250, useNativeDriver: true }),
            ])
        );

        anim.start();
        return () => anim.stop();
    }, [loading]);

    const scrollToBottom = () => {
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");

        const userMsg: Msg = {
            id: Date.now().toString(),
            role: "user",
            text: userText,
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const reply = await askGPT(userText);

            const botMsg: Msg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                text: reply,
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    role: "assistant",
                    text: "⚠️ Unable to connect to AI. Please try again later.",
                },
            ]);
        }

        setLoading(false);
    };

    const renderMsg = ({ item }: { item: Msg }) => {
        const isUser = item.role === "user";

        return (
            <View
                style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                    { alignSelf: isUser ? "flex-end" : "flex-start" },
                ]}
            >
                <Text style={[styles.msgText, isUser ? styles.userText : styles.aiText]}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.root}>
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMsg}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />

                {/* Typing Animation */}
                {loading && (
                    <View style={styles.typingBox}>
                        <Text style={styles.typingText}>AI is typing</Text>

                        <View style={styles.dotsRow}>
                            <Animated.View style={[styles.dot, { opacity: dot1 }]} />
                            <Animated.View style={[styles.dot, { opacity: dot2 }]} />
                            <Animated.View style={[styles.dot, { opacity: dot3 }]} />
                        </View>
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputWrap}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask AI about symptoms..."
                        placeholderTextColor="#7f9f94"
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        {loading ? (
                            <ActivityIndicator color="#061014" />
                        ) : (
                            <Text style={styles.sendText}>➤</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        marginTop: 10,
    },

    bubble: {
        maxWidth: "82%",
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
    },

    userBubble: {
        backgroundColor: "#00d48a",
        borderTopRightRadius: 6,
    },
    aiBubble: {
        backgroundColor: "rgba(255,255,255,0.06)",
        borderTopLeftRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    msgText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "700",
    },
    userText: {
        color: "#061014",
    },
    aiText: {
        color: "#e5fff6",
    },

    typingBox: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    typingText: {
        color: "#cfe3dc",
        fontWeight: "800",
        fontSize: 12,
        marginBottom: 6,
    },

    dotsRow: { flexDirection: "row", gap: 6 },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#00d48a",
    },

    inputWrap: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "#071013",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.05)",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    input: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        color: "#fff",
        fontWeight: "700",
    },

    sendBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#00d48a",
        alignItems: "center",
        justifyContent: "center",
    },

    sendText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#061014",
    },
});
