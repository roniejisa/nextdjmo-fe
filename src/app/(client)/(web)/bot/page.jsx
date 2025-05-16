"use client";

import { useState } from "react";
import AvatarCanvas from "./Avatar";
import ControlPanel from "./ControlPanel";
import FormChat from "./FormChat";

export default function HomePage() {
  const [action, setAction] = useState(null);
  const [triggerEnter, setTriggerEnter] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Bên trái: Avatar */}
      <div className="w-2/3 bg-black">
        <AvatarCanvas action={action} setAction={setAction} triggerEnter={triggerEnter} setTriggerEnter={setTriggerEnter}/>
      </div>

      {/* Bên phải: Các nút */}
      <div className="w-1/3 p-6 flex flex-col gap-4 justify-center items-center">
        <ControlPanel setAction={setAction} />
        <FormChat setTriggerEnter={setTriggerEnter} setAction={setAction}/>
      </div>
    </div>
  );
}
