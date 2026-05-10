// groqService.js — all Groq API calls in one place
// Uses llama-3.3-70b-versatile via Groq

const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// Store the key in env: VITE_GROQ_API_KEY
function getKey() {
    return import.meta.env.VITE_GROQ_API_KEY || "";
}

export async function groqChat(messages, systemPrompt, { temperature = 0.7, maxTokens = 1024 } = {}) {
    const key = getKey();
    if (!key) throw new Error("VITE_GROQ_API_KEY not set");

    const body = {
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
    };

    const res = await fetch(GROQ_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
}