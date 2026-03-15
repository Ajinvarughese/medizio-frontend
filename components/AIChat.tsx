import { getUser } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Platform,
  Image,
  Text,
} from "react-native";
import Markdown from "react-native-markdown-display";
import * as DocumentPicker from "expo-document-picker";

import {
  deleteChatLog,
  generateAiResponse,
  getChatLog,
} from "@/utils/aiChatApi";
import { Alert } from "react-native";
import Delete from "../assets/icons/delete.png";
import Logo from "../assets/icons/logo.png";

export type Message = {
  id?: number;
  text: string;
  textFrom: "USER" | "ASSISTANT";
  userId: number;
};

/* ---------------- CLEAN TEXT ---------------- */

const cleanAIText = (text: string) => {
  if (!text) return "";

  return text
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .trim();
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [file, setFile] = useState<any>(null);

  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const doc = result.assets[0];

    setFile({
      uri: doc.uri,
      name: doc.name,
      type: "application/pdf",
    });
  };

  /* ---------------- DELETE CHAT ---------------- */

  const handleDeleteChat = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "This will permanently delete your chat history."
      );

      if (confirmed) {
        deleteChatLog();
        setMessages([]);
      }
      return;
    }

    Alert.alert(
      "Clear chat?",
      "This will permanently delete your chat history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteChatLog();
            setMessages([]);
          },
        },
      ]
    );
  };

  /* ---------------- LOAD CHAT HISTORY ---------------- */

  const handleChatLog = async () => {
    const logs = await getChatLog();

    if (!logs) return;

    const cleaned = logs.map((m: Message) => ({
      ...m,
      text: cleanAIText(m.text),
    }));

    setMessages(cleaned);
  };

  useEffect(() => {
    handleChatLog();
  }, []);

  /* ---------------- TYPING DOTS ANIMATION ---------------- */

  useEffect(() => {
    if (!isTyping) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [isTyping]);

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const user = await getUser();

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      textFrom: "USER",
      userId: user!.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await generateAiResponse(userMsg.text, file);

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: cleanAIText(res.text),
        textFrom: "ASSISTANT",
        userId: userMsg.userId,
      };

      setMessages((prev) => [...prev, aiMsg]);

      setFile(null);
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.aiIcon} />
          <Text style={styles.aiName}>Medizio AI</Text>
        </View>

        <TouchableOpacity onPress={handleDeleteChat} style={styles.deleteBtn}>
          <View style={styles.deleteRow}>
            <Image source={Delete} style={styles.deleteIcon} />
            <Text style={styles.deleteText}>Delete Chat</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CHAT LIST */}

      {messages.length === 0 ? (
        <EmptyChat onSuggestion={(text) => setInput(text)} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.textFrom === "USER" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Markdown
                style={{
                  body:
                    item.textFrom === "USER" ? styles.userText : styles.aiText,
                  strong: { fontWeight: "700" },
                  bullet_list: { marginVertical: 6 },
                  paragraph: { marginBottom: 6 },
                }}
              >
                {cleanAIText(item.text)}
              </Markdown>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.bubble, styles.aiBubble]}>
                <TypingDots anim={dotAnim} />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 14 }}
        />
      )}

      {/* INPUT */}
      {file && (
        <View style={styles.filePreview}>
          <Text style={{ color: "#fff" }}>📄 {file.name}</Text>
          <TouchableOpacity onPress={() => setFile(null)}>
            <Image source={Delete} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputBox}>
        <TouchableOpacity onPress={pickDocument} style={styles.attachBtn}>
          <Text style={{ fontSize: 18 }}>📎</Text>
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your health..."
          placeholderTextColor="#9aa8a6"
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, isTyping && { opacity: 0.6 }]}
          onPress={sendMessage}
          disabled={isTyping}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyChat({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  const suggestions = [
    "Explain my blood test results",
    "What are symptoms of diabetes?",
    "How can I improve my heart health?",
    "What does high glucose mean?",
  ];

  return (
    <View style={styles.emptyContainer}>
      <Image source={Logo} style={styles.emptyLogo} />

      <Text style={styles.emptyTitle}>Medizio AI</Text>
      <Text style={styles.emptySubtitle}>
        Ask me about your health, lab reports, or symptoms.
      </Text>

      <View style={styles.suggestionWrap}>
        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionChip}
            onPress={() => onSuggestion(s)}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/* ---------------- TYPING DOTS ---------------- */

function TypingDots({ anim }: { anim: Animated.Value }) {
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.Text style={[styles.typingText, { opacity }]}>
      ● ● ●
    </Animated.Text>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  emptyLogo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 14,
    opacity: 0.9,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#eafff6",
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    maxWidth: 260,
  },

  suggestionWrap: {
    marginTop: 22,
    width: "100%",
    gap: 10,
  },

  suggestionChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  suggestionText: {
    color: "#eafff6",
    fontSize: 13,
    fontWeight: "600",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    padding: 12,
    marginBottom: 80,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 10,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  aiIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  aiName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e6fff6",
  },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,0,0,0.22)",
  },

  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  deleteIcon: {
    width: 16,
    height: 16,
  },

  deleteText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },

  bubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
  },

  aiBubble: {
    backgroundColor: "rgba(0,212,138,0.28)",
    alignSelf: "flex-start",
    borderTopLeftRadius: 6,
  },

  userBubble: {
    backgroundColor: "rgba(255,255,255,0.14)",
    alignSelf: "flex-end",
    borderTopRightRadius: 6,
  },

  aiText: {
    color: "#eafff6",
    fontSize: 15,
    lineHeight: 22,
  },

  userText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },

  typingText: {
    color: "#d5efe6",
    fontSize: 18,
    letterSpacing: 3,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 18,
    marginTop: 8,
  },

  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 34,
  },

  sendBtn: {
    backgroundColor: "#00d48a",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginLeft: 8,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#04211b",
  },
  attachBtn: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },

  filePreview: {
    padding: 8,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
  },
});
