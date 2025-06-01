import React, { useContext, useEffect, useRef, useState } from "react";
import { getData } from "./action";
import { AllContext } from "@/context/cms/AllProvider";

// Tag Item Component
const TagItem = ({ tag, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm">
    <span>{tag}</span>
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center justify-center w-4 h-4 bg-blue-200 hover:bg-red-500 text-blue-600 hover:text-white rounded-full transition-all duration-200 text-xs font-bold"
    >
      ×
    </button>
  </span>
);

// Dropdown Item Component
const DropdownItem = ({ item, onClick, isCreateNew = false }) => (
  <div
    className={`px-4 py-2.5 cursor-pointer transition-all duration-200 rounded-md mx-1 ${
      isCreateNew
        ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 text-green-700 font-medium"
        : "hover:bg-gray-50 text-gray-700"
    }`}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
  >
    {isCreateNew ? (
      <span>
        ✨ Tạo tag <strong>&quot;{item}&quot;</strong>
      </span>
    ) : (
      item
    )}
  </div>
);

// Main Input Container Component
const InputContainer = ({
  children,
  onClick,
  onBlur,
  isEmpty,
  placeholder,
}) => (
  <div
    className={`relative min-h-[48px] w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 cursor-text ${
      isEmpty
        ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300"
        : "bg-white border-gray-200 hover:border-gray-300"
    } focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-100/50`}
    onClick={onClick}
    onBlur={onBlur}
  >
    {children}
    {isEmpty && (
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">
        {placeholder}
      </span>
    )}
  </div>
);

// Dropdown Container Component
const DropdownContainer = ({ isVisible, children }) => (
  <div
    className={`absolute z-50 left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-200 ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
    style={{ display: isVisible ? "block" : "none" }}
  >
    <div className="max-h-64 overflow-y-auto py-2">{children}</div>
  </div>
);

const Tag = ({ field, module }) => {
  // State management
  const [tags, setTags] = useState(field.data || []);
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Refs
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const preventBlur = useRef(false);

  // Context
  const { updateField, setUpdateField } = useContext(AllContext);

  // Event handlers
  const handleChangeValue = (e) => {
    setValue(e.target.value);
  };

  const handleFocus = () => {
    inputRef.current?.focus();
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    if (preventBlur.current) {
      preventBlur.current = false;
      return;
    }
    setDropdownVisible(false);
    setValue("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setList(list.filter((item) => item !== tagToRemove));
    if (field.data.includes(tagToRemove)) {
      setTags([...tags, tagToRemove]);
    }
  };

  const handleAddTag = (tagToAdd) => {
    if (!list.includes(tagToAdd)) {
      setList([...list, tagToAdd]);
      setTags(tags.filter((tag) => tag !== tagToAdd));
    }
    setValue("");
    inputRef.current?.focus();
  };

  const handleCreateNewTag = () => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateNewTag();
    }
  };

  // Data fetching
  const getDataTag = async () => {
    try {
      const response = await getData(field.module, [field.module_label]);

      if (response.status === 200) {
        setTags((prev) => {
          const items = response.data.items;
          const newTags = items
            .filter((item) => !list.includes(item[field.module_label]))
            .map((item) => item[field.module_label]);
          return [...newTags];
        });
      }

      if (updateField === field.name) {
        setUpdateField(null);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Effects
  useEffect(() => {
    if (updateField && updateField === field.name) {
      getDataTag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = JSON.stringify(list);
    }
  }, [list]);

  // Computed values
  const hasSelectedTags = list.length > 0;
  const hasAvailableTags = tags.length > 0;
  const canCreateNewTag =
    value.trim().length > 0 && !list.includes(value.trim());

  return (
    <div className="relative">
      {/* Hidden textarea for form submission */}
      <textarea
        ref={textareaRef}
        name={field.name}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Main input container */}
      <InputContainer
        onClick={handleFocus}
        onBlur={handleBlur}
        isEmpty={!hasSelectedTags && !value}
        placeholder="🏷️ Chọn hoặc tạo tag mới"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Render selected tags */}
          {hasSelectedTags && (
            <div className="flex flex-wrap gap-2">
              {list.map((tag, index) => (
                <TagItem
                  key={index}
                  tag={tag}
                  onRemove={() => handleRemoveTag(tag)}
                />
              ))}
            </div>
          )}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChangeValue}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent border-0 outline-0 text-gray-700 placeholder-white"
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
            placeholder={hasSelectedTags ? "Thêm tag..." : ""}
          />
        </div>
      </InputContainer>

      {/* Dropdown */}
      <DropdownContainer isVisible={isDropdownVisible}>
        <div onMouseDown={() => (preventBlur.current = true)}>
          {hasAvailableTags ? (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Tag có sẵn
              </div>
              {tags.map((tag, index) => (
                <DropdownItem
                  key={index}
                  item={tag}
                  onClick={() => handleAddTag(tag)}
                />
              ))}
            </>
          ) : canCreateNewTag ? (
            <DropdownItem
              item={value}
              onClick={handleCreateNewTag}
              isCreateNew={true}
            />
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="font-medium">Không còn tag nào!</div>
              <div className="text-sm text-gray-400 mt-1">
                Nhập tên để tạo tag mới
              </div>
            </div>
          )}
        </div>
      </DropdownContainer>
    </div>
  );
};

export default Tag;
