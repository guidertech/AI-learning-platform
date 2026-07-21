type BrowserTranslatorAvailability =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

interface BrowserTranslatorSession {
  translate(input: string, options?: {signal?: AbortSignal}): Promise<string>;
  destroy?(): void;
}

interface BrowserTranslatorFactory {
  availability(options: {
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<BrowserTranslatorAvailability>;
  create(options: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (monitor: EventTarget) => void;
    signal?: AbortSignal;
  }): Promise<BrowserTranslatorSession>;
}

interface Window {
  Translator?: BrowserTranslatorFactory;
}
