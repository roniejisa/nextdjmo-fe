"use client";
import React, { useContext, useEffect, useState } from "react";
import useRouterCustom from "@/packages/translation/Navigation";
import { SocketContext } from "@/context/SocketProvider";
import { useNotify } from "@/context/NotifyProvider";
const HomePage = () => {
  const navigate = useRouterCustom();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const { socketRef, sessionIdRef, addTypes } = useContext(SocketContext);
  const notify = useNotify();

  useEffect(() => {
    addTypes("create-room", (data) => {
      console.log(data);
      navigate.push(`/play/${data.room_id}`);
    });

    addTypes("request-join-room", (data) => {
      if (data.error) {
        notify.changeNotify("error", data.message);
        return;
      }
      navigate.push(`/play/${data.room_id}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleShowCreateRoom = () => {
    setShowCreateRoom(true);
  };
  const handleShowJoinRoom = () => {
    setShowJoinRoom(true);
  };

  const handleSubmitJoinRoom = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    socketRef.current.sendEncode({
      type: "request-join-room",
      data: {
        ...data,
        id: sessionIdRef.current,
      },
    });
  };

  const handleSubmitCreateRoom = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    socketRef.current.sendEncode({
      type: "create-room",
      data: {
        ...data,
        id: sessionIdRef.current,
      },
    });
  };

  return (
    <div>
      {!showCreateRoom && !showJoinRoom && (
        <div className="h-screen flex justify-center items-center space-x-2">
          <button
            onClick={handleShowCreateRoom}
            className="bg-red-500 rounded-md p-2 text-white"
          >
            Tạo phòng
          </button>
          <button
            onClick={handleShowJoinRoom}
            className="bg-blue-500 rounded-md p-2 text-white"
          >
            Vào phòng
          </button>
        </div>
      )}
      {showJoinRoom && (
        <div className="h-screen flex justify-center items-center space-x-2">
          <form onSubmit={handleSubmitJoinRoom}>
            <div>
              <label className="block">Tên người chơi</label>
              <input type="text" name="name" placeholder="Tên người chơi" />
            </div>
            <div>
              <label className="block">ID phòng</label>
              <input type="text" name="roomId" placeholder="ID phòng" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowJoinRoom(false)}
                className="bg-red-500 rounded-md p-2 text-white"
              >
                Đóng
              </button>
              <button>Vào phòng</button>
            </div>
          </form>
        </div>
      )}
      {showCreateRoom && (
        <div className="h-screen flex justify-center items-center space-x-2">
          <form onSubmit={handleSubmitCreateRoom}>
            <div>
              <label className="block">Tên người chơi</label>
              <input
                name="name"
                type="text"
                placeholder="Tên người chơi"
                className="border p-1"
              />
            </div>
            <div>
              <label className="block">Số tiền Bet</label>
              <input
                name="bet"
                type="text"
                placeholder="Số tiền bet"
                className="border p-1"
              />
            </div>
            <div>
              <label className="block">Tổng số tiền</label>
              <input
                type="text"
                placeholder="Số tiền"
                className="border p-1"
                name="total"
              />
            </div>
            <div className="flex gap-4 mt-5">
              <button className="bg-blue-500 rounded-md p-2 text-white">
                Tạo phòng
              </button>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="bg-red-500 rounded-md p-2 text-white"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
