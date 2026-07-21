"use client";

import {useCallback, useSyncExternalStore} from "react";

export type AISpeechLanguage = "en" | "hi";

const STORAGE_KEY = "classorbit-ai-speech-language";
const CHANGE_EVENT = "classorbit-ai-speech-language-change";

function getSnapshot(): AISpeechLanguage {
  return localStorage.getItem(STORAGE_KEY) === "hi" ? "hi" : "en";
}

function getServerSnapshot(): AISpeechLanguage {
  return "en";
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useAISpeechLanguage() {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLanguage = useCallback((nextLanguage: AISpeechLanguage) => {
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return {language, setLanguage};
}
