"use client";

import { useEffect, useRef, useState } from "react";

export default function Selectors({ defaultValue, field, oldData }) {
  const [values, setValues] = useState(JSON.parse(defaultValue) ?? {});
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
    console.log(values);
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
      className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6"
      data-selectors=""
      data-key={field?.key}
      data-selector-default={field.selectors_default}
    >
      <textarea
        ref={textareaRef}
        name={field?.name}
        hidden={true}
        defaultValue={JSON.stringify(values)}
      ></textarea>

      <div className="flex gap-2 mb-6">
        <input
          ref={inputAddKeyRef}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập thuộc tính"
          onKeyDown={handleKeyDown}
          data-input-add-key=""
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          onClick={addNewKey}
          data-button-add-key=""
        >
          Thêm
        </button>
      </div>

      <div ref={selectorItemsRef} className="space-y-6" data-items="">
        {Object.entries(values).map(([key, data]) => (
          <div
            key={key}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
            data-key={key}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Key Information */}
              <div className="w-full lg:w-1/4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    placeholder="Tên thuộc tính"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={data.description || ""}
                    onChange={(e) => updateKeyDescription(key, e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khóa
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
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
                        className="bg-white p-3 border border-gray-200 rounded-md relative"
                      >
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Chọn
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                              className="mt-6 h-10 w-10 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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
                  className="flex-1 h-10 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  onClick={() => addSelector(key)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="flex-1 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
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
        ))}
      </div>
    </div>
  );
}
