def classify_intent(text: str) -> str:
    text_lower = text.lower()
    if "refund" in text_lower:
        return "billing_refund"
    elif "install" in text_lower or "setup" in text_lower:
        return "technical_install"
    elif "help" in text_lower:
        return "general_help"
    else:
        return "unknown"
