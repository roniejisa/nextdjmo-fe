"use client";

import ShadowComponent from "@/components/Shadow/ShadowComponent";
import { useEffect, useRef, useState } from "react";

const PageBuilder = ({ field, defaultValue }) => {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(defaultValue);
    } catch (e) {
      return {
        html: "",
        css: "",
      };
    }
  });

  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current.value = JSON.stringify(data);
  }, [data]);

  return (
    <div className="w-full">
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        defaultValue={defaultValue}
      ></textarea>
      <div className="grid grid-cols-2">
        <label className="col-span-1">
          <span>HTML</span>
          <textarea
            className="p-4"
            data-name="html"
            onChange={(e) => setData({ ...data, html: e.target.value })}
            defaultValue={data.html}
          ></textarea>
        </label>
        <label className="col-span-1">
          <span>CSS</span>
          <textarea
            className="p-4"
            data-name="css"
            onChange={(e) => setData({ ...data, css: e.target.value })}
            defaultValue={data.css}
          ></textarea>
        </label>
      </div>
      <div>
        <span>Xem trước</span>
        <div className="max-h-[300px] overflow-auto">
          <ShadowComponent html={data.html} css={data.css} />
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
