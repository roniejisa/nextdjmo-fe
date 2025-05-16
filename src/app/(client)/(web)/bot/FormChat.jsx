"use client";

import { useState } from "react";

const FormChat = ({ setTriggerEnter, setAction }) => {
  const [chatInput, setChatInput] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault()
    console.log(chatInput)
    if (chatInput.trim().toLowerCase() === "hello") {
      setTriggerEnter(true); // Avatar sẽ vào khung
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <textarea
        className="text-black"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      ></textarea>
      <button>Gửi</button>
    </form>
  );
};

export default FormChat;
