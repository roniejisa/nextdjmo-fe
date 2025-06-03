"use client";

import React, { memo, useContext } from "react";
import { RosoContext } from "@/context/cms/RosoProvider";

const TypingEffect = memo(function TypingEffect({}) {
  const { tempRef } = useContext(RosoContext);
  return <div ref={tempRef} className="markdown-content" />;
});

export default TypingEffect;