"use client";

import { useEffect, useRef } from "react";

const ShadowComponent = ({
  html = "",
  css = "",
  componentName = "shadow-component",
  ...props
}) => {
  const shadowElementRef = useRef(null);

  // Tạo Shadow DOM và cập nhật mỗi khi html hoặc css thay đổi
  useEffect(() => {
    if (!shadowElementRef.current) return;

    const shadowRoot = shadowElementRef.current.shadowRoot;
    if (shadowRoot) {
      // Cập nhật style
      const styleTag =
        shadowRoot.querySelector("style") || document.createElement("style");
      styleTag.textContent = css;
      shadowRoot.appendChild(styleTag);

      // Cập nhật HTML
      const container =
        shadowRoot.querySelector("div") || document.createElement("div");
      container.innerHTML = html;
      shadowRoot.appendChild(container);
    }
  }, [html, css]); // Cập nhật khi html hoặc css thay đổi

  // Đảm bảo custom element đã được đăng ký
  useEffect(() => {
    if (!window.customElements.get(componentName)) {
      class ShadowElement extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          // Ban đầu thêm style và container khi element được thêm vào DOM
          const shadowRoot = this.shadowRoot;
          const styleTag = document.createElement("style");
          styleTag.textContent = css;
          shadowRoot.appendChild(styleTag);
          const container = document.createElement("div");
          container.innerHTML = html;
          shadowRoot.appendChild(container);
        }
      }
      window.customElements.define(componentName, ShadowElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentName]);

  return <shadow-component ref={shadowElementRef} {...props} />;
};

export default ShadowComponent;
