import { Html, Head, Main, NextScript } from "next/document";
import { Children } from "react";

export default function Document(props) {
  // Тук определяме основните стилове, които искаме да заредим предварително
  const preloadedStylesheets = [
    // Регулярен израз за съвпадение със стилове генерирани от Next.js
    /\/_next\/static\/css\/[^"]+\.css/,
  ];

  // Функция за проверка дали URL съвпада с някой от шаблоните за предварително зареждане
  const shouldPreload = (url) => {
    return preloadedStylesheets.some((pattern) => pattern.test(url));
  };

  // Модифицирана функция за оригиналния компонент NextScript,
  // която ще преобразува CSS линковете
  const ModifiedNextScript = () => {
    const originalNextScript = <NextScript />;

    // Рекурсивна функция за обработка на React дървото
    const processChild = (child) => {
      // Ако детето е React елемент и е <link> таг
      if (
        child &&
        child.type === "link" &&
        child.props &&
        child.props.href &&
        child.props.rel === "stylesheet" &&
        shouldPreload(child.props.href)
      ) {
        // Създаваме два елемента вместо един:
        // 1. preload елемент, който зарежда стила предварително
        // 2. оригиналния stylesheet елемент, но с отложено зареждане
        return [
          <link
            key={`preload-${child.props.href}`}
            rel="preload"
            href={child.props.href}
            as="style"
            data-precedence={child.props["data-precedence"]}
            crossOrigin={child.props.crossOrigin}
          />,
          // Оригиналният stylesheet елемент остава същият
          child,
        ];
      }
      return child;
    };

    // Обхождаме децата на NextScript и прилагаме нашата функция за обработка
    const processChildren = (children) => {
      return Children.map(children, (child) => {
        if (!child) return child;

        // Ако детето има props.children, обработваме рекурсивно
        if (child.props && child.props.children) {
          const newChildren = processChildren(child.props.children);
          return {
            ...child,
            props: {
              ...child.props,
              children: newChildren,
            },
          };
        }

        // Обработваме текущото дете
        return processChild(child);
      });
    };

    // Започваме обработката от най-високото ниво
    if (originalNextScript.props && originalNextScript.props.children) {
      return {
        ...originalNextScript,
        props: {
          ...originalNextScript.props,
          children: processChildren(originalNextScript.props.children),
        },
      };
    }

    return originalNextScript;
  };

  return (
    <Html lang="bg">
      <Head>
        {/* Тук можем да добавим глобални метатагове и ресурси, които да се заредят предварително */}
        <meta name="theme-color" content="#129160" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <ModifiedNextScript />
      </body>
    </Html>
  );
}
