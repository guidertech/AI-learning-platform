"use client";

import { useEffect } from "react";
import { useLanguage } from "../store/LanguageContext";

const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "alt",
] as const;
const EXCLUDED_SELECTOR = [
  "[data-no-translate]",
  "[translate='no']",
  ".material-symbols-outlined",
  "code",
  "pre",
  "script",
  "style",
  "textarea",
  "[contenteditable='true']",
].join(",");

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedText = new WeakMap<Text, string>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const textRevisions = new WeakMap<Text, number>();

function isExcluded(node: Node): boolean {
  const element = node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : node.parentElement;
  return Boolean(element?.closest(EXCLUDED_SELECTOR));
}

function shouldTranslate(text: string): boolean {
  const trimmed = text.trim();
  return (
    trimmed.length > 1 &&
    /[A-Za-z]/.test(trimmed) &&
    !/^https?:\/\//i.test(trimmed)
  );
}

export default function BrowserPageTranslator() {
  const { language, translate } = useLanguage();

  useEffect(() => {
    const root = document.body;
    const controller = new AbortController();
    const translateTextNode = async (node: Text) => {
      if (isExcluded(node)) return;
      const nodeRevision = (textRevisions.get(node) ?? 0) + 1;
      textRevisions.set(node, nodeRevision);
      const source = originalText.get(node) ?? node.data;
      if (!originalText.has(node)) originalText.set(node, source);
      if (language === "en" || !shouldTranslate(source)) {
        if (node.data !== source) node.data = source;
        return;
      }
      const translated = await translate(source, controller.signal);
      if (
        !controller.signal.aborted &&
        node.isConnected &&
        textRevisions.get(node) === nodeRevision &&
        node.data !== translated
      ) {
        appliedText.set(node, translated);
        node.data = translated;
      }
    };

    const translateElementAttributes = async (element: Element) => {
      if (isExcluded(element)) return;
      let originals = originalAttributes.get(element);
      if (!originals) {
        originals = new Map();
        originalAttributes.set(element, originals);
      }
      for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const current = element.getAttribute(attribute);
        if (!current) continue;
        if (!originals.has(attribute)) originals.set(attribute, current);
        const source = originals.get(attribute) ?? current;
        const output = language === "en" || !shouldTranslate(source)
          ? source
          : await translate(source, controller.signal);
        if (
          !controller.signal.aborted &&
          element.isConnected &&
          element.getAttribute(attribute) !== output
        ) {
          let applied = appliedAttributes.get(element);
          if (!applied) {
            applied = new Map();
            appliedAttributes.set(element, applied);
          }
          applied.set(attribute, output);
          element.setAttribute(attribute, output);
        }
      }
    };

    const process = (node: Node) => {
      if (isExcluded(node)) return;
      if (node.nodeType === Node.TEXT_NODE) {
        void translateTextNode(node as Text);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const element = node as Element;
      void translateElementAttributes(element);
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      );
      let child = walker.nextNode();
      while (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          void translateTextNode(child as Text);
        } else {
          void translateElementAttributes(child as Element);
        }
        child = walker.nextNode();
      }
    };

    process(root);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(process);
        } else if (mutation.type === "characterData") {
          const textNode = mutation.target as Text;
          const knownOriginal = originalText.get(textNode);
          const lastApplied = appliedText.get(textNode);
          if (
            knownOriginal !== undefined &&
            textNode.data !== knownOriginal &&
            textNode.data !== lastApplied
          ) {
            originalText.set(textNode, textNode.data);
          }
          process(textNode);
        } else if (mutation.type === "attributes") {
          const element = mutation.target as Element;
          const attribute = mutation.attributeName;
          if (attribute) {
            const current = element.getAttribute(attribute);
            const applied = appliedAttributes.get(element)?.get(attribute);
            if (current && current !== applied) {
              let originals = originalAttributes.get(element);
              if (!originals) {
                originals = new Map();
                originalAttributes.set(element, originals);
              }
              originals.set(attribute, current);
            }
          }
          void translateElementAttributes(element);
        }
      }
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => {
      controller.abort();
      observer.disconnect();
    };
  }, [language, translate]);

  return null;
}
