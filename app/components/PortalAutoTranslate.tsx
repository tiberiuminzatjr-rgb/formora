"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";
import { portalUiRo } from "@/lib/portal-ui-translations";

// Keep the original language for existing DOM text/attributes so that
// switching RO -> EN also restores English without a page refresh.
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();

const enFromRo = new Map<string, string>();
for (const [en, ro] of Object.entries(portalUiRo)) {
  if (!enFromRo.has(ro)) enFromRo.set(ro, en);
}

const watchedAttributes = ["placeholder", "title", "aria-label"] as const;

function translate(value: string, language: "ro" | "en") {
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
  if (!match) return value;
  const original = match[2].replace(/\s+/g, " ").trim();
  const result = language === "ro"
    ? (portalUiRo[original] ?? original)
    : (enFromRo.get(original) ?? original);
  return `${match[1]}${result}${match[3]}`;
}

function skipped(el: Element | null) {
  return !!el?.closest(
    "script,style,code,pre,textarea,[contenteditable],[data-no-translate]"
  );
}

export default function PortalAutoTranslate() {
  const { language } = useLanguage();

  useEffect(() => {
    function updateText(node: Text) {
      if (skipped(node.parentElement)) return;
      const current = node.nodeValue ?? "";
      let source = originalText.get(node);
      if (source === undefined) {
        source = current;
        originalText.set(node, source);
      }
      const expectedRo = translate(source, "ro");
      const expectedEn = translate(source, "en");
      // React may replace a text value with newly loaded data. In that case
      // treat the new value as source, rather than overriding the new data.
      if (current !== source && current !== expectedRo && current !== expectedEn) {
        source = current;
        originalText.set(node, source);
      }
      const desired = translate(source, language);
      if (current !== desired) node.nodeValue = desired;
    }

    function updateElement(element: Element) {
      if (skipped(element)) return;
      let previous = originalAttributes.get(element);
      if (!previous) {
        previous = new Map();
        originalAttributes.set(element, previous);
      }
      for (const key of watchedAttributes) {
        const current = element.getAttribute(key);
        if (current === null) continue;
        let source = previous.get(key);
        if (source === undefined) {
          source = current;
          previous.set(key, source);
        }
        if (current !== source && current !== translate(source, "ro") && current !== translate(source, "en")) {
          source = current;
          previous.set(key, source);
        }
        const desired = translate(source, language);
        if (current !== desired) element.setAttribute(key, desired);
      }
    }

    function scan(root: Node) {
      if (root.nodeType === Node.TEXT_NODE) {
        updateText(root as Text);
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      const el = root as Element;
      if (skipped(el)) return;
      updateElement(el);
      const walker = document.createTreeWalker(
        el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) updateText(node as Text);
        else updateElement(node as Element);
      }
    }

    const body = document.body;
    scan(body);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "characterData" || m.type === "attributes") scan(m.target);
        if (m.type === "childList") {
          for (const n of m.addedNodes) scan(n);
        }
      }
    });
    observer.observe(body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...watchedAttributes],
    });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
