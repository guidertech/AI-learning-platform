"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SOURCE_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "classorbit-language";
const RTL_LANGUAGES = new Set(["ar", "dv", "fa", "he", "ku", "ps", "ur"]);

export type TranslationAvailability =
  | "checking"
  | BrowserTranslatorAvailability;

type LanguageContextValue = {
  language: string;
  selection: "auto" | string;
  detectedLanguages: readonly string[];
  availability: TranslationAvailability;
  setLanguage: (language: string) => void;
  selectDetectedLanguage: () => void;
  translate: (text: string, signal?: AbortSignal) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeLanguage(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase().split("-")[0];
  return normalized && /^[a-z]{2,3}$/.test(normalized)
    ? normalized
    : SOURCE_LANGUAGE;
}

function getBrowserLanguages(): string[] {
  if (typeof navigator === "undefined") return [SOURCE_LANGUAGE];
  const candidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
  ];
  const languages = candidates.map(normalizeLanguage);
  return [...new Set(languages.length ? languages : [SOURCE_LANGUAGE])];
}

function getInitialLanguage(): string {
  if (typeof window === "undefined") return SOURCE_LANGUAGE;
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored ? normalizeLanguage(stored) : getBrowserLanguages()[0];
  } catch {
    return getBrowserLanguages()[0];
  }
}

function getInitialSelection(): "auto" | string {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored ? normalizeLanguage(stored) : "auto";
  } catch {
    return "auto";
  }
}

export function LanguageProvider({children}: {children: ReactNode}) {
  const [detectedLanguages] = useState<readonly string[]>(getBrowserLanguages);
  const [language, setCurrentLanguage] = useState(getInitialLanguage);
  const [selection, setSelection] = useState<"auto" | string>(getInitialSelection);
  const [availability, setAvailability] =
    useState<TranslationAvailability>(() =>
      getInitialLanguage() === SOURCE_LANGUAGE ? "available" : "checking",
    );
  const translatorRef = useRef<BrowserTranslatorSession | null>(null);
  const translatorLanguageRef = useRef<string | null>(null);
  const cacheRef = useRef(new Map<string, string>());
  const generationRef = useRef(0);

  useEffect(() => {
    const generation = ++generationRef.current;
    translatorRef.current?.destroy?.();
    translatorRef.current = null;
    translatorLanguageRef.current = null;
    cacheRef.current.clear();

    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";

    if (language === SOURCE_LANGUAGE) {
      return;
    }

    const translatorFactory = window.Translator;
    if (!translatorFactory) {
      queueMicrotask(() => {
        if (generation === generationRef.current) setAvailability("unavailable");
      });
      return;
    }

    void translatorFactory
      .availability({sourceLanguage: SOURCE_LANGUAGE, targetLanguage: language})
      .then((result) => {
        if (generation === generationRef.current) setAvailability(result);
      })
      .catch(() => {
        if (generation === generationRef.current) setAvailability("unavailable");
      });

    return () => translatorRef.current?.destroy?.();
  }, [language]);

  const setLanguage = useCallback((nextLanguage: string) => {
    const normalized = normalizeLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    setSelection(normalized);
    setAvailability(normalized === SOURCE_LANGUAGE ? "available" : "checking");
    setCurrentLanguage(normalized);
  }, []);

  const selectDetectedLanguage = useCallback(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    setSelection("auto");
    const detected = getBrowserLanguages()[0];
    setAvailability(detected === SOURCE_LANGUAGE ? "available" : "checking");
    setCurrentLanguage(detected);
  }, []);

  const getTranslator = useCallback(async () => {
    if (language === SOURCE_LANGUAGE || !window.Translator) return null;
    if (
      translatorRef.current &&
      translatorLanguageRef.current === language
    ) {
      return translatorRef.current;
    }

    const generation = generationRef.current;
    try {
      const translator = await window.Translator.create({
        sourceLanguage: SOURCE_LANGUAGE,
        targetLanguage: language,
        monitor(monitor) {
          monitor.addEventListener("downloadprogress", () => {
            if (generation === generationRef.current) {
              setAvailability("downloading");
            }
          });
        },
      });
      if (generation !== generationRef.current) {
        translator.destroy?.();
        return null;
      }
      translatorRef.current = translator;
      translatorLanguageRef.current = language;
      setAvailability("available");
      return translator;
    } catch {
      if (generation === generationRef.current) setAvailability("unavailable");
      return null;
    }
  }, [language]);

  const translate = useCallback(
    async (text: string, signal?: AbortSignal) => {
      if (language === SOURCE_LANGUAGE || !text.trim()) return text;
      const cacheKey = `${language}:${text}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) return cached;
      const translator = await getTranslator();
      if (!translator || signal?.aborted) return text;
      try {
        const translated = await translator.translate(text, {signal});
        cacheRef.current.set(cacheKey, translated);
        return translated;
      } catch {
        return text;
      }
    },
    [getTranslator, language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      selection,
      detectedLanguages,
      availability,
      setLanguage,
      selectDetectedLanguage,
      translate,
    }),
    [availability, detectedLanguages, language, selection, selectDetectedLanguage, setLanguage, translate],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
