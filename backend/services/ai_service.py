from backend.schemas.symptom import SymptomAnalysis


def analyze_symptoms(symptoms: str) -> SymptomAnalysis:
    text = symptoms.lower()

    discussion_points = []
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
        discussion_points = [
            "Chest pain and associated symptoms should be discussed with an emergency clinician immediately."
        ]
        recommendation = (
            "Seek emergency medical care immediately, especially if the pain is "
            "severe or associated with breathing difficulty, sweating, dizziness, "
            "or pain spreading to the arm, jaw, or back."
        )

    elif "difficulty breathing" in text or "shortness of breath" in text:
        urgency = "emergency"
        discussion_points = [
            "Breathing difficulty should be assessed urgently by a clinician."
        ]
        recommendation = (
            "Seek emergency medical care immediately if you are having significant "
            "difficulty breathing."
        )

    elif "fever" in text and (
        "cough" in text or "cold" in text or "sore throat" in text
    ):
        urgency = "medium"
        discussion_points = [
            "Fever with respiratory symptoms, duration, temperature, and hydration status.",
            "Any worsening breathing symptoms or inability to drink fluids.",
        ]
        recommendation = (
            "Rest, stay hydrated, monitor your temperature, and consult a doctor "
            "if symptoms become severe or persist."
        )

    elif "headache" in text:
        urgency = "medium"
        discussion_points = [
            "Headache timing, severity, triggers, and whether it is new or unusual.",
            "Any associated vision, weakness, fever, or neck-stiffness symptoms.",
        ]
        recommendation = (
            "Stay hydrated, rest in a quiet environment, and consult a healthcare "
            "professional if the headache is severe, unusual, persistent, or recurrent."
        )

    elif "stomach pain" in text or "abdominal pain" in text:
        urgency = "medium"
        discussion_points = [
            "Abdominal pain location, duration, food intake, and associated symptoms.",
            "Any vomiting, bleeding, fever, or worsening pain.",
        ]
        recommendation = (
            "Monitor the symptoms and consult a healthcare professional if the pain "
            "is severe, persistent, or associated with vomiting, bleeding, or fever."
        )

    else:
        discussion_points = [
            "Symptom onset, duration, severity, and anything that makes symptoms better or worse."
        ]

    return SymptomAnalysis(
        discussion_points=discussion_points,
        urgency=urgency,
        recommendation=recommendation,
        warning_signs=warning_signs,
    )
