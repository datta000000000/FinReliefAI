from google import genai
from app.core.config import settings

class GeminiClient:
    _client = None
    _selected_model = None

    @classmethod
    def get_client(cls):
        """Get or initialize the Google GenAI client."""
        if cls._client is None:
            if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
                cls._client = genai.Client(api_key=settings.GEMINI_API_KEY)
            else:
                raise ValueError("GEMINI_API_KEY environment variable is not configured.")
        return cls._client

    @classmethod
    def generate_text(cls, prompt: str) -> str:
        """
        Generates text using the first available working Gemini model from the prioritised list.
        If the cached model fails, resets and re-tests models in order.
        """
        client = cls.get_client()
        models_to_try = [
            "gemini-flash-latest",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-2.0-flash",
            "gemini-2.5-flash"
        ]

        # 1. Try generating with previously cached model if available
        if cls._selected_model:
            try:
                response = client.models.generate_content(
                    model=cls._selected_model,
                    contents=prompt,
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                print(f"[GeminiClient] Cached model {cls._selected_model} failed: {e}. Rechecking model pool...")
                cls._selected_model = None

        # 2. Loop over candidate models until one succeeds
        last_error = None
        for model in models_to_try:
            try:
                print(f"[GeminiClient] Attempting text generation with model: {model}...")
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
                if response and response.text:
                    cls._selected_model = model
                    print(f"[GeminiClient] Successfully selected and cached working model: {model}")
                    return response.text
            except Exception as e:
                print(f"[GeminiClient] Model {model} failed: {e}. Trying next...")
                last_error = e

        raise RuntimeError(f"All candidate Gemini models failed to generate content. Last error: {last_error}")
