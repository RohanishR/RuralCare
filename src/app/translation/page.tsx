"use client";

import { useState } from "react";
import {
  translateText,
  SupportedLanguage,
} from "@/lib/translation";

const languages: {
  code: SupportedLanguage;
  name: string;
}[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
];

export default function TranslationPage() {
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] =
    useState<SupportedLanguage>("en");
  const [targetLanguage, setTargetLanguage] =
    useState<SupportedLanguage>("hi");

  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter some text to translate.");
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setTranslatedText(text);
      setError("");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setTranslatedText("");

      const result = await translateText(
        text.trim(),
        sourceLanguage,
        targetLanguage,
      );

      setTranslatedText(result.translated_text);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Translation failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === targetLanguage) {
      return;
    }

    const oldSource = sourceLanguage;

    setSourceLanguage(targetLanguage);
    setTargetLanguage(oldSource);

    if (translatedText) {
      setText(translatedText);
      setTranslatedText(text);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            RuralCare
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Language Translation
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Translate healthcare-related messages between English,
            Hindi, and Tamil.
          </p>
        </div>

        {/* Translation Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* Language Selection */}
          <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <label
                htmlFor="source-language"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                From
              </label>

              <select
                id="source-language"
                value={sourceLanguage}
                onChange={(e) =>
                  setSourceLanguage(
                    e.target.value as SupportedLanguage,
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {languages.map((language) => (
                  <option
                    key={language.code}
                    value={language.code}
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwapLanguages}
              className="hidden rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:block"
              aria-label="Swap languages"
            >
              ⇄
            </button>

            <div>
              <label
                htmlFor="target-language"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                To
              </label>

              <select
                id="target-language"
                value={targetLanguage}
                onChange={(e) =>
                  setTargetLanguage(
                    e.target.value as SupportedLanguage,
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {languages.map((language) => (
                  <option
                    key={language.code}
                    value={language.code}
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input */}
          <div className="mb-5">
            <label
              htmlFor="translation-text"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Text to translate
            </label>

            <textarea
              id="translation-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a message, symptom, appointment question, or other healthcare text..."
              rows={7}
              maxLength={5000}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {text.length}/5000
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Translate Button */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>

          {/* Result */}
          {translatedText && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Translation
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Machine translated
                </span>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {translatedText}
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Translation is provided for communication assistance and
          may not be medically exact. Do not rely on translated text
          alone for emergency medical decisions.
        </p>
      </div>
    </main>
  );
}