"use client";

import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface SymptomAnalysis {
  discussion_points: string[];
  urgency: "low" | "medium" | "high" | "emergency";
  recommendation: string;
  warning_signs: string[];
}

interface SymptomResponse {
  symptoms: string;
  language: string;
  analysis: SymptomAnalysis;
}

export default function SymptomAssistantPage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<SymptomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSymptoms = async (e: FormEvent) => {
    e.preventDefault();

    if (symptoms.trim().length < 3) {
      setError("Please describe your symptoms.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await apiClient.post<SymptomResponse>(
        "/symptoms/analyze",
        {
          symptoms: symptoms.trim(),
          language: "en",
        }
      );

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze symptoms."
      );
    } finally {
      setLoading(false);
    }
  };

  const urgencyClass = (urgency: SymptomAnalysis["urgency"]) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Symptom Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Describe your symptoms to prepare non-diagnostic discussion points for a clinician.
          </p>
        </div>

        <form
          onSubmit={analyzeSymptoms}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <label
            htmlFor="symptoms"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Describe your symptoms
          </label>

          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: I have fever, cough and sore throat for two days..."
            rows={6}
            maxLength={2000}
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-2 text-right text-xs text-gray-500">
            {symptoms.length}/2000
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Symptoms"}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-5">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Symptom summary
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${urgencyClass(
                    result.analysis.urgency
                  )}`}
                >
                  {result.analysis.urgency}
                </span>
              </div>

              <h3 className="mb-2 font-medium text-gray-800">
                Discussion points for your clinician
              </h3>

              <ul className="list-disc space-y-1 pl-5 text-gray-600">
                {result.analysis.discussion_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Recommendation
              </h2>

              <p className="leading-7 text-gray-600">
                {result.analysis.recommendation}
              </p>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Warning Signs
              </h2>

              <ul className="list-disc space-y-2 pl-5 text-gray-600">
                {result.analysis.warning_signs.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </section>

            <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              This assessment is for informational purposes and does not
              replace professional medical advice.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
