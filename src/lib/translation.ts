import Cookies from "js-cookie";

export type SupportedLanguage = "en" | "hi" | "ta";

export interface TranslationResponse {
  original_text: string;
  translated_text: string;
  source_language: SupportedLanguage;
  target_language: SupportedLanguage;
  is_translated: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export async function translateText(
  text: string,
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage,
): Promise<TranslationResponse> {
  const token = Cookies.get("access_token");

  const response = await fetch(`${API_URL}/translation/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: JSON.stringify({
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    }),
  });

  if (!response.ok) {
    let message = "Translation failed.";

    try {
      const data = await response.json();

      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return response.json();
}