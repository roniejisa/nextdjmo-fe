"use client";
import React, { useEffect, useState } from "react";

const PageClient = ({ dataContent }) => {
  useEffect(() => {
    const items = document.querySelectorAll(".custom-block-nextdjmo");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
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
  }, []);
  return (
    <>
      {dataContent.html && (
        <div dangerouslySetInnerHTML={{ __html: dataContent.html }} />
      )}
      {dataContent.css && (
        <style dangerouslySetInnerHTML={{ __html: dataContent.css }} />
      )}
    </>
  );
};

export default PageClient;
