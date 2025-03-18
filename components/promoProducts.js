// const products = [
//   {
//     id: 1,
//     name: "Leather Long Wallet",
//     color: "Natural",
//     price: "$75",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-04-trending-product-02.jpg",
//     imageAlt: "Hand stitched, orange leather long wallet.",
//   },
//   {
//     id: 2,
//     name: "Leather Long Wallet",
//     color: "Natural",
//     price: "$75",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-04-trending-product-02.jpg",
//     imageAlt: "Hand stitched, orange leather long wallet.",
//   },
//   {
//     id: 3,
//     name: "Leather Long Wallet",
//     color: "Natural",
//     price: "$75",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-04-trending-product-02.jpg",
//     imageAlt: "Hand stitched, orange leather long wallet.",
//   },
//   {
//     id: 4,
//     name: "Leather Long Wallet",
//     color: "Natural",
//     price: "$75",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-04-trending-product-02.jpg",
//     imageAlt: "Hand stitched, orange leather long wallet.",
//   },
//   // More products...
// ];

// export default function Example() {
//   return (
//     <div className="bg-white">
//       <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
//         <div className="md:flex md:items-center md:justify-between">
//           <h2 className="text-2xl font-bold tracking-tight text-gray-900">
//             Продукти на промоция
//           </h2>
//           <a
//             href="#"
//             className="hidden text-base font-normal text-[#b3438f] hover:text-black md:block"
//           >
//             Вижте всички промоции
//             <span aria-hidden="true"> &rarr;</span>
//           </a>
//         </div>

//         <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
//           {products.map((product) => (
//             <div key={product.id} className="group relative">
//               <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
//                 <img
//                   alt={product.imageAlt}
//                   src={product.imageSrc}
//                   className="size-full object-cover"
//                 />
//               </div>
//               <h3 className="mt-4 text-sm text-gray-700">
//                 <a href={product.href}>
//                   <span className="absolute inset-0" />
//                   {product.name}
//                 </a>
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">{product.color}</p>
//               <p className="mt-1 text-sm font-medium text-gray-900">
//                 {product.price}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 text-sm md:hidden">
//           <a
//             href="#"
//             className="text-base font-normal text-[#b3438f] hover:text-black"
//           >
//             Вижте всички промоции
//             <span aria-hidden="true"> &rarr;</span>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const PromoProducts = () => {
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
              username: "ck_a3f22ab2da4a3e114acd36558674460e5180c8cf", // Вашият Consumer Key
              password: "cs_842ebafd31673fdf7468a64c2a3da3debe477cfc", // Вашият Consumer Secret
            },
          }
        );

        // Филтрираме само продуктите, които имат промоционална цена
        const promoProducts = response.data.filter(
          (product) => product.sale_price && product.sale_price !== ""
        );

        setProducts(promoProducts);
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
            Промоционални продукти
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
              <p className="mt-1 text-sm font-medium text-gray-900 line-through text-red-500">
                {product.regular_price} лв.
              </p>
              <p className="mt-1 text-sm font-bold text-green-600">
                {product.sale_price} лв.
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

export default PromoProducts;
