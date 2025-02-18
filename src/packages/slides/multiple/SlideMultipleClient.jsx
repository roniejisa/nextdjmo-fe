"use client";
import React from "react";
import SliderMultiple from "./SlideMultiple";
import SlideMultipleItem from "./SlideMultipleItem";

const SlideMultipleClient = () => {
  const products = Array.from({ length: 10 }, (_, i) => {
    return {
      _id: i + 1,
      name: "Tin tức " + (i + 1),
      price: 10000,
      slug: "news-" + (i + 1),
      price_sale: 8000,
      short_content:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis ad necessitatibus explicabo porro aperiam id nobis labore repudiandae mollitia voluptatum aliquam quaerat sunt sed dolores natus repellat, nam architecto tempora.",
      date: new Date(
        `${Math.floor(Math.random() * 2) + 2023}-${
          Math.floor(Math.random() * 12) + 1
        }-${Math.floor(Math.random() * 31) + 1}`
      ),
      image: "/images/image-2.webp",
    };
  });

  return (
    <div className="p-10">
      <h3 className="text-2xl font-bold mb-4 text-active-dark">
        Infinity Slider
      </h3>
      <SliderMultiple
        items={products}
        visibleCount={4}
        gap={10}
        component={SlideMultipleItem}
      />
    </div>
  );
};

export default SlideMultipleClient;
