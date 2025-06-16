"use client";
import SocketProvider from "@/context/SocketProvider";
import { useEffect } from "react";

const WebLayout = ({ children }) => {
  return (
    <SocketProvider>
      <main>{children}</main>
    </SocketProvider>
  );
};

export default WebLayout;
