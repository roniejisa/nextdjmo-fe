import React, { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";

const StyleManager = () => {
  const { editor } = useContext(BuilderContext);

  useEffect(() => {
    if (editor) {
      const defaultSectors = editor.StyleManager.getSectors().map(
        (sector) => sector.attributes
      ); // Lấy sector mặc định

      const customSector = {
        name: "Custom CSS",
        open: true, // Mở sector mặc định
        buildProps: ["custom-css"], // Các thuộc tính trong sector
        properties: [
          {
            name: "custom-css",
            type: "custom",
            label: "Custom CSS",
            placeholder: "Viết CSS tại đây...", // Gợi ý trong ô
            defaults: "", // Giá trị mặc định
            full: true, // Chiếm toàn bộ chiều rộng
            render: (test) => {
              const textarea = document.createElement("textarea");
              textarea.id = "custom-css-style";
              textarea.placeholder = "Viết CSS tại đây...";
              textarea.style.width = "100%";
              textarea.style.height = "200px";
              return textarea;
            },
          },
        ],
      };

      // editor.StyleManager.addSector("custom-sector", customSector); // Thêm sector mới
      editor.StyleManager.getConfig().sectors = [
        ...defaultSectors,
        // customSector,
      ]; // Kết hợp
    }
  }, [editor]);
  return null;
};

export default StyleManager;
