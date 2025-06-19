"use client";

import { useEffect, useRef, useState } from "react";

export default function Selectors({ value, field, item }) {
  const [values, setValues] = useState(value ? JSON.parse(value) : {});
  const inputAddKeyRef = useRef(null);
  const selectorItemsRef = useRef(null);
  const isInitialRender = useRef(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      renderDefaultSelectors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This effect updates the hidden textarea whenever values change
  useEffect(() => {
    if (textareaRef.current && Object.keys(values).length > 0) {
      textareaRef.current.value = JSON.stringify(values);
    }
  }, [values]);

  // Generate a random ID
  const randomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Render default selectors from config
  const renderDefaultSelectors = () => {
    if (field?.selectors_default && Object.keys(values).length === 0) {
      const defaultSelectors = field?.selectors_default;
      const newValues = { ...values };

      defaultSelectors.forEach((selector) => {
        const key = selector.trim();
        if (key) {
          newValues[key] = {
            description: "",
            selectors: {
              [randomId()]: { selector: "", type: "1" },
            },
          };
        }
      });

      setValues(newValues);
    }
  };

  // Add a new key
  const addNewKey = () => {
    if (!inputAddKeyRef.current) return;

    const key = inputAddKeyRef.current.value.trim();
    if (!key) return;

    setValues((prev) => ({
      ...prev,
      [key]: {
        description: "",
        selectors: {
          [randomId()]: { selector: "", type: "1" },
        },
      },
    }));

    inputAddKeyRef.current.value = "";
  };

  // Add a new selector to a key
  const addSelector = (key) => {
    setValues((prev) => {
      const updated = { ...prev };
      const keyData = updated[key] || { selectors: {} };
      const selectors = keyData.selectors || {};

      updated[key] = {
        ...keyData,
        selectors: {
          ...selectors,
          [randomId()]: { selector: "", type: "1" },
        },
      };

      return updated;
    });
  };

  // Remove a selector from a key
  const removeSelector = (key, selectorId = null) => {
    setValues((prev) => {
      const updated = { ...prev };
      const keyData = updated[key];

      if (!keyData || !keyData.selectors) return prev;

      const selectors = { ...keyData.selectors };

      if (selectorId) {
        // Remove specific selector
        delete selectors[selectorId];
      } else {
        // Remove last selector
        const ids = Object.keys(selectors);
        if (ids.length > 0) {
          delete selectors[ids[ids.length - 1]];
        }
      }

      // If no selectors left, remove the key entirely
      if (Object.keys(selectors).length === 0) {
        delete updated[key];
        return updated;
      }

      updated[key] = {
        ...keyData,
        selectors,
      };

      return updated;
    });
  };

  // Remove an entire key
  const removeKey = (key) => {
    setValues((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Update selector data
  const updateSelectorData = (key, selectorId, field, value) => {
    setValues((prev) => {
      const updated = { ...prev };
      if (!updated[key]?.selectors?.[selectorId]) return prev;

      updated[key] = {
        ...updated[key],
        selectors: {
          ...updated[key].selectors,
          [selectorId]: {
            ...updated[key].selectors[selectorId],
            [field]: value,
          },
        },
      };

      return updated;
    });
  };

  // Update key description
  const updateKeyDescription = (key, description) => {
    setValues((prev) => {
      const updated = { ...prev };
      if (!updated[key]) return prev;

      updated[key] = {
        ...updated[key],
        description,
      };

      return updated;
    });
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewKey();
    }
  };

  return (
    <div
      className="mt-4 mb-4 p-6 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"
      data-selectors=""
      data-key={field?.key}
      data-selector-default={field.selectors_default}
    >
      <textarea
        ref={textareaRef}
        name={field?.name}
        hidden={true}
        value={JSON.stringify(values)}
      ></textarea>

      <div className="flex gap-3 mb-6 relative z-10">
        <input
          ref={inputAddKeyRef}
          className="flex-1 px-4 py-3 rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] focus:outline-none transition-all duration-200 placeholder-gray-500"
          placeholder="Nhập thuộc tính"
          onKeyDown={handleKeyDown}
          data-input-add-key=""
        />
        <button
          type="button"
          className="px-6 py-3 font-medium rounded-xl bg-gradient-to-br from-emerald-500/90 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/80 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] transform hover:scale-[0.99] transition-all duration-200 text-white"
          onClick={addNewKey}
          data-button-add-key=""
        >
          Thêm
        </button>
      </div>

      <div ref={selectorItemsRef} className="space-y-6 relative z-10" data-items="">
        {Object.entries(values).map(([key, data]) => (
          <div
            key={key}
            className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-white/60 to-white/30 border border-white/40 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] transition-all duration-300"
            data-key={key}
          >
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Key Information */}
                <div className="w-full lg:w-1/4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      placeholder="Tên thuộc tính"
                      className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-gradient-to-br from-white/70 to-white/40 border border-white/50 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.8)] focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] focus:outline-none transition-all duration-200"
                      value={data.description || ""}
                      onChange={(e) => updateKeyDescription(key, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khóa
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-gradient-to-br from-gray-100/70 to-gray-200/50 border border-white/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] text-gray-600 cursor-not-allowed"
                      disabled
                      placeholder="Thuộc tính"
                      value={key}
                    />
                  </div>
                </div>

                {/* Selectors */}
                <div
                  className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4"
                  data-item-selectors=""
                >
                  {data.selectors &&
                    Object.entries(data.selectors).map(
                      ([selectorId, selectorData]) => (
                        <div
                          key={selectorId}
                          className="relative overflow-hidden rounded-lg backdrop-blur-sm bg-gradient-to-br from-white/80 to-white/50 border border-white/60 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.8)] p-3"
                        >
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chọn
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 rounded-md backdrop-blur-sm bg-gradient-to-br from-white/70 to-white/40 border border-white/50 shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_1px_rgba(255,255,255,0.8)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none transition-all duration-200"
                                placeholder="p, .content,..."
                                value={selectorData.selector || ""}
                                onChange={(e) =>
                                  updateSelectorData(
                                    key,
                                    selectorId,
                                    "selector",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Loại
                                </label>
                                <select
                                  className="w-full px-3 py-2 rounded-md backdrop-blur-sm bg-gradient-to-br from-white/70 to-white/40 border border-white/50 shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_1px_rgba(255,255,255,0.8)] focus:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none transition-all duration-200"
                                  value={selectorData.type}
                                  onChange={(e) =>
                                    updateSelectorData(
                                      key,
                                      selectorId,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="1">CSS</option>
                                  <option value="2">XPath</option>
                                </select>
                              </div>
                              <button
                                type="button"
                                className="mt-6 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-500/80 to-red-600/70 hover:from-red-600/90 hover:to-red-700/80 border border-white/30 shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.4)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] transform hover:scale-95 transition-all duration-200 text-white font-bold text-lg"
                                onClick={() => removeSelector(key, selectorId)}
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                </div>

                {/* Actions */}
                <div
                  className="w-full lg:w-1/12 flex lg:flex-col gap-2"
                  data-item-actions=""
                >
                  <button
                    type="button"
                    className="flex-1 h-10 max-h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/80 to-emerald-600/70 hover:from-emerald-600/90 hover:to-emerald-700/80 border border-white/30 shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.4)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] transform hover:scale-95 transition-all duration-200 text-white font-bold text-lg"
                    onClick={() => addSelector(key)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="flex-1 h-10 max-h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/80 to-amber-600/70 hover:from-amber-600/90 hover:to-amber-700/80 border border-white/30 shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_3px_rgba(255,255,255,0.4)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] transform hover:scale-95 transition-all duration-200 text-white font-bold text-lg"
                    onClick={() => {
                      const selectorsCount = Object.keys(
                        data.selectors || {}
                      ).length;
                      if (selectorsCount <= 1) {
                        removeKey(key);
                      } else {
                        removeSelector(key);
                      }
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}