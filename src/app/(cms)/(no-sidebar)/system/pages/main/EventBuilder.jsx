import React, { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";

const EventBuilder = () => {
  const { editor } = useContext(BuilderContext);

  useEffect(() => {
    if (editor) {

      editor.on('canvas:drop', (data) => {
        const selected = editor.getSelected();
        if (selected && selected.is('grid-container')) {
          selected.append(`
            <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              New Grid Item
            </div>
          `);
        }
      });


      // Lắng nghe sự thay đổi từ input:change để áp dụng CSS
      // Lắng nghe sự thay đổi trong styleManager
      editor.on("style:property:update", (data) => {
        const { property, value } = data;
        if (property.attributes.name == "custom-css") {
          const selectedComponent = editor.getSelected(); // Thành phần đang được chọn
          const css = value; // Giá trị CSS mới

          if (selectedComponent && css) {
            // Tạo hoặc cập nhật thẻ <style> trong DOM
            let styleTag = document.getElementById("custom-css-style");
            if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.id = "custom-css-style";
              document.head.appendChild(styleTag);
            }

            // Cập nhật lại style của component
            const data = JSON.parse(css);
            selectedComponent.setStyle({ ...data });
          }
        }
      });

      editor.on("component:styleUpdate", (component) => {
        console.log(component);
      });
      // Lắng nghe sự kiện khi chọn component
      editor.on("component:selected", (component) => {
        //   console.log(component);
      });

      return () => {
        
      };
    }
  }, [editor]);
  return null;
};

export default EventBuilder;
