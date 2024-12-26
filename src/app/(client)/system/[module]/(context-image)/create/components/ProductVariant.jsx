"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageComponent from "./product_variant/Image";
import { makeId } from "@/utils/client/util";
/**
 * 1. Ấn vào nút thêm chưa có dữ liệu thì phải nhập
 *
 *
 *
 *
 *
 */
const generateCombinations = (attributes) => {
  // Khởi tạo danh sách combinations ban đầu
  let combinations = [{}];

  attributes.forEach((attribute, indexAttr) => {
    const { name, values } = attribute;
    const newCombinations = [];
    // Nói chung là đã giá trị đầu tiên bắt buộc phải có 1 cái là ít nhất 1 giá trị đã
    // Nếu không có giá trị cho thuộc tính, giữ lại các combination hiện có và thêm giá trị trống cho thuộc tính đó
    if (indexAttr == 0 && values.length <= 1) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: values[0]?.id,
          ...combo,
          [name]: values[0].value,
        });
      });
    } else if (
      values.length === 0 ||
      values.every((objValue) => !objValue.value)
    ) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: indexAttr == 0 ? combo?.id : "",
          ...combo,
          [name]: "",
        });
      });
    } else {
      // Có giá trị đầu tiên thì cứ lấy đi lấy lại cái đầu tiên là xong

      // Tạo combinations mới nếu thuộc tính có giá trị
      values
        .filter((value) => value.value)
        .forEach((value) => {
          combinations.forEach((combo) => {
            // Chỗ này kiểm tra nếu id đã tồn tại thì lấy id cũ
            newCombinations.push({
              id: indexAttr == 0 ? value?.id : "",
              ...combo,
              [name]: value.value,
            });
          });
        });
    }
    combinations = newCombinations; // Cập nhật combinations
  });

  return combinations;
};

const sortData = (data) => {
  // Tạo một Map để nhóm dữ liệu theo number
  const grouped = new Map();

  // Nhóm dữ liệu theo number
  data.forEach((item) => {
    const value = Object.values(item)[0]; // Lấy giá trị đầu tiên trong đối tượng (ví dụ: "đỏ", "đen", "x")

    if (!grouped.has(value)) {
      grouped.set(value, []); // Nếu chưa có, tạo một mảng mới cho giá trị đó
    }
    grouped.get(value).push(item); // Thêm đối tượng vào nhóm có giá trị tương ứng
  });

  // Sắp xếp kết quả theo number và value trong mỗi nhóm
  const result = [];
  [...grouped.keys()] // Lấy danh sách keys (number)
    .sort((a, b) => a - b) // Sắp xếp theo number
    .forEach((number) => {
      const group = grouped.get(number);
      // Kiểm tra và sắp xếp theo value nếu value là chuỗi
      group.sort((a, b) => {
        if (a.value && b.value) {
          return a.value.localeCompare(b.value); // Sắp xếp theo value nếu có giá trị
        }
        return 0; // Nếu không có giá trị valid, không thay đổi thứ tự
      });
      result.push(...group); // Thêm các phần tử vào kết quả
    });

  return result;
};

const ProductVariant = ({ field, defaultValue }) => {
  const [hasVariant, setHasVariant] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [listAttribute, setListAttribute] = useState([]);
  const [data, setData] = useState([]);
  const textareaRef = useRef(null);
  const dataMoveRef = useRef(null);
  const firstAttributeLength = useRef(0);
  const oldValue = useRef(null);
  const inputAddAttributeRef = useRef(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const suggestionRef = useRef(null);
  useEffect(() => {
    if (data.length > 0) {
      textareaRef.current.value = JSON.stringify(data);
    } else {
      textareaRef.current.value = "";
    }
  }, [data]);

  // Add Event
  const showProductAttributeAvailable = (e) => {
    setShowSuggestion(true);
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
  }, [showSuggestion]);

  const addAttribute = () => {
    // Cần kiểm tra xem attribute này đã tồn tại chưa
    if (attribute.trim() === "") return inputAddAttributeRef.current.focus();
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
      setData((prev) => {
        const newListData = listData.map((item, index) => {
          const oldData = prev[index];
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
        // console.log(newListData);
        return newListData;
      });
    }else{
      setData([]);
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

  const changeNameAttribute = (index) => {
    setListAttribute((prev) => {
      const newList = [...prev]; // Tạo bản sao của mảng `prev`
      newList[index] = {
        ...newList[index], // Sao chép object tại vị trí `index`
        name: newList[index].name,
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
    dataMoveRef.current.attribute_id = index

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

  const handleChangeValue = (index, indexValue) => (e) => {
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
    setData((prev) => {
      const newData = [...prev];
      newData[index][key] = e.target.value;
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
    const values = listAttribute[index].values.filter(
      (item, index) => index !== indexValue
    );
    // Kiểm tra nếu rỗng thì xóa luôn
    if (values.length == 0) return deleteAttribute(index);
    setListAttribute((prev) => {
      prev[index].values = values;
      return [...prev];
    });
  };

  return (
    <>
      <textarea name={field.name} hidden ref={textareaRef}></textarea>
      <label
        htmlFor={field.name}
        className="border border-double flex items-center justify-center cusor-pointer gap-2 p-2 cursor-pointer w-fit mb-2"
        style={{
          color: hasVariant ? "red" : "green",
        }}
      >
        {hasVariant ? (
          <>
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
              <path d="M5 12l14 0" />
            </svg>
            Hủy phân loại
          </>
        ) : (
          <>
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
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
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
      {hasVariant ? (
        <div>
          <div className="flex border p-2 gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                data-name="attribute"
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                placeholder="Thuộc tính"
                ref={inputAddAttributeRef}
                onMouseDown={showProductAttributeAvailable}
              />
              {field.data_product_attributes.length > 0 && showSuggestion && (
                <div
                  className="absolute top-10 left-0 w-full bg-white z-10"
                  ref={suggestionRef}
                >
                  {field.data_product_attributes.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setAttribute(item.name);
                        setShowSuggestion(false);
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
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
                <input
                  type="text"
                  className="w-full outline-outline outline-4 transition border rounded-md p-2"
                  value={item.name}
                  onChange={() => changeNameAttribute(index)}
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
                        onChange={handleChangeValue(index, indexValue)}
                      />
                      <button
                        draggable="true"
                        onDragStart={(e) => dragStart(e, index, indexValue)}
                        className="text-gray-500 mr-2"
                        tabIndex="-1"
                        type="button"
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
                          className="w-4 h-4"
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
                      <button
                        onClick={() => deleteAttributeValue(index, indexValue)}
                        className="text-gray-500"
                        type="button"
                        tabIndex="-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                          <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                        </svg>
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
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item?.stock}
                          className="w-full outline-outline outline-4 transition border rounded-md p-2"
                          onChange={(e) => changeData(e, index, "stock")}
                          placeholder="Nhập giá"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item?.sku}
                          className="w-full outline-outline outline-4 transition border rounded-md p-2"
                          onChange={(e) => changeData(e, index, "sku")}
                          placeholder="Nhập giá"
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
              placeholder="Giá"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={(e) => {
                setData((prev) => {
                  if (!prev.length) prev.push({});
                  const obj = prev[0];
                  obj.price = e.target.value;
                  return [...prev];
                });
              }}
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Sku</p>
            <input
              type="text"
              data-name="sku"
              placeholder="Sku"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={(e) =>
                setData((prev) => {
                  if (!prev.length) prev.push({});
                  const obj = prev[0];
                  obj.sku = e.target.value;
                  return [...prev];
                })
              }
            />
          </div>
          <div className="mt-2">
            <p className="mb-2">Số lượng</p>
            <input
              type="text"
              data-name="stock"
              placeholder="Số lượng"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              onChange={(e) =>
                setData((prev) => {
                  if (!prev.length) prev.push({});
                  const obj = prev[0];
                  obj.stock = e.target.value;
                  return [...prev];
                })
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductVariant;
