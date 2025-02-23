"use client";

import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
import { usePathname, useSearchParams } from "next/navigation";

const SkeletonWithChildren = ({
  children,
  delay = 500,
  skeletonComponent = <Skeleton />,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);
  return <>{loading ? skeletonComponent : children}</>;
};

export default SkeletonWithChildren;
