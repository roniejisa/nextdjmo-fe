/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export const useAutoMaxHeight = (
  ref,
  parentLevel,
  dependencies = [],
  offset = 0,
  minHeightSameMaxHeight = true
) => {
  useEffect(() => {
    if (!ref.current) return;

    const setMaxHeight = () => {
      let container = ref.current;

      // Đi lên parentLevel cấp
      for (let i = 0; i < parentLevel; i++) {
        container = container.parentElement;
        if (!container) return;
      }

      const containerRect = container.getBoundingClientRect();
      const elementRect = ref.current.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);

      // Tính padding bottom + border bottom của container
      const containerPaddingBottom =
        parseFloat(containerStyle.paddingBottom) || 0;
      const containerBorderBottom =
        parseFloat(containerStyle.borderBottomWidth) || 0;
      const extraSpace = containerPaddingBottom + containerBorderBottom;

      // Tính available height - trừ thêm padding/border
      const availableHeight =
        containerRect.bottom - elementRect.top - extraSpace;
      ref.current.style.maxHeight = `${Math.max(
        availableHeight - offset,
        100
      )}px`;
      if (minHeightSameMaxHeight) {
        ref.current.style.minHeight = `${Math.max(
          availableHeight - offset,
          100
        )}px`;
      }
    };

    setMaxHeight();

    const handleUpdate = () => setTimeout(setMaxHeight, 16);
    window.addEventListener("resize", handleUpdate, { passive: true });

    return () => window.removeEventListener("resize", handleUpdate);
  }, [parentLevel, offset, ...dependencies]);
};
