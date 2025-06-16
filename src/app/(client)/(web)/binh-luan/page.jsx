"use client";
import CommentClient from "@/packages/comments/CommentClient";
import CommentContent from "@/packages/comments/CommentContent";
import React, { useEffect } from "react";

const page = () => {
  return (
    <CommentClient type="product" id={"676d020b9b5b054b762e151c"}>
      <CommentContent />
    </CommentClient>
  );
};

export default page;
