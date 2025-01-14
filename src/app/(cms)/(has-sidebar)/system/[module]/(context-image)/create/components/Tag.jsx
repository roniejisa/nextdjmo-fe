import React, { useContext, useEffect, useRef, useState } from "react";
import { getData } from "./action";
import { AllContext } from "@/context/cms/AllProvider";

const Tag = ({ field, module }) => {
  const [tags, setTags] = useState(field.data || []);
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const preventBlur = useRef(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Quản lý dropdown
  const { updateField, setUpdateField } = useContext(AllContext);
  const textareaRef = useRef(null);
  const handleChangeValue = (e) => {
    setValue(e.target.value);
  };

  const getDataTag = async () => {
    const response = await getData(field.module, [field.module_label]);

    console.log(response);
    if (response.status == 200) {
      setTags((prev) => {
        const items = response.data.items;
        const newTags = items
          .filter((item) => !list.includes(item[field.module_label]))
          .map((item) => {
            return item[field.module_label];
          });

        return [...newTags];
      });
    }

    if (updateField == field.name) {
      setUpdateField(null);
    }
  };

  useEffect(() => {
    if (updateField && updateField == field.name) {
      getDataTag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField]);
  const handleBlur = (e) => {
    if (preventBlur.current) {
      preventBlur.current = false;
      return;
    }
    setDropdownVisible(false);
    setValue("");
  };

  const handleFocus = () => {
    inputRef.current.focus();
    setDropdownVisible(true);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = JSON.stringify(list);
    }
  }, [list]);
  return (
    <>
      <textarea
        defaultValue=""
        ref={textareaRef}
        name={field.name}
        hidden
      ></textarea>
      <div
        className="w-full py-2 px-4 border border-transparent flex gap-2 flex-wrap items-center rounded-lg relative transition bg-gray-100 
      focus-within:border-outline focus-within:bg-white"
        onClick={handleFocus}
        onBlur={handleBlur}
      >
        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <span
                key={index}
                className="bg-white border text-md p-1 rounded-md"
              >
                {item}
                <button
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    setList(list.filter((i) => i != item));
                    if (field.data.includes(item)) {
                      setTags([...tags, item]);
                    }
                  }}
                >
                  x
                </button>
              </span>
            );
          })
        ) : (
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 flex-1 block text-gray-200">
            {value ? "" : " Chọn Tag"}
          </span>
        )}
        <input
          type="text"
          ref={inputRef}
          className="bg-gray-100 focus:bg-white transition"
          value={value}
          onChange={handleChangeValue}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              setList((prev) => {
                if (prev.includes(value)) return prev;
                return [...prev, value];
              });
              setValue("");
            }
          }}
          style={{
            display: "inline-block",
            minWidth: "4px",
            width: `${value.length + 1}ch`,
            outlineColor: "transparent",
            outlineWidth: "0px",
            borderColor: "transparent",
            appearance: "none",
            padding: 0,
          }}
        />
        <div
          className="absolute bg-white p-4 rounded-lg left-0 top-full border w-full max-h-[200px] overflow-y-auto"
          style={{ display: isDropdownVisible ? "block" : "none" }}
          onMouseDown={() => (preventBlur.current = true)}
        >
          {tags.length > 0 ? (
            tags.map((item, index) => {
              return (
                <span
                  key={index}
                  className="block px-2 py-1 hover:font-bold transition"
                  onClick={() => {
                    setTags((prev) => {
                      const newTags = prev.filter((i) => i != item);
                      return [...newTags];
                    });
                    setList([...list, item]);
                  }}
                >
                  {item}
                </span>
              );
            })
          ) : (
            <>
              {value.length > 0 ? (
                <span
                  onMouseDown={() => (preventBlur.current = true)} // Ngăn blur
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded-md block"
                  onClick={(e) => {
                    e.preventDefault();

                    setList((prev) => {
                      if (prev.includes(value)) return prev;
                      return [...prev, value];
                    });
                    setValue("");
                  }}
                >
                  Tạo tag {'"'}
                  {value}
                  {'"'}
                </span>
              ) : (
                "Không còn tag nào!"
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Tag;
