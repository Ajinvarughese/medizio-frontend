import axios from "axios";

/**
 * Call OpenAI Chat Completion API
 * @param prompt user message
 */
export async function askGPT(prompt: string) {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing EXPO_PUBLIC_OPENAI_API_KEY in .env file"
        );
    }

    const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a medical assistant for an AI hospital app. Give safe, helpful responses. If the user describes serious symptoms, advise them to consult a doctor immediately.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        }
    );

    return res.data.choices[0].message.content;
}
