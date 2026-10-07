import requests

from backend.core.config import settings


GOOGLE_TRANSLATE_URL = (
    "https://translation.googleapis.com/language/translate/v2"
)


def translate_text(
    text: str,
    source_language: str,
    target_language: str,
) -> str:
    if source_language == target_language:
        return text

    api_key = settings.TRANSLATION_API_KEY.strip()

    if not api_key:
        raise RuntimeError(
            "Translation service is not configured. "
            "Set TRANSLATION_API_KEY in backend/.env."
        )

    response = requests.post(
        GOOGLE_TRANSLATE_URL,
        headers={
            "X-goog-api-key": api_key,
            "Content-Type": "application/json",
        },
        json={
            "q": text,
            "source": source_language,
            "target": target_language,
            "format": "text",
        },
        timeout=15,
    )

    if not response.ok:
        try:
            error_data = response.json()
            error_message = error_data.get("error", {}).get(
                "message",
                f"HTTP {response.status_code}",
            )
        except (ValueError, AttributeError):
            error_message = f"HTTP {response.status_code}"

        raise RuntimeError(
            f"Translation service error: {error_message}"
        )

    data = response.json()

    try:
        return data["data"]["translations"][0]["translatedText"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError(
            "Translation service returned an invalid response."
        ) from exc