"use client";

import { useEffect } from "react";
import Head from "next/head";

/**
 * Компонент за предварително зареждане на CSS файлове
 * Този компонент динамично намира всички CSS файлове в страницата и добавя
 * preload link елементи за тях в head на документа, за да избегне render-blocking CSS
 */
const StylesPreloader = () => {
  useEffect(() => {
    // Изпълняваме само на клиентска страна
    if (typeof window === "undefined") return;

    try {
      // Функция за проверка дали URL е валиден
      const isValidUrl = (url) => {
        try {
          return new URL(url).protocol.startsWith("http");
        } catch (e) {
          return false;
        }
      };

      // Функция за проверка дали CSS файлът вече се зарежда
      const isStylesheetLoading = (href) => {
        return (
          document.querySelector(`link[rel="stylesheet"][href="${href}"]`) !==
          null
        );
      };

      // Намираме всички CSS линкове на страницата
      const stylesheetLinks = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      );

      // Функция за създаване на preload елемент
      const createPreloadLink = (href) => {
        if (!href || !isValidUrl(href) || !isStylesheetLoading(href)) {
          return null;
        }

        const preloadLink = document.createElement("link");
        preloadLink.rel = "preload";
        preloadLink.href = href;
        preloadLink.as = "style";
        preloadLink.crossOrigin = "anonymous";

        return preloadLink;
      };

      // Обработваме всеки stylesheet линк
      stylesheetLinks.forEach((link) => {
        // Вземаме href атрибута на link елемента
        const href = link.getAttribute("href");

        // Проверяваме дали href съдържа CSS файл от Next.js
        if (href && href.includes("/_next/static/css/")) {
          // Проверяваме дали вече няма preload за този CSS
          const existingPreload = document.querySelector(
            `link[rel="preload"][href="${href}"]`
          );

          if (!existingPreload) {
            // Създаваме нов preload линк и го добавяме към head
            const preloadLink = createPreloadLink(href);
            if (preloadLink) {
              document.head.appendChild(preloadLink);
            }
          }
        }
      });
    } catch (error) {
      console.warn("CSS preloading error:", error);
    }
  }, []);

  return null;
};

export default StylesPreloader;
