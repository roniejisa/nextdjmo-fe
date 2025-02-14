import React from "react";
import Chat from "./Chat";
import MessageProvider from "@/context/cms/MessageProvider";
import ListUser from "./ListUser";
import Message from "./Message";

const ChatPage = () => {
  return (
    <MessageProvider>
      <div className="grid grid-cols-12">
        <ListUser className="col-span-2 border-r p-4" />
        <div className="col-span-10">
          <Message />
          <Chat />
        </div>
      </div>
    </MessageProvider>
  );
};

export default ChatPage;
