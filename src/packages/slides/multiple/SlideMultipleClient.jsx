"use client";
import React from "react";
import SliderMultiple from "./SlideMultiple";
import SlideMultipleItem from "./SlideMultipleItem";

const SlideMultipleClient = () => {
  const products = [
    "Product 1",
    "Product 2",
    "Product 3",
    // "Product 4",
    // "Product 5",
    // "Product 6",
    // "Product 7",
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Infinity Slider</h1>
      <SliderMultiple
        items={products}
        visibleCount={5}
        component={SlideMultipleItem}
      />
    </div>
  );
};

export default SlideMultipleClient;
