"use client";

import React, { useState } from "react";
import Skeleton from "./Skeleton";
import { usePathname } from "next/navigation";

const SkeletonWithChildren = ({
  children,
  loading,
  skeletonComponent = <Skeleton />,
  length = 5,
  ...props
}) => {
  console.log([...Array(length)])
  return (
    <>
      {children}
      {loading &&
        [...Array(length)].map((item, index) => (
          <React.Fragment key={index}>{skeletonComponent}</React.Fragment>
        ))}
    </>
  );
};

export default SkeletonWithChildren;
