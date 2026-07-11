import google.generativeai as genai
from app.core.config import settings

class GeminiClient:
    _configured = False

    @classmethod
    def configure(cls):
        """Configure the genai client with the API key from settings."""
        if not cls._configured:
            if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
                genai.configure(api_key=settings.GEMINI_API_KEY)
                cls._configured = True
            else:
                raise ValueError("GEMINI_API_KEY environment variable is not configured.")

    @staticmethod
    def generate_text(prompt: str) -> str:
        """
        Generates text using the 'gemini-1.5-flash' model.
        Raises an exception if the API key is missing or call fails.
        """
        GeminiClient.configure()
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        if not response or not response.text:
            raise RuntimeError("Gemini returned an empty response.")
        return response.text
