"use client";
import { useEffect, useId, useRef, useState } from "react";
import Text from "./repeat_fields/Text";
import Editor from "./repeat_fields/Editor";

const components = {
  text: Text,
  editor: Editor,
};

const Repeat = ({ field, item }) => {
  const [data, setData] = useState([]);
  const id = useId();
  const textareaRef = useRef(null);
  const dataMoveRef = useRef(null);

  const updateData = (e, id, itemField) => {
    setData((prev) => {
      const index = prev.findIndex((item) => item.id == id);
      if (index !== -1) {
        prev[index].data = {
          ...prev[index].data,
          [itemField.name]: e.target.value,
        };
      }
      return [...prev];
    });
  };

  useEffect(() => {
    textareaRef.current.value = JSON.stringify(
      data.map((item) => item.data),
      null,
      2
    );
  }, [data]);

  useEffect(() => {
    if (item && item?.[field.name]) {
      let jsonData;
      try {
        jsonData = JSON.parse(item?.[field.name] ?? "");
      } catch (e) {
        jsonData = [];
      }
      if (Array.isArray(jsonData)) {
        const dataOld = jsonData.map((item, index) => ({
          id: id + Date.now().toString() + index,
          fields: field.fields,
          data: item,
        }));

        setData(dataOld);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const dragEnd = (e) => {
    dataMoveRef.current = null;
    e.preventDefault();
  };

  const dragStart = (e, id) => {
    const index = data.findIndex((item) => item.id == id);
    if (index !== -1) dataMoveRef.current = data[index];

    // Tạo preview khi kéo
    const preview = document.createElement("div");
    preview.innerHTML = e.currentTarget.closest(".item-group").outerHTML;
    preview.style.position = "absolute";
    preview.style.top = "-9999px"; // Ẩn khỏi viewport
    preview.style.left = "-9999px";
    preview.style.backgroundColor = "white";
    preview.style.color = "black";
    preview.style.padding = "4px 8px";
    preview.style.border = "1px solid black";
    preview.style.borderRadius = "4px";
    preview.style.fontSize = "14px";
    document.body.appendChild(preview);

    // Gán preview vào drag event
    e.dataTransfer.setDragImage(preview, 0, 0);

    // Xóa preview sau sự kiện
    setTimeout(() => document.body.removeChild(preview), 0);
  };

  const dragOver = (e, id) => {
    e.preventDefault();
    if (!dataMoveRef.current) return;

    if (id === dataMoveRef.current.id) return;

    const index = data.findIndex((item) => item.id == id);
    if (index !== -1) {
      setData((prev) => {
        const indexMove = prev.findIndex(
          (item) => item.id == dataMoveRef.current.id
        );
        if (indexMove !== -1) {
          const itemMove = prev[indexMove];
          prev.splice(indexMove, 1);
          prev.splice(index, 0, itemMove);
        }
        return [...prev];
      });
    }
  };

  return (
    <div className="mt-4 mb-4 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        defaultValue={item?.[field.name] ?? ""}
      ></textarea>
      
      <div onDragEnd={dragEnd} className="space-y-4 relative z-10">
        {data.map((itemData) => (
          <div
            key={itemData.id}
            className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] transition-all duration-300 item-group"
            onDragOver={(e) => dragOver(e, itemData.id)}
          >
            <div className="p-4 flex gap-4 items-start">
              {itemData.fields.map((itemField, index) => {
                const Component = components[itemField.type];
                return (
                  <div key={index} className="flex-1">
                    <Component
                      field={itemField}
                      value={itemData.data[itemField.name]}
                      onChange={(e) => updateData(e, itemData.id, itemField)}
                      itemData={itemData}
                      item={item}
                      updateData={updateData}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                type="button"
                className="p-2 rounded-lg bg-gradient-to-br from-red-500/80 to-red-600/70 hover:from-red-600/90 hover:to-red-700/80 border border-white/30 shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.4)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] transform hover:scale-95 transition-all duration-200 text-white"
                onClick={() =>
                  setData((prev) => [
                    ...prev.filter((item) => item.id !== itemData.id),
                  ])
                }
                title="Xóa mục này"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
              
              <button
                type="button"
                className="p-2 rounded-lg bg-gradient-to-br from-slate-400/80 to-slate-500/70 hover:from-slate-500/90 hover:to-slate-600/80 border border-white/30 shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.4)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] transform hover:scale-95 transition-all duration-200 text-white cursor-move"
                onDragStart={(e) => dragStart(e, itemData.id)}
                draggable={true}
                title="Kéo để sắp xếp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 9l3 3l-3 3" />
                  <path d="M15 12h6" />
                  <path d="M6 9l-3 3l3 3" />
                  <path d="M3 12h6" />
                  <path d="M9 18l3 3l3 -3" />
                  <path d="M12 15v6" />
                  <path d="M15 6l-3 -3l-3 3" />
                  <path d="M12 3v6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        className="w-full mt-6 py-3 px-6 font-medium rounded-xl bg-gradient-to-br from-emerald-500/90 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-[0.99] transition-all duration-200 text-white relative z-10"
        onClick={() =>
          setData([
            ...data,
            {
              id: id + Date.now(),
              fields: field.fields,
              data: field.fields.reduce(
                (prev, item) => ({ ...prev, [item.name]: "" }),
                {}
              ),
            },
          ])
        }
      >
        + Thêm mục mới
      </button>
    </div>
  );
};

export default Repeat;