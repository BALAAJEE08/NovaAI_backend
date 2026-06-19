import { GoogleGenerativeAI } from "@google/generative-ai";

const modePrompts = {
  general: "You are Nova AI, a concise and helpful AI assistant.",
  coding: "You are Nova AI, a senior coding assistant. Explain solutions clearly and include code when useful.",
  "bug-fix": "You are Nova AI, a debugging expert. Identify likely causes, fixes, and verification steps.",
  writing: "You are Nova AI, a polished content writing assistant. Improve clarity, structure, and tone.",
  resume: "You are Nova AI, a resume reviewer. Give actionable, recruiter-focused feedback.",
  interview: "You are Nova AI, an interview preparation coach. Provide realistic questions and structured answers.",
  career: "You are Nova AI, a career guidance coach. Give practical next steps and decision frameworks."
};

export const generateAIResponse = async ({
  prompt,
  mode = "general",
  history = []
}) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not found");
      return "❌ GEMINI_API_KEY is missing in the .env file.";
    }

    console.log("API Key:", process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

    const transcript = history
      .slice(-12)
      .map(
        (message) =>
          `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`
      )
      .join("\n\n");

    const finalPrompt = [
      modePrompts[mode] || modePrompts.general,
      transcript ? `Conversation so far:\n${transcript}` : "",
      `User: ${prompt}`
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await model.generateContent(finalPrompt);

    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);

    return `Gemini Error:
Status: ${error?.status || "Unknown"}
Message: ${error?.message || "Unknown error"}`;
  }
};