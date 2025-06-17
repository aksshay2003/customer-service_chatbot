import asyncio

async def generate_response(user_text: str, intent: str) -> str:
    # Stub: Replace with Google Gemini API call later
    # For now, basic canned responses by intent
    if intent == "billing_refund":
        return "I see you have a refund question. Can you provide your order number?"
    elif intent == "technical_install":
        return "Installation issues? Please describe the problem or error code."
    elif intent == "general_help":
        return "I'm here to help! Please tell me your issue."
    else:
        return "I'm sorry, I didn't understand that. Could you please rephrase?"
