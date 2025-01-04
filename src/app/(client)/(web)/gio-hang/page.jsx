"use client";

import { ClientContext } from "@/context/ClientProvider";
import LinkCustom from "@/packages/translation/Link";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import { useContext, useRef, useTransition } from "react";
import { deleteItemInDraftOrder, updateItemInDraftOrder } from "./action";
import { useNotify } from "@/context/NotifyProvider";

const Cart = () => {
  const { orders, setOrders } = useContext(ClientContext);
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef({});
  const minusQty = async (productVariantId) => {
    const qty =
      +orders.find((item) => item.product_variant_id === productVariantId).qty -
      1;
    if (qty <= 0) {
      startTransition(async () => {
        const response = await deleteItemInDraftOrder(productVariantId);
        if (response.status == 200) {
          setOrders((prev) => {
            const newItems = prev.filter(
              (item) => item.product_variant_id !== productVariantId
            );
            return newItems;
          });
        }
        notify.changeNotify(
          response.status == 200 ? "success" : "error",
          response.message
        );
      });
    } else {
      startTransition(async () => {
        const response = await updateItemInDraftOrder(productVariantId, qty);
        if (response.status == 200) {
          setOrders((prev) => {
            const newItems = prev.map((item) => {
              if (item.product_variant_id === productVariantId) {
                item.qty = qty;
              }
              return item;
            });
            return newItems;
          });
          inputRef.current[productVariantId].value = qty;
        }
        notify.changeNotify(
          response.status == 200 ? "success" : "error",
          response.message
        );
      });
    }
  };

  const plusQty = (productVariantId) => {
    startTransition(async () => {
      const qty =
        +orders.find((item) => item.product_variant_id === productVariantId)
          .qty + 1;
      const response = await updateItemInDraftOrder(productVariantId, qty);
      if (response.status == 200) {
        setOrders((prev) => {
          const newItems = prev.map((item) => {
            if (item.product_variant_id === productVariantId) {
              item.qty = qty;
            }
            return item;
          });
          return newItems;
        });
        inputRef.current[productVariantId].value = qty;
      }
      notify.changeNotify(
        response.status == 200 ? "success" : "error",
        response.message
      );
    });
  };

  const changeQty = (e, productVariantId) => {
    let qty = +e.target.value.trim() || 1;
    if (isNaN(qty) || Number(qty) <= 0) {
      qty = qty.replace(/[^0-9.]/g, ""); // Loại bỏ các ký tự không phải số hoặc dấu chấm
    }
    qty = qty > 0 ? qty : 1;
    startTransition(async () => {
      if (qty <= 0) {
        const response = await deleteItemInDraftOrder(productVariantId);
        if (response.status == 200) {
          setOrders((prev) => {
            const newItems = prev.filter(
              (item) => item.product_variant_id !== productVariantId
            );
            return newItems;
          });
        }
        notify.changeNotify(
          response.status == 200 ? "success" : "error",
          response.message
        );
      } else {
        const response = await updateItemInDraftOrder(productVariantId, qty);
        if (response.status == 200) {
          setOrders((prev) => {
            const newItems = prev.map((item) => {
              if (item.product_variant_id === productVariantId) {
                item.qty = qty;
              }
              return item;
            });
            return newItems;
          });
        } else {
          if (response.data) {
            inputRef.current[response.data.product_variant_id].value =
              response.data.qty;
          }
        }
        notify.changeNotify(
          response.status == 200 ? "success" : "error",
          response.message
        );
      }
    });
  };

  const changeValue = (e) => {
    let qty = +e.target.value.trim() || 1;
    if (isNaN(qty) || Number(qty) <= 0) {
      qty = qty.replace(/[^0-9.]/g, ""); // Loại bỏ các ký tự không phải số hoặc dấu chấm
    }
    qty = qty > 0 ? qty : 1;
    e.target.value = qty;
  };

  const deleteProduct = (productVariantId) => {
    startTransition(async () => {
      const response = await deleteItemInDraftOrder(productVariantId);
      if (response.status == 200) {
        setOrders((prev) => {
          const newItems = prev.filter(
            (item) => item.product_variant_id !== productVariantId
          );
          return newItems;
        });
      }
      notify.changeNotify(
        response.status == 200 ? "success" : "error",
        response.message
      );
    });
  };
  return (
    <div className="lg:px-10 px-4 my-10">
      <h1 className="font-bold text-3xl mb-10">Giỏ hàng</h1>
      {orders.length > 0 ? (
        <>
          <div className="flex flex-col border">
            <div className="hidden lg:flex">
              <div className="flex-1 font-bold border-b text-center">
                Sản phẩm
              </div>
              <div className="flex-1 font-bold border-b text-center">Giá</div>
              <div className="flex-1 font-bold border-b text-center">
                Số lượng
              </div>
              <div className="flex-1 font-bold border-b"></div>
            </div>
            {orders.map((item, index) => (
              <div
                key={item.product_variant_id}
                className="lg:flex border-b items-center relative p-4 lg:p-0"
              >
                <div className="flex-1 flex text-center">
                  <Image
                    src={showImageUrl(item.image)}
                    width={70}
                    height={70}
                    alt={""}
                  />
                  <LinkCustom
                    href={`/san-pham/${item.slug}`}
                    className="flex flex-col items-start gap-2 mt-2"
                  >
                    <p className="font-medium">{item.name}</p>
                    <span>Phân loại: {item.values.join(", ")}</span>
                  </LinkCustom>
                </div>
                <p className="flex-1 lg:text-center">
                  <span className="font-bold lg:hidden mr-2">Giá: </span>
                  {Intl.NumberFormat().format(item.price)} VND
                </p>
                <div className="flex-1 flex lg:justify-center">
                  <span className="font-bold lg:hidden mr-2">Số lượng: </span>
                  <div className="flex lg:justify-center border w-fit">
                    <button
                      className="px-2 border-r"
                      type="button"
                      onClick={() => minusQty(item.product_variant_id)}
                      disabled={isPending}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      ref={(el) => {
                        if (!inputRef.current[item.product_variant_id]) {
                          inputRef.current[item.product_variant_id] = el;
                        }
                      }}
                      className="px-2 text-center w-12"
                      defaultValue={item.qty}
                      placeholder="Số lượng"
                      onChange={(e) => changeValue(e)}
                      onBlur={(e) => changeQty(e, item.product_variant_id)}
                      disabled={isPending}
                    />
                    <button
                      className="px-2 border-l"
                      type="button"
                      onClick={() => plusQty(item.product_variant_id)}
                      disabled={isPending}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <button
                    type="button"
                    onClick={() => deleteProduct(item.product_variant_id)}
                    className="text-red-500 cursor-pointer font-bold absolute top-4 right-4 lg:static"
                    disabled={isPending}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 w-full mt-10">
            <div>
              <LinkCustom href={`/thanh-toan`}>
                <button
                  className="w-full bg-black text-white px-5 py-3 rounded-md"
                  disabled={isPending}
                >
                  Thanh toán
                </button>
              </LinkCustom>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">Chưa có sản phẩm nào trong giỏ hàng!</div>
      )}
    </div>
  );
};

export default Cart;
