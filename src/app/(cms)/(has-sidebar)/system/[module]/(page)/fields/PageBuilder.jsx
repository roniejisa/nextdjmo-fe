"use client";

import MonacoEditorCustom from "@/components/Editor/Monaco";
import ShadowComponent from "@/components/Shadow/ShadowComponent";
import { useEffect, useRef, useState } from "react";

const PageBuilder = ({ field, value }) => {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {
        html: "",
        css: "",
      };
    }
  });
  const [tab, setTab] = useState("html");
  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current.value = JSON.stringify(data);
  }, [data]);

  return (
    <div className="w-full border rounded-md p-4">
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        value={value}
      ></textarea>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <div>
            <ul className="flex">
              <li
                onClick={() => setTab("html")}
                className={`px-4 py-2 cursor-pointer rounded-tl-md transition hover:bg-gray-200 ${
                  tab === "html" ? "bg-outline text-white pointer-events-none" : ""
                }`}
              >
                HTML
              </li>
              <li
                onClick={() => setTab("css")}
                className={`px-4 py-2 cursor-pointer rounded-tr-md transition hover:bg-gray-200 ${
                  tab === "css" ? "bg-outline text-white pointer-events-none" : ""
                }`}
              >
                CSS
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <div
              className={`col-span-1 ${tab === "html" ? "block" : "hidden"}`}
            >
              <MonacoEditorCustom
                value={data.html}
                className="h-[500px] rounded-md rounded-tl-none overflow-hidden"
                lang="html"
                onChange={(e) => setData({ ...data, html: e })}
              />
            </div>
            <div className={`col-span-1 ${tab === "css" ? "block" : "hidden"}`}>
              <MonacoEditorCustom
                value={data.css}
                className="h-[500px] rounded-md rounded-tl-none overflow-hidden"
                lang="css"
                onChange={(e) => setData({ ...data, css: e })}
              />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <span className="block h-10">Xem trước</span>
          <div className="max-h-[500px] min-h-[500px] overflow-auto rounded-md border">
            <ShadowComponent html={data.html} css={data.css} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
