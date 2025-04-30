"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/ProductCard";
import styles from "./ProductsSlider.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Import Swiper стилове
import "swiper/css";
import "swiper/css/navigation";

const ProductsSlider = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-center py-6">Няма налични продукти</div>;
  }

  return (
    <div className={styles.productsSwiper}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={32}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
        }}
        className="grid-swiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <div className="h-full">
              <ProductCard
                product={product}
                isFirst={index === 0}
                className="h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Навигационни стрелки с хероикони */}
      <div className={`swiper-button-prev ${styles.prevButton}`}>
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="sr-only">Предишни</span>
      </div>
      <div className={`swiper-button-next ${styles.nextButton}`}>
        <ChevronRightIcon className="w-5 h-5" />
        <span className="sr-only">Следващи</span>
      </div>
    </div>
  );
};

export default ProductsSlider;
