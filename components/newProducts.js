"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const NewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://nardis.rosset.website/wp-json/wc/v3/products",
          {
            params: {
              per_page: 4, // Брой продукти за показване
              orderby: "date",
              order: "desc",
            },
            auth: {
              username: "ck_a3f22ab2da4a3e114acd36558674460e5180c8cf", // Заменете с вашия Consumer Key
              password: "cs_842ebafd31673fdf7468a64c2a3da3debe477cfc", // Заменете с вашия Consumer Secret
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Грешка при извличане на продуктите:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Нови продукти
          </h2>
          <a
            href="#"
            className="hidden text-base font-medium text-[#b3438f] hover:text-black md:block"
          >
            Вижте всички
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative border-1 border-solid rounded-lg border-[#1e2939] py-4 px-4"
            >
              <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href={product.permalink}>
                  <span className="absolute inset-0" />
                  {product.name}
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {product.price}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <a
            href="#"
            className="text-base font-medium text-[#b3438f] hover:text-black"
          >
            Вижте всички
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
