"use client";

import { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";
import { httpClient } from "@/utils/http";
import { makeId, showImageUrl, toSlug } from "@/utils/client";

const addLabelForBlock = (name, icon) => {
  return `<div>
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center; justify-content:center; margin-top:10px">
      <img src="${icon}" alt="Image">
      <span style="font-size:20px">${name}</span>
    </div>`;
};
const BlockManager = () => {
  const { editor, token } = useContext(BuilderContext);

  const getComponents = async () => {
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "components/get-all",
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.status == 200) {
      const blockManager = editor.BlockManager;
      response.data.map((group) => {
        group.components.map((component) => {
          const id = toSlug(component.name);
          const content = `<div class="${id} custom-block-nextdjmo" >${component.html}</div>`;
          blockManager.add(id, {
            label: addLabelForBlock(
              component.name,
              showImageUrl(component.image)
            ),
            content: content,
            category: group.name,
          });
          // Thêm CSS vào CssComposer

          editor.DomComponents.addType(id, {
            model: {
              defaults: {
                script: () => {
                  // Chạy bên ngoài
                  const items = document.querySelectorAll(
                    ".custom-block-nextdjmo"
                  );
                  for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (typeof item != "undefined") {
                      const type = item.getAttribute("type");
                      const fn = item.getAttribute("fn");
                      if (!item.querySelector(".css-off-" + type)) {
                        const styleEl = document.createElement("style");
                        const css = item.getAttribute("css");
                        styleEl.innerHTML = css;
                        item.appendChild(styleEl);
                      }

                      if (!window[type]) {
                        window[type] = () => {
                          eval(fn);
                        };
                      }
                      window[type]();
                    }
                  }
                },
              },
            },
            isComponent: (el) => {
              if (
                el.className &&
                typeof el.className === "string" &&
                el.className.includes(id)
              ) {
                return {
                  type: id,
                  attributes: {
                    fn: component.js,
                    type: id,
                    css: component.css,
                  },
                };
              }
            },
          });
        });
      });
    }
  };

  useEffect(() => {
    if (editor) {
      // GRID
      editor.BlockManager.add("grid-container", {
        label: "Grid Container",
        content: `
         <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(100% / 12 - 10px), 1fr)); gap: 10px; padding: 10px; border: 1px solid #ccc;">
            <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });

      editor.BlockManager.add("grid-item-one", {
        label: "Grid One",
        content: `
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });
      editor.BlockManager.add("grid-item-two", {
        label: "Grid Two",
        content: `
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });

      editor.BlockManager.add("grid-item-three", {
        label: "Grid Three",
        content: `
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });

      // BASIC
      editor.BlockManager.add("text", {
        label: addLabelForBlock("Text", "/next.svg"), // Tên hiển thị của block
        content: "<div>Nhập text vào đây nào</div>", // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });

      editor.BlockManager.add("image", {
        label: addLabelForBlock("Image", "/next.svg"), // Tên hiển thị của block
        content: `<img src="/next.svg" />`, // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });

      editor.BlockManager.add("button", {
        label: addLabelForBlock("Button", "/next.svg"), // Tên hiển thị của block
        content: `<button>Click</button>`, // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });
      getComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
  return null;
};

export default BlockManager;
