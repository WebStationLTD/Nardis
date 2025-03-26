"use client";

import Link from "next/link";
import Image from "next/image";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ categories }) {
  const [open, setOpen] = useState(false);

  // Добавяме масив с желания ред на категориите
  const categoryOrder = [26, 17]; // Първо Artdeco ASIAN SPA (17), после Грим (26)

  // Сортираме категориите според желания ред
  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.id);
    const indexB = categoryOrder.indexOf(b.id);
    return indexA - indexB;
  });

  const navigation = {
    categories: [
      {
        id: "women",
        name: "Магазин",
        featured: [
          {
            name: "Всички продукти",
            href: "/products",
            imageSrc: "/nardis-online-shop-for-luxury-cosmetics.jpg",
            imageAlt: "Кателог продукти на Nardis.bg",
          },
          {
            name: "Artdeco ASIAN SPA",
            href: "#",
            imageSrc: "/artdeco-asian-spa-mega-menu-bg.jpg",
            imageAlt:
              "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
          },
          {
            name: "Грим",
            href: "#",
            imageSrc: "/makeup-mega-menu-bg.jpg",
            imageAlt:
              "Model wearing minimalist watch with black wristband and white watch face.",
          },
        ],
      },
    ],
    pages: [
      { name: "За нас", href: "/about-us" },
      { name: "Блог", href: "/blog" },
      { name: "Контакти", href: "/contact" },
    ],
  };

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="space-y-4">
                      {category.featured.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="group relative overflow-hidden rounded-md bg-gray-100"
                        >
                          <div className="relative h-80 w-full overflow-hidden rounded-lg">
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="absolute inset-0 flex flex-col justify-end">
                            <div className="bg-white/60 p-4 text-base sm:text-sm">
                              <Link
                                href={item.href}
                                className="font-medium text-gray-900"
                                onClick={() => setOpen(false)}
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {item.name}
                              </Link>
                              <p
                                aria-hidden="true"
                                className="mt-0.5 text-gray-700 sm:mt-1"
                              >
                                Пазарувайте сега
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sortedCategories.map((category) => {
                      const chunkSize = 10;
                      const chunks = [];
                      for (
                        let i = 0;
                        i < category.subcategories.length;
                        i += chunkSize
                      ) {
                        chunks.push(
                          category.subcategories.slice(i, i + chunkSize)
                        );
                      }

                      return (
                        <div key={category.id} className="min-w-[200px] flex-1">
                          {/* LEFT column: заглавие + първите 10 */}
                          <div className="space-y-4 min-w-[150px]">
                            <h3 className="font-medium text-gray-900">
                              {category.name}
                            </h3>
                            <ul className="space-y-2 text-gray-500 text-sm">
                              {chunks[0]?.map((subcat) => (
                                <li key={subcat.id}>
                                  <Link
                                    href={`/category/${subcat.slug}`}
                                    className="hover:text-gray-800"
                                    onClick={() => setOpen(false)}
                                  >
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {chunks.slice(1).map((chunk, index) => (
                            <ul
                              key={index}
                              className="space-y-2 text-gray-500 text-sm mt-4"
                            >
                              {chunk.map((subcat) => (
                                <li key={subcat.id}>
                                  <Link
                                    href={`/category/${subcat.slug}`}
                                    className="hover:text-gray-800"
                                    onClick={() => setOpen(false)}
                                  >
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ))}
                        </div>
                      );
                    })}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    prefetch={true}
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                    onClick={() => setOpen(false)}
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-gray-800">
        <nav aria-label="Top" className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div>
            <div className="h-16 items-center justify-between grid grid-cols-3">
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="-ml-2 rounded-md bg-white cursor-pointer p-2 text-gray-400"
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                <Link
                  href="#"
                  className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </Link>
              </div>

              {/* Logo */}
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

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:block mx-auto lg:flex-1 lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <PopoverButton className="group relative z-10 flex items-center cursor-pointer justify-center text-xl font-medium text-white transition-colors duration-200 ease-out hover:text-white data-open:text-white">
                              {category.name}
                              <span
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-1 transition-colors duration-200 ease-out group-data-open:bg-[#b3438f] sm:mt-5 sm:translate-y-px sm:transform"
                              />
                            </PopoverButton>
                          </div>

                          <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-full transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                          >
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 top-1/2 bg-white shadow-sm"
                            />

                            <div className="relative bg-white">
                              <div className="mx-auto relative z-2 bg-white max-w-7xl px-8">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                  <div className="grid grid-cols-2 grid-rows-1 gap-8 text-sm">
                                    {category.featured.map((item, itemIdx) => (
                                      <div
                                        key={item.name}
                                        className={classNames(
                                          itemIdx === 0 ? "col-span-2" : "",
                                          "group relative overflow-hidden rounded-md bg-gray-100"
                                        )}
                                      >
                                        <div className="relative h-80 w-full overflow-hidden rounded-lg">
                                          <Image
                                            src={item.imageSrc}
                                            alt={item.imageAlt}
                                            fill
                                            className="object-cover object-center"
                                          />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col justify-end">
                                          <div className="bg-white/60 p-4 text-sm">
                                            <Link
                                              href={item.href}
                                              className="font-medium text-gray-900"
                                              onClick={close}
                                            >
                                              <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                              />
                                              {item.name}
                                            </Link>
                                            <p
                                              aria-hidden="true"
                                              className="mt-0.5 text-gray-700 sm:mt-1"
                                            >
                                              Пазарувайте сега
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8 gap-y-10 text-sm text-gray-500 max-w-full">
                                    {sortedCategories.map((category) => {
                                      const chunkSize = 10;
                                      const chunks = [];
                                      for (
                                        let i = 0;
                                        i < category.subcategories.length;
                                        i += chunkSize
                                      ) {
                                        chunks.push(
                                          category.subcategories.slice(
                                            i,
                                            i + chunkSize
                                          )
                                        );
                                      }

                                      return (
                                        <Fragment key={category.id}>
                                          <div className="space-y-4 min-w-[150px]">
                                            <h3 className="font-medium text-gray-900 mb-2">
                                              {category.name}
                                            </h3>
                                            <ul className="space-y-2 text-gray-500 text-sm">
                                              {chunks[0]?.map((subcat) => (
                                                <li key={subcat.id}>
                                                  <Link
                                                    href={`/category/${subcat.slug}`}
                                                    className="hover:text-gray-800"
                                                    onClick={close}
                                                  >
                                                    {subcat.name}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>

                                          {chunks
                                            .slice(1)
                                            .map((chunk, index) => (
                                              <div
                                                key={index}
                                                className="space-y-4 min-w-[150px]"
                                              >
                                                <ul className="space-y-2 text-gray-500 text-sm">
                                                  {chunk.map((subcat) => (
                                                    <li key={subcat.id}>
                                                      <Link
                                                        href={`/category/${subcat.slug}`}
                                                        className="hover:text-gray-800"
                                                        onClick={close}
                                                      >
                                                        {subcat.name}
                                                      </Link>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            ))}
                                        </Fragment>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverPanel>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <Link
                      prefetch={true}
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-xl font-medium text-white hover:text-white"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className="flex flex-1 items-center justify-end">
                {/* Search */}
                <Link
                  href="#"
                  className="ml-6 hidden p-2 text-white hover:text-gray-500 lg:block"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </Link>

                {/* Log in */}
                <Link
                  href="/login"
                  className="p-2 text-white hover:text-gray-500 lg:ml-4"
                >
                  <span className="sr-only">Вход</span>
                  <UserIcon aria-hidden="true" className="size-6" />
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  className="p-2 text-white hover:text-gray-500 lg:ml-4"
                >
                  <span className="sr-only">Регистрация</span>
                  <UserPlusIcon aria-hidden="true" className="size-6" />
                </Link>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link href="#" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-white group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-white group-hover:text-gray-500">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
