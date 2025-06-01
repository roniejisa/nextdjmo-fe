"use client";
import { SocketContext } from "@/context/SocketProvider";
import { useContext, useEffect } from "react";

const ListUser = ({ ...props }) => {
  const { socketRef, sessionIdRef, addTypes } = useContext(SocketContext);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.sendEncode({
        type: "join-chat-room",
        data: {
          id: sessionIdRef.current,
        },
      });
    }
    addTypes("update-chat-room", (data) => {
      // console.log(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div {...props}>ListUser</div>;
};

export default ListUser;
