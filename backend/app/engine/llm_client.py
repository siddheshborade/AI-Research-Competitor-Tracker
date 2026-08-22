import json
import re
from typing import Type, TypeVar, Optional, Any, Dict
from pydantic import BaseModel, ValidationError
from app.core.config import settings
from app.core.logging import logger

T = TypeVar("T", bound=BaseModel)


class LLMClient:
    """Resilient LLM client supporting structured Pydantic output, retry limiting, and deterministic fallback."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.max_retries = 2

    def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
        fallback_factory: Optional[callable] = None,
        system_prompt: Optional[str] = None
    ) -> T:
        """Attempts to generate structured output conforming to response_model, with retry and fallback."""
        
        # If no real API key is configured or in mock/test mode, use the deterministic fallback directly
        if not self.api_key or self.api_key in ["test_llm_key", "your_llm_api_key_here", ""]:
            if fallback_factory:
                return fallback_factory()
            return self._build_default_instance(response_model)

        # In production with an active key, try LLM call with retry
        for attempt in range(1, self.max_retries + 1):
            try:
                raw_response = self._call_llm(prompt, system_prompt)
                parsed_json = self._extract_json(raw_response)
                validated_obj = response_model.model_validate(parsed_json)
                return validated_obj
            except (ValidationError, json.JSONDecodeError, Exception) as e:
                logger.warning(f"LLM structured generation attempt {attempt}/{self.max_retries} failed: {e}")
                if attempt == self.max_retries:
                    if fallback_factory:
                        logger.info("Executing safe deterministic fallback for structured output.")
                        return fallback_factory()
                    return self._build_default_instance(response_model)

        if fallback_factory:
            return fallback_factory()
        return self._build_default_instance(response_model)

    def _call_llm(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Simulates or connects to standard LLM API."""
        # When integration with live Gemini/OpenAI API is enabled, HTTP client call goes here.
        # Otherwise raises an exception to trigger the safe deterministic engine.
        raise RuntimeError("LLM API endpoint not connected in this execution environment.")

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extracts JSON object from text that may contain markdown fences."""
        match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
        if match:
            text = match.group(1)
        else:
            match_brace = re.search(r"\{.*\}", text, re.DOTALL)
            if match_brace:
                text = match_brace.group(0)
        return json.loads(text.strip())

    def _build_default_instance(self, model_cls: Type[T]) -> T:
        """Constructs a basic valid instance of a Pydantic model if possible."""
        try:
            return model_cls()
        except Exception:
            # Construct with empty dict
            return model_cls.model_validate({})


llm_client = LLMClient()
