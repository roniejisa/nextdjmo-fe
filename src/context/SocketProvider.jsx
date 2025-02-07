"use client";
import { makeId } from "@/utils/client/util";
import { getOrCreateIndexDB } from "@/utils/indexDB";
import { useState, useEffect, createContext, useRef, useCallback } from "react";
import CryptoJS from "crypto-js";

const secretKey = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef"); // Khóa bí mật (32 ký tự cho AES-256)
const iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210"); // IV (16 ký tự)

// Hàm mã hóa
export const encryptData = (data) => {
  const jsonData = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonData, secretKey, { iv: iv });
  return encrypted.toString(); // Chuỗi mã hóa Base64
};

const decryptData = (encryptedData) => {
  try {
    // Giải mã AES
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Chuyển bytes thành chuỗi
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export const SocketContext = createContext(null);
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dataDBIndex = useRef(null);
  const sessionIdRef = useRef(null);
  const onlineRef = useRef(0);
  const typeRef = useRef({
    "update-count": (data) => {
      onlineRef.current.innerHTML = data.count;
    },

    ping: () => {
      if (!socketRef.current) return;
      socketRef.current.send(
        encryptData({
          type: "pong",
          data: {
            id: sessionIdRef.current,
          },
        })
      );
    },
  });

  const connectSocket = () => {
    if (socketRef.current) return;
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL);
    socketRef.current.onopen = () => {
      // console.log("Đã kết nối");
      connectAndSendRequestForServer();
    };

    socketRef.current.onmessage = (event) => {
      const { type, data } = JSON.parse(decryptData(event.data));
      if (
        typeRef.current &&
        type &&
        typeof typeRef.current === "object" &&
        typeof typeRef.current[type] == "function"
      ) {
        typeRef.current[type](data);
      }
    };

    socketRef.current.onclose = () => {
      // console.log("Disconnected");
      socketRef.current = null;
      // Thử kết nối lại sau 3 giây
    };

    socketRef.current.onerror = (error) => {
      // console.error("WebSocket Error", error);
      // Kết nối lại khi gặp lỗi
      setTimeout(connectSocket, 10000);
    };

    socketRef.current.sendEncode = (obj) => {
      if (typeof socketRef.current.send != "function") return;
      socketRef.current.send(encryptData(obj));
    };
  };

  const alertConnectSocket = () => {
    if (sessionIdRef.current && socketRef.current) {
      socketRef.current.send(
        encryptData({
          type: "connect",
          data: {
            id: sessionIdRef.current,
          },
        })
      );
    }
  };

  const checkNoInternet = (e) => {
    socketRef.current.close();
    socketRef.current = null;
  };

  const connectAndSendRequestForServer = async () => {
    if (!sessionIdRef.current) {
      // dataDBIndex.current = getOrCreateIndexDB("MyAppDB", 1);
      // if (typeof dataDBIndex.current.getOrSet === "function") {
      let rssId = localStorage.getItem("rssId");
      
      if (!rssId) {
        rssId = makeId(24);
        localStorage.setItem("rssId", rssId);
      };
      sessionIdRef.current = rssId;
      console.log(sessionIdRef.current)
      alertConnectSocket();
    }
  };

  const disconnectWeb = () => {
    if (socketRef.current) {
      socketRef.current.sendEncode({
        type: "disconnect",
        data: {
          id: sessionIdRef.current,
        },
      });
    }
  };
  useEffect(() => {
    connectSocket();
    window.addEventListener("online", connectSocket);
    window.addEventListener("offline", checkNoInternet);
    window.addEventListener("beforeunload", disconnectWeb);
    return () => {
      window.removeEventListener("online", connectSocket);
      window.removeEventListener("offline", checkNoInternet);
      window.removeEventListener("beforeunload", disconnectWeb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addTypes = (type, callback) => {
    typeRef.current = { ...typeRef.current, [type]: callback };
  };
  const handleSend = () => {
    if (socketRef.current) {
      socketRef.current.send(
        encryptData({
          type: "update-count",
          data: {
            id: sessionIdRef.current,
          },
        })
      );
    } else {
      connectSocket();
    }
  };
  return (
    <SocketContext.Provider
      value={{ socketRef, typeRef, addTypes, sessionIdRef }}
    >
      {children}
      <div
        className="fixed z-[999] top-0 right-10 rounded-md rounded-tl-none rounded-tr-none border-t-0 bg-white border border-blue-700 flex justify-center p-4 cursor-pointer"
        onClick={handleSend}
      >
        Online:{" "}
        <span className="ml-2" ref={onlineRef}>
          0
        </span>
      </div>
    </SocketContext.Provider>
  );
};

export default SocketProvider;
