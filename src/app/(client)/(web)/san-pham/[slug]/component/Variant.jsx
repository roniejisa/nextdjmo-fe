"use client";
import ImageCustom from "@/components/Maintain/Image";
import { ProductContext } from "@/context/client/ProductProvider";
import { showImageUrl } from "@/utils/client/util";
import React, { useContext, useEffect, useState } from "react";
// Đầu tiên cần xác định cái nào đang không hàng luôn
// Tốt nhất là chỉ nên làm như hiện tại đỡ lỗi vớ vẩn ngu người
const Variant = () => {
  const {
    selectedAttributes,
    setSelectedAttributes,
    product,
    firstAttribute,
    imageRef,
    imageVariants,
    productCurrent,
    setProductCurrent,
  } = useContext(ProductContext);
  const [listVariantOk, setListVariantOk] = useState(product.variants);
  const chooseAttribute = (name, label) => {
    setSelectedAttributes((prevSelected) => {
      // Nếu giá trị đã chọn là label, thì bỏ chọn (set lại thành null)
      if (prevSelected[name] === label) {
        const newSelected = { ...prevSelected };
        delete newSelected[name];
        return newSelected;
      }
      // Nếu chưa chọn hoặc chọn mới, cập nhật giá trị
      return { ...prevSelected, [name]: label };
    });
  };
  useEffect(() => {
    // Kiểm tra ở bước đầu chọn màu
    if (selectedAttributes[firstAttribute]) {
      productCurrent.image = imageVariants[selectedAttributes[firstAttribute]];
    } else if (Object.keys(imageVariants).length > 0) {
      productCurrent.image = imageVariants[Object.keys(imageVariants)[0]];
      imageRef.current.src = showImageUrl(productCurrent?.image);
    }

    const selectedWork = Object.entries(selectedAttributes).filter(
      (item) => item[1] !== ""
    );
    if (selectedWork.length > 0) {
      // Đầu tiên phải tìm thằng attribute nào chắc chắn có giá trị đã
      const variantRequired = product.variants.filter((variant) => {
        return selectedWork.every(([name, value]) => {
          return variant.attributes.some((attribute) => {
            const result =
              attribute.name == name &&
              attribute.value == value &&
              Number(variant.stock) > 0;
            return result;
          });
        });
      });

      const data = product.variants.filter((variant) => {
        // Tạo kiểm tra trường hợp chỉ khi nào selectedWork bằng 1 thì sẽ thêm cái kiểu cho chọn những cái thuộc cái selected đó và các thuộc tính phải thỏa mãn với những cái  chắc chặn được chọn
        if (variantRequired.length > 0) {
          return (
            variantRequired.findIndex((item) => {
              return item._id === variant._id;
            }) !== -1
          );
        }
      });
      setListVariantOk(data);
    } else {
      setListVariantOk(product.variants.filter((variant) => Number(variant.stock) > 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributes]);

  useEffect(() => {
    let price = 0;
    let priceMin = 0;
    let priceMax = 0;
    if (listVariantOk.length > 1) {
      for (let i = 0; i < listVariantOk.length; i++) {
        const variant = listVariantOk[i];
        if (!priceMin || priceMin > Number(variant.price)) {
          priceMin = Number(variant.price);
        }
        if (!priceMax || priceMax < Number(variant.price)) {
          priceMax = Number(variant.price);
        }
        if (!price || price > Number(variant.price)) {
          price = Number(variant.price);
        }
      }

      if (priceMin === priceMax) {
        price = Intl.NumberFormat().format(priceMin) + " VND";
      } else {
        price = `${Intl.NumberFormat().format(priceMin)} VND - ${Intl.NumberFormat().format(priceMax)} VND`;
      }
    } else {
      price = Intl.NumberFormat().format(listVariantOk[0].price) + " VND";
    }
    setProductCurrent({
      ...product,
      ...Object.entries(listVariantOk[0])
        .filter(([key, value]) => value !== null && value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {}),
      price,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVariantOk]);
  useEffect(() => {
    setSelectedAttributes((prev) => {
      const obj = product.detail_variants.reduce((prev, curr) => {
        return { ...prev, [curr.name]: "" };
      }, {});
      return obj;
    });
    const filteredVariants = product.variants.filter((variant) => {
      return Object.entries(selectedAttributes).every(([name, label]) => {
        return variant.attributes.some(
          (attribute) => attribute.name === name && attribute.value === label
        );
      });
    });
    setListVariantOk(filteredVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkDisabled = (name, label) => {
    // Đầu tiền phải xem nó có tồn tại trong listVariantOk không đã nếu không tại thì bỏ luôn đi
    const constain = listVariantOk.some((variant) => {
      return variant.attributes.some(
        (attribute) => attribute.name === name && attribute.value === label
      );
    });
    if (!constain) return true;

    return !product.variants.some((variant) =>
      variant.attributes.some(
        (attribute) =>
          attribute.name === name &&
          attribute.value === label &&
          Number(variant.stock) > 0
      )
    );
  };

  if (product.detail_variants === 0) return <></>;
  return (
    <>
      {product.detail_variants && (
        <div>
          <ul>
            {product.detail_variants?.map(
              ({ name, values: varaints }, index) => (
                <div key={index}>
                  <p>{name}</p>
                  <div className="flex flex-wrap gap-1">
                    {varaints
                      ?.filter(({ value }) => value !== "")
                      .map(({ value: label }, index) => (
                        <label
                          key={index}
                          className="border variant flex items-center gap-2 p-2 rounded-md cursor-pointer"
                          {...(name === firstAttribute && {
                            onMouseEnter: () => {
                              imageRef.current.src = showImageUrl(
                                imageVariants[label]
                              );
                            },
                            onMouseLeave: () => {
                              imageRef.current.src = showImageUrl(
                                productCurrent?.image
                              );
                            },
                          })}
                        >
                          {name === firstAttribute && (
                            <ImageCustom
                              src={showImageUrl(imageVariants[label])}
                              alt={label}
                              width={40}
                              height={40}
                            />
                          )}
                          {label}
                          <input
                            hidden
                            type="checkbox"
                            name={label}
                            checked={selectedAttributes[name] === label} // Kiểm tra xem giá trị có được chọn không
                            onChange={() => chooseAttribute(name, label)}
                            disabled={checkDisabled(name, label)}
                          />
                        </label>
                      ))}
                  </div>
                </div>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Variant;
