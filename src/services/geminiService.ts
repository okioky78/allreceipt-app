import { GoogleGenAI, Type } from "@google/genai";

export interface ReceiptData {
  date: string;
  place: string;
  amount: number;
}

export class ApiKeyMissingError extends Error {
  constructor() {
    super("GEMINI_API_KEY가 설정되지 않았습니다.");
    this.name = "ApiKeyMissingError";
  }
}

export async function extractReceiptData(base64Image: string): Promise<ReceiptData | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ApiKeyMissingError();
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
          {
            text: "Extract the following information from this receipt: date (YYYY-MM-DD), place (store name), and total amount (number only). Return as JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
            place: { type: Type.STRING, description: "Name of the business or store" },
            amount: { type: Type.NUMBER, description: "Total amount spent" },
          },
          required: ["date", "place", "amount"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ReceiptData;
  } catch (error) {
    if (error instanceof ApiKeyMissingError) throw error;
    console.error("Gemini API 호출 오류:", error);
    return null;
  }
}
