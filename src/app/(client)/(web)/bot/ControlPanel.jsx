"use client";

export default function ControlPanel({setAction}) {
  const handleClick = (action) => {
    setAction(action)
    // TODO: Gửi sự kiện tới AvatarCanvas
  };

  return (
    <div className="flex flex-col gap-4 text-black">
      <button onClick={() => handleClick("jump")} className="btn">Nhảy</button>
      <button onClick={() => handleClick("dance")} className="btn">Hát</button>
      <button onClick={() => handleClick("wave")} className="btn">Chào</button>
      <button onClick={() => handleClick("talk")} className="btn">Nói chuyện</button>
    </div>
  );
}
