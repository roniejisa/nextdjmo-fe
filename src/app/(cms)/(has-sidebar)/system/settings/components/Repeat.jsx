"use client";
import { useEffect, useId, useRef, useState } from "react";
import Text from "./repeat_fields/Text";
import Editor from "./repeat_fields/Editor";
import ImageComponent from "./repeat_fields/Image";

const components = {
  text: Text,
  editor: Editor,
  image: ImageComponent,
};
const Repeat = ({ field, defaultValue, item }) => {
  field.fields = JSON.parse(item.setting_json) || [];
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
    if (item.data) {
      let jsonData;
      try {
        jsonData = JSON.parse(item.data);
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
  }, []);

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
    <>
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        defaultValue={defaultValue || ""}
      ></textarea>
      <div className="flex-1">
        <div onDragEnd={dragEnd} className="flex flex-wrap -mx-2">
          {data.map((itemData) => (
            <div
              key={itemData.id}
              className="mb-1 flex flex-col p-2 flex-[0_0_calc(100%/2)] px-2 relative gap-2 rounded-md item-group"
              onDragOver={(e) => dragOver(e, itemData.id)}
            >
              <div className="border rounded-md p-2">
                {itemData.fields.map((itemField, index) => {
                  const Component = components[itemField.type];
                  return (
                    <div key={index} className="">
                      <Component
                        field={itemField}
                        defaultValue={itemData.data[itemField.name]}
                        onChange={(e) => updateData(e, itemData.id, itemField)}
                        itemData={itemData}
                        updateData={updateData}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  className="border rounded-md"
                  onClick={() =>
                    setData((prev) => [
                      ...prev.filter((item) => item.id !== itemData.id),
                    ])
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                  className="border rounded-md"
                  onDragStart={(e) => dragStart(e, itemData.id)}
                  draggable={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
          className="w-full border p-2 flex-[0_0_50px] rounded-md"
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
          + Thêm
        </button>
      </div>
    </>
  );
};

export default Repeat;
