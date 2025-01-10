"use client";
import { useContext, useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css"; // Default GrapesJS styles
import style from "./global.css"; // Custom styles for the editor
import { BuilderContext } from "../providers/BuilderProvider";
import { httpClient } from "@/utils/http";
const GrapesBuilder = ({ token, profile, id = null }) => {
  const editorRef = useRef(null); // Reference for the editor container
  const { setEditor, setToken, setId, setPage } = useContext(BuilderContext);
  useEffect(() => {
    setToken(token);
    if (id) {
      setId(id);
    }
    const editor = grapesjs.init({
      container: editorRef.current, // DOM element to attach GrapesJS
      plugins: [], // Optional plugins
      pluginsOpts: {},
      storageManager: {
        stepsBeforeSave: 1,
        onStore: async () => {
          if (!id) return;
          const html = editor.getHtml();
          const css = editor.getCss();
          const response = await httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/save",
            {
              Authorization: `Bearer ${token}`,
            },
            {
              id,
              data: JSON.stringify({
                html: html
                  .replace("<body", "<section")
                  .replace("</body>", "</section>"),
                css: css,
              }),
            },
            "POST"
          );
          if (response.status == 201) {
            setId(response.data._id);
          }
        },
        autosave: true,
        onLoad: async () => {
          if (!id) return;
          const response = await httpClient(
            process.env.NEXT_PUBLIC_ENDPOINT_URL + "pages/" + id,
            {
              Authorization: `Bearer ${token}`,
            }
          );
          if (response.status == 200) {
            setPage(response.data);
            const data = JSON.parse(response.data.content);
            editor.setComponents(
              data.html
                .replace("<section", "<body")
                .replace("</section>", "</body>")
            );
            editor.setStyle(data.css);

            const canvasDoc = editor.Canvas.getDocument();
            const items = canvasDoc.querySelectorAll(".custom-block-nextdjmo");
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
                    eval(new Function("return " + fn)());
                  };
                }
                window[type]();
              }
            }
          }
        },
      },
      fromElement: true, // Initialize from an existing HTML element
      canvas: {
        styles: ["/app/globals.scss"],
      },
    });

    editor.on("load", () => {
      setEditor(editor);
      editor.StorageManager.load();
    });
    // Thêm block mới
    return () => {
      editor.destroy(); // Cleanup on component unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div ref={editorRef}></div>
    </div>
  );
};

export default GrapesBuilder;
