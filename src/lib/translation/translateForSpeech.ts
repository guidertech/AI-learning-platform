import type {AISpeechLanguage} from "@/hooks/useAISpeechLanguage";

export async function translateForSpeech(
  text: string,
  language: AISpeechLanguage,
): Promise<string> {
  if (language === "en" || !window.Translator) return text;

  try {
    const availability = await window.Translator.availability({
      sourceLanguage: "en",
      targetLanguage: language,
    });
    if (availability === "unavailable") return text;

    const translator = await window.Translator.create({
      sourceLanguage: "en",
      targetLanguage: language,
    });
    try {
      return await translator.translate(text);
    } finally {
      translator.destroy?.();
    }
  } catch {
    return text;
  }
}
