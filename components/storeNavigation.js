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

export default function StoreNavigation({ navigationData }) {
  const [open, setOpen] = useState(false);

  // Extract data from props
  const { categories, featuredItems, pages } = navigationData;

  // Transform categories into sections format similar to exampleNav
  const transformCategories = () => {
    // Group categories into columns of 3 items each for better organization
    const sectionsData = [];
    const mainCategories = categories.slice(0, 9); // Limit to 9 main categories

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

  // Structure for navigation
  const navigation = {
    categories: [
      {
        id: "shop",
        name: "Магазин",
        featured: featuredItems,
        sections: transformCategories(),
      },
    ],
    pages: pages,
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
                    {/* Featured Items */}
                    <div className="space-y-4">
                      {category.featured.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="group relative overflow-hidden rounded-md bg-gray-100"
                        >
                          <div className="relative h-48 w-full overflow-hidden rounded-lg">
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              width={280}
                              height={256}
                              className="object-cover object-center"
                            />
                          </div>
                          <div className="absolute inset-0 flex flex-col justify-end">
                            <div className="bg-white/60 p-3 text-sm">
                              <Link
                                prefetch={true}
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
                                className="mt-0.5 text-gray-700 text-xs"
                              >
                                Пазарувайте сега
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Columns of category sections */}
                    {category.sections.map((column, columnIdx) => (
                      <div key={columnIdx} className="space-y-10">
                        {column.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <Link
                                    prefetch={true}
                                    href={item.href}
                                    className="-m-2 block p-2 text-gray-500"
                                    onClick={() => setOpen(false)}
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
              <Link href="/" className="flex max-w-[150px]" prefetch={true}>
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
                            <PopoverButton className="group relative z-10 flex items-center cursor-pointer justify-center text-lg font-medium text-white transition-colors duration-200 ease-out hover:text-white data-open:text-white">
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
                              <div className="mx-auto max-w-7xl px-8">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                  {/* Featured items section */}
                                  <div className="grid grid-cols-2 grid-rows-1 gap-8 text-sm">
                                    {category.featured.map((item, itemIdx) => (
                                      <div
                                        key={item.name}
                                        className={classNames(
                                          itemIdx === 0 ? "col-span-2" : "",
                                          "group relative overflow-hidden rounded-md bg-gray-100"
                                        )}
                                      >
                                        <div className="relative h-64 w-full overflow-hidden rounded-lg">
                                          <Image
                                            src={item.imageSrc}
                                            alt={item.imageAlt}
                                            width={600}
                                            height={256}
                                            className="object-cover object-center"
                                          />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col justify-end">
                                          <div className="bg-white/60 p-4 text-sm">
                                            <Link
                                              prefetch={true}
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

                                  {/* Categories organized in columns, matching the exampleNav structure */}
                                  <div className="grid grid-cols-3 gap-x-8 gap-y-10 text-sm text-gray-500">
                                    {category.sections.map(
                                      (column, columnIdx) => (
                                        <div
                                          key={columnIdx}
                                          className="space-y-10"
                                        >
                                          {column.map((section) => (
                                            <div key={section.name}>
                                              <p
                                                id={`${category.id}-${section.id}-heading`}
                                                className="font-medium text-gray-900"
                                              >
                                                {section.name}
                                              </p>
                                              <ul
                                                role="list"
                                                aria-labelledby={`${category.id}-${section.id}-heading`}
                                                className="mt-4 space-y-4"
                                              >
                                                {section.items.map((item) => (
                                                  <li
                                                    key={item.name}
                                                    className="flex"
                                                  >
                                                    <Link
                                                      prefetch={true}
                                                      href={item.href}
                                                      className="hover:text-gray-800"
                                                      onClick={close}
                                                    >
                                                      {item.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    )}
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
                      className="flex items-center text-lg font-medium text-white hover:text-white"
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
                  <Link
                    href="/cart"
                    className="group -m-2 flex items-center p-2"
                  >
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
