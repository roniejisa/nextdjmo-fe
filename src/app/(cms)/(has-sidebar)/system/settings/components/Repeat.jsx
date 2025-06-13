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
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const id = useId();
  const textareaRef = useRef(null);

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

  const handleDragStart = (e, itemData, index) => {
    setDraggedItem({ item: itemData, index });
    e.dataTransfer.effectAllowed = "move";
    
    // Tạo drag image hiện đại
    const dragElement = e.currentTarget;
    const rect = dragElement.getBoundingClientRect();
    
    // Clone element và style cho drag preview
    const dragPreview = dragElement.cloneNode(true);
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "-9999px";
    dragPreview.style.left = "-9999px";
    dragPreview.style.width = rect.width + "px";
    dragPreview.style.transform = "rotate(5deg) scale(0.95)";
    dragPreview.style.opacity = "0.9";
    dragPreview.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
    dragPreview.style.borderRadius = "12px";
    
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, rect.width / 2, rect.height / 2);
    
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      setData(prev => {
        const newData = [...prev];
        const draggedElement = newData[draggedItem.index];
        
        // Remove dragged item
        newData.splice(draggedItem.index, 1);
        
        // Insert at new position
        const adjustedIndex = draggedItem.index < dropIndex ? dropIndex - 1 : dropIndex;
        newData.splice(adjustedIndex, 0, draggedElement);
        
        return newData;
      });
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const deleteItem = (itemId) => {
    setData(prev => prev.filter(item => item.id !== itemId));
  };

  const addNewItem = () => {
    const newItem = {
      id: id + Date.now(),
      fields: field.fields,
      data: field.fields.reduce(
        (prev, item) => ({ ...prev, [item.name]: "" }),
        {}
      ),
    };
    setData(prev => [...prev, newItem]);
  };

  return (
    <div className="space-y-6">
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        defaultValue={defaultValue || ""}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((itemData, index) => (
          <div
            key={itemData.id}
            className={`
              group relative bg-white rounded-xl border-2 transition-all duration-300 ease-out
              ${draggedItem?.index === index 
                ? 'opacity-50 border-blue-300 shadow-lg transform scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
              ${dragOverIndex === index 
                ? 'border-blue-400 bg-blue-50 transform scale-102 shadow-lg' 
                : ''
              }
            `}
            draggable
            onDragStart={(e) => handleDragStart(e, itemData, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Indicator */}
            <div className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col space-y-1 cursor-grab active:cursor-grabbing">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pl-10">
              <div className="space-y-4">
                {itemData.fields.map((itemField, fieldIndex) => {
                  const Component = components[itemField.type];
                  return (
                    <div key={fieldIndex}>
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
            </div>

            {/* Action Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                type="button"
                onClick={() => deleteItem(itemData.id)}
                className="
                  w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 
                  text-red-600 hover:text-red-700 transition-all duration-200
                  flex items-center justify-center shadow-sm hover:shadow-md
                  transform hover:scale-110 active:scale-95
                "
                title="Xóa item"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>

            {/* Drag Drop Indicator */}
            {dragOverIndex === index && (
              <div className="absolute inset-0 rounded-xl border-2 border-blue-400 bg-blue-50/50 flex items-center justify-center pointer-events-none">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Thả vào đây
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addNewItem}
        className="
          w-full h-16 border-2 border-dashed border-gray-300 hover:border-blue-400
          rounded-xl text-gray-600 hover:text-blue-600 font-medium
          bg-gray-50 hover:bg-blue-50 transition-all duration-300
          flex items-center justify-center space-x-2
          hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]
        "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <span>Thêm mục mới</span>
      </button>
    </div>
  );
};

export default Repeat;