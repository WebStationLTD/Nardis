"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Компонент за предварително зареждане на CSS файлове за текущата страница
 * @param {Object} props - Пропъртита на компонента
 * @param {string[]} props.cssFiles - Опционален масив с пътищата към CSS файлове за предварително зареждане
 */
export default function PreloadCSS({ cssFiles = [] }) {
  const pathname = usePathname();

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

      // Функция за добавяне на preload линк
      const addPreloadLink = (href) => {
        // Проверка дали URL е валиден
        if (!href || !isValidUrl(href)) return;

        // Проверяваме дали вече не съществува такъв линк
        const existingLink = document.querySelector(
          `link[rel="preload"][href="${href}"]`
        );
        if (existingLink) return;

        // Създаваме нов линк елемент
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "style";
        link.href = href;
        link.crossOrigin = "anonymous";

        // Добавяме линка към head
        document.head.appendChild(link);
      };

      // Ако са подадени конкретни CSS файлове, зареждаме само тези, които съществуват
      if (cssFiles.length > 0) {
        cssFiles.filter((href) => isValidUrl(href)).forEach(addPreloadLink);
      }

      // Намираме всички CSS файлове на страницата
      const stylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ).filter((link) => {
        const href = link.getAttribute("href");
        return href && isValidUrl(href);
      });

      // Добавяме preload за всички CSS файлове от Next.js
      stylesheets.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.includes("/_next/static/css/")) {
          addPreloadLink(href);
        }
      });

      // Cleanup функция - премахваме preload линковете при unmount
      return () => {
        try {
          const preloadLinks = document.querySelectorAll(
            'link[rel="preload"][as="style"]'
          );
          preloadLinks.forEach((link) => {
            // Премахваме само линковете, които не са за текущата страница
            const href = link.getAttribute("href");
            const isCurrentPageCSS = stylesheets.some(
              (styleLink) => styleLink.getAttribute("href") === href
            );

            if (!isCurrentPageCSS && !cssFiles.includes(href)) {
              link.parentNode?.removeChild(link);
            }
          });
        } catch (cleanupError) {
          console.warn("Error during cleanup:", cleanupError);
        }
      };
    } catch (error) {
      console.warn("Error in PreloadCSS:", error);
      return () => {}; // Връщаме празна cleanup функция в случай на грешка
    }
  }, [pathname, cssFiles]);

  return null;
}
