"use client";

import React, { memo } from "react";
import { useMessage } from "@/hooks/useMessage";

const TypingEffect = memo(function TypingEffect({}) {
  const { tempRef } = useMessage();
  return <div ref={tempRef} className="markdown-content pb-20" />;
});

export default TypingEffect;
