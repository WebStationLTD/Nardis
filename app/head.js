export default function Head() {
  return (
    <>
      {/* Мета тагове за SEO */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Preconnect за по-бързо зареждане на шрифтове */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Preload за CSS файлове */}
      <script
        id="preload-css-script"
        dangerouslySetInnerHTML={{
          __html: `
            // Функция за добавяне на rel="preload" към CSS файлове
            (function() {
              // Създаваме функция за проверка дали URL е валиден
              function isValidUrl(url) {
                try {
                  return new URL(url).protocol.startsWith('http');
                } catch (e) {
                  return false;
                }
              }

              // Изчакваме зареждането на DOM
              document.addEventListener('DOMContentLoaded', function() {
                try {
                  // Намираме всички CSS линкове
                  var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
                  
                  // За всеки CSS линк създаваме preload елемент
                  cssLinks.forEach(function(link) {
                    var href = link.href;
                    
                    // Проверяваме дали линкът е валиден и съдържа път към CSS от Next.js
                    if (href && isValidUrl(href) && href.includes('/_next/static/css/')) {
                      // Проверяваме дали вече не съществува preload за този CSS
                      var existingPreload = document.querySelector('link[rel="preload"][href="' + href + '"]');
                      
                      if (!existingPreload) {
                        var preloadLink = document.createElement('link');
                        preloadLink.rel = 'preload';
                        preloadLink.as = 'style';
                        preloadLink.href = href;
                        preloadLink.crossOrigin = 'anonymous';
                        
                        // Добавяме preload линка преди оригиналния stylesheet
                        if (link.parentNode) {
                          link.parentNode.insertBefore(preloadLink, link);
                        }
                      }
                    }
                  });
                } catch (error) {
                  // Обработване на грешки, без да прекъсваме потребителското изживяване
                  console.warn('CSS preloading error:', error);
                }
              });
            })();
          `,
        }}
      />
    </>
  );
}
