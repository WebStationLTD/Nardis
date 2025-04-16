"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Footer({ navigationData }) {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentYear = new Date().getFullYear();
      if (currentYear !== year) {
        setYear(currentYear);
      }
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [year]);

  // Трансформираме категориите идентично както в мега менюто
  const transformCategories = () => {
    if (!navigationData?.categories) return [];

    // Group categories into columns of 3 items each for better organization
    const sectionsData = [];
    const mainCategories = navigationData.categories.slice(0, 9); // Limit to 9 main categories

    // Create sections from categories
    for (let i = 0; i < mainCategories.length; i += 3) {
      const column = [];

      // Take up to 3 categories for this column
      const columnCategories = mainCategories.slice(i, i + 3);

      // Transform each category into a section
      columnCategories.forEach((category) => {
        column.push({
          id: category.slug,
          name: category.name,
          items: [
            {
              name: `Всички в ${category.name}`,
              href: `/category/${category.slug}`,
            },
            // Add up to 5 subcategories for each
            ...category.subcategories.slice(0, 5).map((subcat) => ({
              name: subcat.name,
              href: `/category/${subcat.slug}`,
            })),
          ],
        });
      });

      sectionsData.push(column);
    }

    return sectionsData;
  };

  // Статични страници
  const staticPages = [
    { name: "За нас", href: "#" },
    { name: "Блог", href: "#" },
    { name: "Контакти", href: "#" },
    { name: "Общи условия", href: "#" },
    { name: "Политика за поверителност", href: "#" },
    { name: "Доставка и плащане", href: "#" },
  ];

  // Социални мрежи
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/nardis.beauty",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/nardis.bulgaria/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const footerCategories = transformCategories();

  return (
    <footer className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:pt-24 lg:px-8 lg:pt-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Лого и статични страници */}
          <div>
            <Link href="/" className="flex max-w-[150px]">
              <span className="sr-only">Nardis.bg</span>
              <Image
                width={147}
                height={32}
                alt="Nardis.bg"
                src="/nardis-logo.svg"
                className="h-8 w-auto"
              />
            </Link>

            {/* Статични страници */}
            <div className="mt-10">
              <h3 className="text-sm/6 font-semibold text-white">Информация</h3>
              <ul role="list" className="mt-6 space-y-4">
                {staticPages.map((page) => (
                  <li key={page.name}>
                    <Link
                      href={page.href}
                      className="text-sm/6 text-gray-400 hover:text-white"
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Основно съдържание на футър менюто - идентично на мега менюто */}
          <div className="mt-16 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-1 gap-y-10">
              {/* Категориите организирани в колони, с 2 колони на мобилни устройства и 3 на десктоп */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 text-sm text-gray-400">
                {footerCategories.map((column, columnIdx) => (
                  <div key={columnIdx} className="space-y-10">
                    {column.map((section) => (
                      <div key={section.name}>
                        <p className="font-medium text-white">{section.name}</p>
                        <ul role="list" className="mt-4 space-y-4">
                          {section.items.map((item) => (
                            <li key={item.name} className="flex">
                              <Link
                                href={item.href}
                                className="hover:text-white"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm/6 font-semibold text-white">
              Абонирайте се за нашия бюлетин
            </h3>
            <p className="mt-2 text-sm/6 text-gray-300">
              За актуални събития и новини.
            </p>
          </div>
          <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email-address"
              type="email"
              required
              placeholder="Вашият имейл"
              autoComplete="email"
              className="w-full min-w-0 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:w-56 sm:text-sm/6"
            />
            <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
              <button
                type="submit"
                className="flex-none rounded-md bg-[#b3438f] hover:bg-[#ebedeb] px-3.5 cursor-pointer py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Абонирайте се
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex gap-x-6 md:order-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-300"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="size-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm/6 text-gray-400 md:order-1 md:mt-0">
            &copy; {year} &ldquo;НАРДИЗ&rdquo; ЕООД. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}
