"use client";

import React, { useEffect, useRef, useState } from "react";

const generateCombinations = (attributes) => {
  // Khởi tạo danh sách combinations ban đầu
  let combinations = [{}];

  attributes.forEach((attribute) => {
    const { name, values } = attribute;
    const newCombinations = [];

    // Nếu không có giá trị cho thuộc tính, giữ lại các combination hiện có và thêm giá trị trống cho thuộc tính đó
    if (values.length === 0 || values.every((objValue) => !objValue.value)) {
      combinations.forEach((combo) => {
        newCombinations.push({ ...combo, [name]: "" });
      });
    } else {
      // Tạo combinations mới nếu thuộc tính có giá trị
      values
        .filter((objValue) => objValue.value)
        .forEach((value) => {
          combinations.forEach((combo) => {
            newCombinations.push({
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
  useEffect(() => {
    textareaRef.current.value = JSON.stringify(data);
  }, [data]);

  const addAttribute = () => {
    // Cần kiểm tra xem attribute này đã tồn tại chưa
    if (attribute.trim() === "") return;
    setListAttribute((prev) => {
      const exists = prev.some((item) => item.name === attribute);
      if (exists) return prev;
      return [
        ...prev,
        {
          name: attribute,
          values: [
            {
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
      setData(sortData(newData));
    }
    firstAttributeLength.current = listAttribute.reduce((acc, item, index) => {
      if (index) {
        if (!acc) {
          if (item.values.length > 0) {
            acc = item.values.length - 1;
          }
        } else {
          acc *= item.values.length - 1;
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

  const dragEnd = (e) => {
    dataMoveRef.current = null;
    e.preventDefault();
  };

  const dragStart = (e, index, indexValue) => {
    dataMoveRef.current = listAttribute[index].values[indexValue];
    dataMoveRef.current.index = indexValue;

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

  const dragOver = (e, index, indexNew) => {
    e.stopPropagation();
    e.preventDefault();
    if (!dataMoveRef.current) return;
    const indexOld = dataMoveRef.current.index;
    // Lấy chiều cao và vị trí của phần tử
    // Lấy phần tử mà sự kiện được gắn vào (currentTarget)
    const draggingElement = e.currentTarget;

    if (!draggingElement) return;
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
      return newList;
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
            <input
              type="text"
              data-name="attribute"
              className="w-full outline-outline outline-4 transition border rounded-md p-2"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              placeholder="Thuộc tính"
            />
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
                        onClick={() => deleteValue(index, indexValue)}
                        className="text-gray-500"
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
          <div>
            <table className="w-full">
              <thead>
                <tr>
                  {listAttribute.map((item, index) => (
                    <th key={index} className="text-center border p-2">
                      {item.name}
                    </th>
                  ))}
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>SKU Phân Loại</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr key={index}>
                      {listAttribute.map((attr, indexAttr) => {
                        if (
                          (oldValue.current != item[attr.name] ||
                            oldValue.current == null) &&
                          indexAttr == 0
                        ) {
                          oldValue.current = item[attr.name];
                          return (
                            <td
                              key={"" + index + "." + indexAttr}
                              className="border p-2"
                              rowSpan={firstAttributeLength.current}
                            >
                              {item[attr.name]}
                            </td>
                          );
                        } else if (indexAttr == 0) {
                          return (
                            <React.Fragment
                              key={"" + index + "." + indexAttr}
                            ></React.Fragment>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
