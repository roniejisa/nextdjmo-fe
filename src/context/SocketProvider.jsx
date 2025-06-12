"use client";
import { useEffect, createContext, useRef, useState } from "react";
import { encryptData, decryptData } from "@/utils/socket/utils";
const TIMEOUT = 999999
export const SocketContext = createContext(null);
export const SocketProvider = ({ children }) => {
  const [socketOn, setSocketOn] = useState(false);
  const socketRef = useRef(null);
  const sessionIdRef = useRef(null);
  const onlineRef = useRef(0);
  const typeRef = useRef({
    "update-count": (data) => {
      if (onlineRef.current) {
        onlineRef.current.innerHTML = data.count;
      }
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
    if (
      (!socketRef.current ||
        socketRef.current.readyState === WebSocket.CLOSED) &&
      sessionIdRef.current
    ) {
      socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL);
      // ... rest of your socket setup
      socketRef.current.onopen = () => {
        setSocketOn(true);
        alertConnectSocket();
      };

      socketRef.current.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(decryptData(event.data));
          if (
            typeRef.current &&
            type &&
            typeof typeRef.current === "object" &&
            typeof typeRef.current[type] == "function"
          ) {
            typeRef.current[type](data);
          }
        } catch (error) {
          console.error("Parse message error:", error);
        }
      };

      socketRef.current.onclose = () => {
        socketRef.current = null;
        setSocketOn(false);
        // Có thể thêm exponential backoff retry

        setTimeout(() => {
          if (sessionIdRef.current) connectSocket();
        }, TIMEOUT);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket Error", error);
        setSocketOn(false);
        // Kết nối lại khi gặp lỗi
        // setTimeout(connectSocket, 10000);
      };

      socketRef.current.sendEncode = (obj) => {
        try {
          if (typeof socketRef.current.send != "function") return;
          socketRef.current.send(encryptData(obj));
        } catch (error) {
          // ERROR SOCKET
        }
      };
    }
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

  const setSessionId = (id) => {
    sessionIdRef.current = id;
  };
  useEffect(() => {
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
    if (
      socketRef.current &&
      sessionIdRef.current &&
      typeof socketRef.current.sendEncode === "function"
    ) {
      socketRef.current.sendEncode({
        type: "update-count",
        data: {
          id: sessionIdRef.current,
        },
      });
    } else {
      connectSocket();
    }
  };
  return (
    <SocketContext.Provider
      value={{
        socketRef,
        typeRef,
        addTypes,
        sessionIdRef,
        setSessionId,
        connectSocket,
      }}
    >
      {children}
      {socketOn && (
        <div
          className="fixed z-[999] bottom-0 right-10 rounded-md rounded-bl-none rounded-br-none border-b-0 bg-white border border-blue-700 flex justify-center p-4 cursor-pointer"
          onClick={handleSend}
        >
          Online:{" "}
          <span className="ml-2" ref={onlineRef}>
            0
          </span>
        </div>
      )}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
