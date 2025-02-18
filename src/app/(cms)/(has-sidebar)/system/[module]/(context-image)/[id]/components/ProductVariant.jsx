"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageComponent from "./product_variant/Image";
import { makeId } from "@/utils/client/util";
import {
  generateCombinations,
  generateKey,
  sortData,
} from "@/utils/client/variant";
import MinusIcon from "@/components/Icon/svg/MinusIcon";
import PlusIcon from "@/components/Icon/svg/PlusIcon";
import TrashIcon from "@/components/Icon/svg/TrashIcon";
import DragIcon from "@/components/Icon/svg/DragIcon";
import CloseIcon from "@/components/Icon/svg/Close";
/**
 * 1. Ấn vào nút thêm chưa có dữ liệu thì phải nhập
 *
 *
 *
 *
 *
 */

const ProductVariant = ({ field, item, defaultValue }) => {
  const [hasVariant, setHasVariant] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [activeVariant, setActiveVariant] = useState(
    field.active_variant == "active"
  );
  const [listAttribute, setListAttribute] = useState([]);
  const [data, setData] = useState([]);
  const oldData = useRef(null);
  const textareaRef = useRef(null);
  const dataMoveRef = useRef(null);
  const firstAttributeLength = useRef(0);
  const oldValue = useRef(null);
  const inputAddAttributeRef = useRef(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const suggestionRef = useRef(null);
  const [productAttributes, setProductAttributes] = useState([]);
  useEffect(() => {
    if (data.length > 0) {
      const all = {
        data,
        listAttribute,
      };
      textareaRef.current.value = JSON.stringify(all);
    } else {
      textareaRef.current.value = "";
    }
  }, [data, listAttribute]);

  useEffect(() => {
    try {
      oldData.current = JSON.parse(defaultValue);
    } catch (e) {}
    if (
      oldData.current &&
      "data" in oldData.current &&
      "listAttribute" in oldData.current &&
      oldData.current.listAttribute.length > 0
    ) {
      setHasVariant(true);
      setListAttribute(oldData.current.listAttribute);
      setProductAttributes(
        field.data_product_attributes.filter(
          (item) =>
            !oldData.current.listAttribute.some(
              (attribute) => attribute.name == item.name
            )
        )
      );
    } else if (oldData.current && "data" in oldData.current) {
      setData([...oldData.current.data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Add Event
  const showProductAttributeAvailable = (e) => {
    setShowSuggestion(true);

    // Kiểm tra nếu click bên ngoài dropdown
    setProductAttributes((prev) => {
      let newList = field.data_product_attributes.filter(
        (item) =>
          !listAttribute.some(
            (attr) => attr.name.toLowerCase() === item.name.toLowerCase()
          )
      );

      newList = newList.filter((item) => {
        return item.name.toLowerCase().includes(attribute);
      });

      return [...newList];
    });
  };

  const hiddenProductAttributeAvailable = (e) => {
    setShowSuggestion(false);
  };
  const handleClickOutside = (event) => {
    // Kiểm tra nếu click bên ngoài dropdown
    if (
      showSuggestion &&
      suggestionRef.current &&
      !event.target.contains(suggestionRef.current)
    ) {
      setShowSuggestion(false);
    }
  };

  useEffect(() => {
    if (showSuggestion) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuggestion]);

  const addAttribute = () => {
    // Cần kiểm tra xem attribute này đã tồn tại chưa
    if (attribute.trim() === "" || /^\d/.test(attribute.trim()))
      return inputAddAttributeRef.current.focus();
    setListAttribute((prev) => {
      const exists = prev.some((item) => item.name === attribute);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: makeId(8),
          name: attribute,
          values: [
            {
              id: makeId(8),
              placeholder: "Giá trị",
              value: "",
            },
          ],
        },
      ];
    });
    setAttribute("");
  };

  useEffect(() => {
    if (listAttribute.length > 0) {
      const newData = generateCombinations(listAttribute);
      const listData = sortData(newData);

      // Tạo key duy nhất cho từng phần tử từ listAttribute

      setData((prev) => {
        if (prev.length === 0 && oldData.current) {
          prev = oldData.current.data;
        }
        const newListData = listData.map((item) => {
          const key = generateKey(item);
          const oldData = prev.find((prevItem) => {
            const dataKey = generateKey(prevItem);
            if (key.length > dataKey.length) {
              return key.includes(dataKey);
            } else {
              return dataKey.includes(key);
            }
          });
          const getKeyOfFirstAttribute = listAttribute[0].name;
          const getItemOldHasImage = prev.find(
            (prevItem) =>
              prevItem[getKeyOfFirstAttribute] ===
                item[getKeyOfFirstAttribute] && prevItem.image
          );
          if (!oldData)
            return {
              price: "",
              stock: 0,
              sku: "",
              image: getItemOldHasImage ? getItemOldHasImage.image : "",
              ...item,
            };
          return {
            ...item,
            price: oldData.price ?? "",
            stock: oldData.stock ?? 0,
            sku: oldData.sku ?? "",
            image: getItemOldHasImage ? getItemOldHasImage.image : "",
          };
        });
        return newListData;
      });
      setProductAttributes(() => {
        const newProductAttributes = field.data_product_attributes.filter(
          (item) => {
            return !listAttribute.some(
              (attr) => attr.name.toLowerCase() === item.name.toLowerCase()
            );
          }
        );
        return [...newProductAttributes];
      });
    } else if (hasVariant) {
      setData([]);
      setProductAttributes(field.data_product_attributes);
    }

    firstAttributeLength.current = listAttribute.reduce((acc, item, index) => {
      if (index) {
        if (!acc) {
          acc = item.values.length - (item.values.length > 1 ? 1 : 0);
        } else {
          const length = item.values.filter((item) => item.value).length;
          const number = length > 1 ? length : 1;
          acc *= number;
        }
      }
      return acc;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAttribute]);

  const addValue = (index) => {
    setListAttribute((prev) => {
      const newList = [...prev]; // Tạo bản sao mới của mảng `prev`
      newList[index] = {
        ...newList[index], // Sao chép object tại vị trí `index`
        values: [
          ...(newList[index].values || []), // Sao chép danh sách giá trị hiện tại
          {
            id: makeId(8),
            placeholder: "Giá trị",
            value: "",
          },
        ],
      };
      return newList;
    });
  };

  const changeNameAttribute = (e, index) => {
    const value = e.target.value.trim();
    if (/^\d/.test(value)) return;
    setListAttribute((prev) => {
      const newList = [...prev]; // Tạo bản sao của mảng `prev`
      newList[index] = {
        ...newList[index], // Sao chép object tại vị trí `index`
        name: e.target.value,
      };
      return newList;
    });
  };

  // START: DRAG AND DROP
  const dragEnd = (e) => {
    dataMoveRef.current = null;
    e.preventDefault();
  };

  const dragStart = (e, index, indexValue) => {
    dataMoveRef.current = listAttribute[index].values[indexValue];
    dataMoveRef.current.index = indexValue;
    dataMoveRef.current.attribute_id = index;

    // Tạo preview khi kéo
    // Lấy phần tử mà sự kiện đang được gắn vào
    const draggedItem = e.target.closest(".item-group");

    // Tạo một bản sao của phần tử gốc
    const preview = draggedItem.cloneNode(true); // clone lại phần tử

    // Cập nhật style cho preview để hiển thị đúng như khi kéo
    preview.style.position = "absolute";
    preview.style.top = `${e.clientY}px`; // Đặt vị trí trên viewport khi bắt đầu kéo
    preview.style.left = `${e.clientX}px`;
    preview.style.zIndex = "1000"; // Đảm bảo rằng preview luôn ở trên các phần tử khác
    preview.style.pointerEvents = "none"; // Đảm bảo không gây cản trở cho các sự kiện khác
    preview.style.opacity = "0.5"; // Giảm độ mờ để làm nổi bật phần tử đang kéo

    // Thêm preview vào body
    document.body.appendChild(preview);

    // Đặt preview làm drag image
    e.dataTransfer.setDragImage(
      preview,
      e.clientX - draggedItem.getBoundingClientRect().left - 50,
      e.clientY - draggedItem.getBoundingClientRect().top
    );

    // Xóa preview sau sự kiện
    setTimeout(() => document.body.removeChild(preview), 0);
  };
  // END: DRAG AND DROP

  const dragOver = (e, index, indexNew) => {
    e.stopPropagation();
    e.preventDefault();
    if (!dataMoveRef.current) return;
    const indexOld = dataMoveRef.current.index;
    const attributeOld = dataMoveRef.current.attribute_id;
    // Lấy chiều cao và vị trí của phần tử
    // Lấy phần tử mà sự kiện được gắn vào (currentTarget)
    const draggingElement = e.currentTarget;

    if (!draggingElement || attributeOld !== index) return;
    const rect = draggingElement.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;

    // Kiểm tra xem con trỏ chuột có ở ganes giữa hay không
    const isNearMiddle = Math.abs(e.clientY - middleY) < rect.height / 4; // Khoảng cách cách giữa nhỏ hơn 1/4 chiều cao phần tử

    if (isNearMiddle && indexOld !== indexNew) {
      setListAttribute((prev) => {
        const newList = [...prev]; // Tạo bản sao của mảng `prev`
        const listIndexCurrent = [...newList[index].values]; // Tạo bản sao mảng values
        const valueMove = listIndexCurrent[indexOld];
        listIndexCurrent.splice(indexOld, 1);
        listIndexCurrent.splice(indexNew, 0, valueMove);
        newList[index] = {
          ...newList[index], // Sao chép object tại vị trí `index`
          values: listIndexCurrent,
        };
        //  Cập nhật xong thì phải thay cái được cập nhật vào đây thì mới không nhảy
        dataMoveRef.current.index = indexNew;
        return newList;
      });
    }
  };

  const handleChangeValue = (e, index, indexValue) => {
    const valuesLength = listAttribute[index].values.length;

    if (valuesLength - 1 == indexValue && e.target.value.trim() !== "") {
      addValue(index);
    }

    setListAttribute((prev) => {
      prev[index].values[indexValue].value = e.target.value;
      return [...prev];
    });
  };

  const deleteAttribute = (index) => {
    setListAttribute((prev) => {
      const newList = [...prev];
      newList.splice(index, 1);
      return [...newList];
    });
  };

  const changeData = (e, index, key) => {
    let value = e.target.value.trim();
    switch (key) {
      case "stock":
      case "price":
        if (isNaN(value) || Number(value) <= 0) {
          value = value.replace(/[^0-9.]/g, ""); // Loại bỏ các ký tự không phải số hoặc dấu chấm
        }
        value = value > 0 ? value : 0;
        break;
    }
    setData((prev) => {
      const newData = [...prev];
      newData[index][key] = value;
      return newData;
    });
  };

  const upImageForData = (imageData, attrName, value) => {
    const newData = data.map((item) => {
      if (item[attrName] == value) {
        item.image = imageData;
      }
      return item;
    });
    setData(newData);
  };

  const deleteAttributeValue = (index, indexValue) => {
    // Kiểm tra nếu là phần tử cuối sẽ không xóa
    if (indexValue == listAttribute[index].values.length - 1) return;
    const values = listAttribute[index].values.filter(
      (item, i) => i !== indexValue
    );
    // Kiểm tra nếu rỗng thì xóa luôn
    if (values.length == 0) return deleteAttribute(index);
    setListAttribute((prev) => {
      prev[index].values = values;
      return [...prev];
    });
  };

  const changeStock = (e) => {
    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.stock = e.target.value;
      return [...prev];
    });
  };

  const handleChangeSku = (e) => {
    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.sku = e.target.value;
      return [...prev];
    });
  };

  const handleChangePrice = (e) => {
    setData((prev) => {
      if (!prev.length) prev.push({});
      const obj = prev[0];
      obj.price = e.target.value;
      return [...prev];
    });
  };

  const handleChangeValueAttribute = (e) => {
    const value = e.target.value;
    setProductAttributes((prev) => {
      let newList = field.data_product_attributes.filter(
        (item) =>
          !listAttribute.some(
            (attr) => attr.name.toLowerCase() === item.name.toLowerCase()
          )
      );
      newList = newList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      return [...newList];
    });
    if (/^\d/.test(value)) return;
    setAttribute(value);
  };
  return (
    <>
      <textarea name={field.name} hidden ref={textareaRef}></textarea>
      {activeVariant && (
        <>
          <label
            htmlFor={field.name}
            className={`border border-double flex items-center transition-all duration-300 justify-center rounded-md cusor-pointer gap-2 p-2 cursor-pointer w-fit mb-2 ${
              hasVariant
                ? "border-red-100 bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
                : "border-green-100 bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600"
            }`}
          >
            {hasVariant ? (
              <>
                <MinusIcon />
                Hủy phân loại
              </>
            ) : (
              <>
                <PlusIcon />
                Thêm phân loại
              </>
            )}
          </label>
          <input
            type="checkbox"
            id={field.name}
            hidden
            onChange={(e) => setHasVariant(e.target.checked)}
          />
        </>
      )}
      {hasVariant ? (
        <div>
          <div className="flex border p-2 gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                data-name="attribute"
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
                value={attribute}
                onChange={handleChangeValueAttribute}
                placeholder="Thuộc tính"
                ref={inputAddAttributeRef}
                onFocus={showProductAttributeAvailable}
                onBlur={hiddenProductAttributeAvailable}
                autoComplete="off"
              />
              {productAttributes.length > 0 && showSuggestion && (
                <div
                  className="absolute top-10 left-0 w-full bg-white z-10"
                  ref={suggestionRef}
                >
                  {productAttributes.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setAttribute(item.name);
                        setShowSuggestion(false);
                        setProductAttributes((prev) => {
                          let newList = field.data_product_attributes.filter(
                            (item, indexAttribute) => indexAttribute != index
                          );
                          newList = newList.filter(
                            (item) =>
                              !listAttribute.some(
                                (attr) => attr.name == item.name
                              )
                          );
                          return [...newList];
                        });
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={addAttribute} tabIndex="-1">
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap flex-col gap-2">
            {listAttribute.map((item, index) => (
              <div
                className="p-2 pr-16 relative border"
                key={index}
                onDragEnd={dragEnd}
              >
                <button
                  type="button"
                  onClick={(e) => deleteAttribute(index)}
                  className="absolute top-2 right-2"
                >
                  <CloseIcon />
                </button>
                <input
                  type="text"
                  className="w-full outline-outline outline-4 transition border rounded-md p-2"
                  defaultValue={item.name}
                  onChange={(e) => changeNameAttribute(e, index)}
                  autoComplete="off"
                />
                {/* Bắt đầu giá trị ở đây */}
                <div className="flex flex-wrap py-2 -my-2 -mx-4">
                  {item.values.map((value, indexValue) => (
                    <div
                      className="flex-[0_0_50%] px-4 py-2 flex item-group"
                      key={indexValue}
                      onDragOver={(e) => dragOver(e, index, indexValue)}
                    >
                      <input
                        type="text"
                        value={value.value}
                        className="w-full outline-outline outline-4 transition border rounded-md p-2 mr-2"
                        placeholder={value.placeholder}
                        onChange={(e) =>
                          handleChangeValue(e, index, indexValue)
                        }
                        autoComplete="off"
                      />
                      <button
                        draggable="true"
                        onDragStart={(e) => dragStart(e, index, indexValue)}
                        className="text-gray-500 mr-2"
                        tabIndex="-1"
                        type="button"
                      >
                        <DragIcon />
                      </button>
                      <button
                        onClick={() => deleteAttributeValue(index, indexValue)}
                        className="text-gray-500"
                        type="button"
                        tabIndex="-1"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {data.length > 0 && (
            <table className="w-full">
              <thead>
                <tr>
                  {listAttribute.map((item, index) => (
                    <th key={index} className="text-center border p-2">
                      {item.name}
                    </th>
                  ))}
                  <th className="text-center border p-2">Giá</th>
                  <th className="text-center border p-2">Kho hàng</th>
                  <th className="text-center border p-2">SKU</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr key={index}>
                      {listAttribute.map((attr, indexAttr) => {
                        const countId = data.reduce(
                          (acc, current) => {
                            if (!acc.id) {
                              acc.id = current.id;
                            } else if (acc.id !== current.id) {
                              acc.total++;
                            }
                            return acc;
                          },
                          {
                            total: 1,
                          }
                        ).total;

                        const isSingleFirst =
                          countId == 1 && indexAttr == 0 && index == 0;
                        const firstInit =
                          (oldValue.current != item.id || !oldValue.current) &&
                          indexAttr == 0 &&
                          listAttribute.length > 1;
                        if (firstInit || isSingleFirst) {
                          oldValue.current = item.id;

                          return (
                            <td
                              key={"" + index + "." + indexAttr}
                              className="border p-2 text-center"
                              rowSpan={firstAttributeLength.current}
                            >
                              {item[attr.name]}
                              <ImageComponent
                                defaultValue={item?.image}
                                fnChooseImage={upImageForData}
                                attrName={attr.name}
                                attrValue={item[attr.name]}
                              />
                            </td>
                          );
                        } else if (indexAttr == 0 && listAttribute.length > 1) {
                          return (
                            <React.Fragment
                              key={"" + index + "." + indexAttr}
                            ></React.Fragment>
                          );
                        } else if (indexAttr == 0) {
                          return (
                            <td
                              key={"" + index + "." + indexAttr}
                              className="border p-2"
                            >
                              {item[attr.name]}
                              <ImageComponent
                                defaultValue={item?.image}
                                fnChooseImage={upImageForData}
                                attrName={attr.name}
                                attrValue={item[attr.name]}
                              />
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={"" + index + "." + indexAttr}
                              className="border p-2"
                            >
                              {item[attr.name]}
                            </td>
                          );
                        }
                      })}
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item?.price}
                          className="w-full outline-outline outline-4 transition border rounded-md p-2"
                          onChange={(e) => changeData(e, index, "price")}
                          placeholder="Nhập giá"
                          autoComplete="off"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item?.stock}
                          className="w-full outline-outline outline-4 transition border rounded-md p-2"
                          onChange={(e) => changeData(e, index, "stock")}
                          placeholder="Nhập giá"
                          autoComplete="off"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item?.sku}
                          className="w-full outline-outline outline-4 transition border rounded-md p-2"
                          onChange={(e) => changeData(e, index, "sku")}
                          placeholder="Nhập giá"
                          autoComplete="off"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2">
            <p className="mb-2">Giá</p>
            <input
              type="text"
              data-name="price"
              value={data[0] ? data[0]?.price : ""}
              placeholder="Giá"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={handleChangePrice}
              autoComplete="off"
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Sku</p>
            <input
              type="text"
              data-name="sku"
              value={data[0] ? data[0]?.sku : ""}
              placeholder="Sku"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={handleChangeSku}
              autoComplete="off"
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Số lượng</p>
            <input
              type="text"
              autoComplete="off"
              data-name="stock"
              value={data[0] ? data[0]?.stock : 0}
              placeholder="Số lượng"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={changeStock}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductVariant;
