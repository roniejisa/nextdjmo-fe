"use client";
import React from "react";
import useRouterCustom from "@/packages/translation/Navigation";
const HomePage = () => {
  const navigate = useRouterCustom();
  return (
    <div>
      <button onClick={() => navigate.push("/play")}>Tạo phòng</button>
      <button onClick={() => navigate.push("/play/join")}>Vào phòng</button>
    </div>
  );
};

export default HomePage;