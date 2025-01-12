"use client";
import React from "react";
import SliderMultiple from "./SlideMultiple";
import SlideMultipleItem from "./SlideMultipleItem";

const SlideMultipleClient = () => {
  const products = Array.from({ length: 10 }, (_, i) => {
    return {
      _id: i + 1,
      name: "Product " + (i + 1),
      price: 10000,
      slug: "product-" + (i + 1),
      price_sale: 8000,
      short_content: "Short content",
      image: "/images/image-2.webp",
    };
  });

  return (
    <div className="p-10">
      <h3 className="text-2xl font-bold mb-4 text-active-light">
        Infinity Slider
      </h3>
      <SliderMultiple
        items={products}
        visibleCount={6}
        gap={10}
        component={SlideMultipleItem}
      />
    </div>
  );
};

export default SlideMultipleClient;