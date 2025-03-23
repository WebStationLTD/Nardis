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
            name: "New Arrivals",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
            imageAlt:
              "Models sitting back to back, wearing Basic Tee in black and bone.",
          },
          {
            name: "Basic Tees",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
            imageAlt:
              "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
          },
          {
            name: "Accessories",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-03.jpg",
            imageAlt:
              "Model wearing minimalist watch with black wristband and white watch face.",
          },
        ],
      },
      {
        id: "men",
        name: "Грижа за тяло",
        featured: [
          {
            name: "Accessories",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-category-01.jpg",
            imageAlt:
              "Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters.",
          },
          {
            name: "New Arrivals",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
            imageAlt:
              "Drawstring top with elastic loop closure and textured interior padding.",
          },
          {
            name: "Artwork Tees",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
            imageAlt:
              "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
          },
        ],
        sections: [
          [
            {
              id: "shoes",
              name: "Shoes & Accessories",
              items: [
                { name: "Sneakers", href: "#" },
                { name: "Boots", href: "#" },
                { name: "Sandals", href: "#" },
                { name: "Socks", href: "#" },
              ],
            },
            {
              id: "collection",
              name: "Shop Collection",
              items: [
                { name: "Everything", href: "#" },
                { name: "Core", href: "#" },
                { name: "New Arrivals", href: "#" },
                { name: "Sale", href: "#" },
              ],
            },
          ],
          [
            {
              id: "clothing",
              name: "All Clothing",
              items: [
                { name: "Basic Tees", href: "#" },
                { name: "Artwork Tees", href: "#" },
                { name: "Pants", href: "#" },
                { name: "Hoodies", href: "#" },
                { name: "Swimsuits", href: "#" },
              ],
            },
            {
              id: "accessories",
              name: "All Accessories",
              items: [
                { name: "Watches", href: "#" },
                { name: "Wallets", href: "#" },
                { name: "Bags", href: "#" },
                { name: "Sunglasses", href: "#" },
                { name: "Hats", href: "#" },
                { name: "Belts", href: "#" },
              ],
            },
          ],
          [
            {
              id: "brands",
              name: "Brands",
              items: [
                { name: "Re-Arranged", href: "#" },
                { name: "Counterfeit", href: "#" },
                { name: "Full Nelson", href: "#" },
                { name: "My Way", href: "#" },
              ],
            },
          ],
        ],
      },
    ],
    pages: [
      { name: "Company", href: "#" },
      { name: "Stores", href: "#" },
      { name: "Shop", href: "/products" },
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
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full object-cover group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end">
                            <div className="bg-white/60 p-4 text-base sm:text-sm">
                              <a
                                href={item.href}
                                className="font-medium text-gray-900"
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {item.name}
                              </a>
                              <p
                                aria-hidden="true"
                                className="mt-0.5 text-gray-700 sm:mt-1"
                              >
                                Shop now
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
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
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

                <a
                  href="#"
                  className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </a>
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
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
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
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className={classNames(
                                        itemIdx === 0
                                          ? "aspect-2/1"
                                          : "aspect-square",
                                        "w-full object-cover group-hover:opacity-75"
                                      )}
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end">
                                      <div className="bg-white/60 p-4 text-sm">
                                        <a
                                          href={item.href}
                                          className="font-medium text-gray-900"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="absolute inset-0"
                                          />
                                          {item.name}
                                        </a>
                                        <p
                                          aria-hidden="true"
                                          className="mt-0.5 text-gray-700 sm:mt-1"
                                        >
                                          Shop now
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
                                      {/* Първата колона редом до Artdeco */}
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
                                              >
                                                {subcat.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Всички останали падат отдолу */}
                                      {chunks.slice(1).map((chunk, index) => (
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
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-xl font-medium text-white hover:text-white"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="flex flex-1 items-center justify-end">
                {/* Search */}
                <a
                  href="#"
                  className="ml-6 hidden p-2 text-white hover:text-gray-500 lg:block"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </a>

                {/* Account */}
                <a
                  href="#"
                  className="p-2 text-white hover:text-gray-500 lg:ml-4"
                >
                  <span className="sr-only">Account</span>
                  <UserIcon aria-hidden="true" className="size-6" />
                </a>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <a href="#" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-white group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-white group-hover:text-gray-500">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
