"use client";
import { useEffect, createContext, useRef, useState } from "react";
import { encryptData, decryptData } from "@/utils/socket/utils";

const TIMEOUT = 999999;

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  // Socket connection state - dùng useState để trigger re-render khi cần
  const [socketOn, setSocketOn] = useState(false);
  
  // Các refs khác vẫn giữ nguyên
  const socketRef = useRef(null);
  const sessionIdRef = useRef(null);
  const onlineCountRef = useRef(0);
  
  // Ref để lưu DOM element của indicator
  const indicatorRef = useRef(null);
  const onlineRef = useRef(null);
  
  const typeRef = useRef({
    "update-count": (data) => {
      onlineCountRef.current = data.count;
      // Update DOM trực tiếp
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

  // Function để update socket status
  const updateSocketStatus = (isConnected) => {
    setSocketOn(isConnected); // Sử dụng setState thay vì ref
    
    // Update DOM trực tiếp cho indicator
    if (isConnected) {
      if (!indicatorRef.current) {
        createIndicator();
      }
    } else {
      if (indicatorRef.current) {
        indicatorRef.current.remove();
        indicatorRef.current = null;
      }
    }
    
    // Dispatch custom event để các component khác có thể listen
    if (isConnected) {
      window.dispatchEvent(new CustomEvent("connect-socket-success"));
    }
  };

  const createIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'fixed z-[999] bottom-0 right-10 rounded-md rounded-bl-none rounded-br-none border-b-0 bg-white border border-blue-700 flex justify-center p-4 cursor-pointer';
    indicator.innerHTML = `Online: <span class="ml-2">${onlineCountRef.current}</span>`;
    
    const span = indicator.querySelector('span');
    onlineRef.current = span;
    
    indicator.addEventListener('click', handleSend);
    document.body.appendChild(indicator);
    indicatorRef.current = indicator;
  };

  const connectSocket = () => {
    if (
      (!socketRef.current ||
        socketRef.current.readyState === WebSocket.CLOSED) &&
      sessionIdRef.current
    ) {
      socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL);
      
      socketRef.current.onopen = () => {
        updateSocketStatus(true);
        alertConnectSocket();
      };

      socketRef.current.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(decryptData(event.data));
          console.log(type, data)
          if (
            typeRef.current &&
            type &&
            typeof typeRef.current === "object" &&
            typeof typeRef.current[type] === "function"
          ) {
            typeRef.current[type](data);
          }
        } catch (error) {
          console.error("Parse message error:", error);
        }
      };

      socketRef.current.onclose = () => {
        socketRef.current = null;
        updateSocketStatus(false);
        setTimeout(() => {
          if (sessionIdRef.current) connectSocket();
        }, TIMEOUT);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket Error", error);
        updateSocketStatus(false);
      };

      socketRef.current.sendEncode = (obj) => {
        try {
          if (typeof socketRef.current?.send === "function") {
            socketRef.current.send(encryptData(obj));
          }
        } catch (error) {
          console.error("Socket send error:", error);
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

  const checkNoInternet = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
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

  const setSessionId = (id) => {
    sessionIdRef.current = id;
  };

  const addTypes = (type, callback) => {
    typeRef.current = { ...typeRef.current, [type]: callback };
  };

  const removeTypes = (type) => {
    delete typeRef.current[type];
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

  // Get current online count without causing re-render
  const getCurrentOnlineCount = () => onlineCountRef.current;

  useEffect(() => {
    window.addEventListener("online", connectSocket);
    window.addEventListener("offline", checkNoInternet);
    window.addEventListener("beforeunload", disconnectWeb);
    
    return () => {
      window.removeEventListener("online", connectSocket);
      window.removeEventListener("offline", checkNoInternet);
      window.removeEventListener("beforeunload", disconnectWeb);
      
      // Cleanup indicator
      if (indicatorRef.current) {
        indicatorRef.current.remove();
      }
    };
  }, []);

  // Context value - socketOn là state, các khác là ref/function
  const contextValue = {
    socketOn,           // State - sẽ trigger re-render
    socketRef,          // Ref
    typeRef,            // Ref
    sessionIdRef,       // Ref
    addTypes,           // Function
    removeTypes,        // Function
    setSessionId,       // Function
    connectSocket,      // Function
    getCurrentOnlineCount, // Function để lấy count mà không trigger re-render
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;