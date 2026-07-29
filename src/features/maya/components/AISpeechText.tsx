"use client";

import { useEffect, useState } from "react";
import { useAISpeechLanguage } from "@/hooks/useAISpeechLanguage";
import { translateForSpeech } from "@/features/language";

export default function AISpeechText({ text }: { text: string }) {
  const { language } = useAISpeechLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    let active = true;
    void translateForSpeech(text, language).then((result) => {
      if (active) setTranslatedText(result);
    });
    return () => {
      active = false;
    };
  }, [language, text]);

  return <span data-no-translate>{translatedText}</span>;
}
