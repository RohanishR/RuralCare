from backend.schemas.symptom import SymptomAnalysis


def analyze_symptoms(symptoms: str) -> SymptomAnalysis:
    text = symptoms.lower()

    possible_conditions = []
    urgency = "low"
    recommendation = (
        "Monitor your symptoms and consult a healthcare professional "
        "if they persist or become worse."
    )
    warning_signs = [
        "Severe or rapidly worsening symptoms",
        "Difficulty breathing",
        "Loss of consciousness",
        "Severe chest pain",
    ]

    if "chest pain" in text or "chest pressure" in text:
        urgency = "emergency"
        possible_conditions = [
            "Chest pain can have several causes, including potentially serious conditions."
        ]
        recommendation = (
            "Seek emergency medical care immediately, especially if the pain is "
            "severe or associated with breathing difficulty, sweating, dizziness, "
            "or pain spreading to the arm, jaw, or back."
        )

    elif "difficulty breathing" in text or "shortness of breath" in text:
        urgency = "emergency"
        possible_conditions = [
            "Breathing difficulty can have several causes and may require urgent evaluation."
        ]
        recommendation = (
            "Seek emergency medical care immediately if you are having significant "
            "difficulty breathing."
        )

    elif "fever" in text and (
        "cough" in text or "cold" in text or "sore throat" in text
    ):
        urgency = "medium"
        possible_conditions = [
            "Viral respiratory infection",
            "Influenza-like illness",
        ]
        recommendation = (
            "Rest, stay hydrated, monitor your temperature, and consult a doctor "
            "if symptoms become severe or persist."
        )

    elif "headache" in text:
        urgency = "medium"
        possible_conditions = [
            "Tension headache",
            "Migraine",
            "Dehydration-related headache",
        ]
        recommendation = (
            "Stay hydrated, rest in a quiet environment, and consult a healthcare "
            "professional if the headache is severe, unusual, persistent, or recurrent."
        )

    elif "stomach pain" in text or "abdominal pain" in text:
        urgency = "medium"
        possible_conditions = [
            "Digestive disturbance",
            "Gastritis",
            "Other gastrointestinal conditions",
        ]
        recommendation = (
            "Monitor the symptoms and consult a healthcare professional if the pain "
            "is severe, persistent, or associated with vomiting, bleeding, or fever."
        )

    else:
        possible_conditions = [
            "The symptoms may have several possible causes."
        ]

    return SymptomAnalysis(
        possible_conditions=possible_conditions,
        urgency=urgency,
        recommendation=recommendation,
        warning_signs=warning_signs,
    )