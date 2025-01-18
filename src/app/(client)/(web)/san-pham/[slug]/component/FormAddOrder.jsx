"use client";

import { ClientContext } from "@/context/client/ClientProvider";
import { useNotify } from "@/context/NotifyProvider";
import { ProductContext } from "@/context/client/ProductProvider";
import { useContext, useState, useTransition } from "react";
import { postDraftOrder } from "./action";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname } from "next/navigation";

const FormAddOrder = () => {
  const [stock, setStock] = useState(1);
  const pathname = usePathname();
  const notify = useNotify();
  const router = useRouterCustom();
  const [isPending, startTransition] = useTransition();
  const { productCurrent, selectedAttributes, product, setProductCurrent } =
    useContext(ProductContext);
  const { setUpdateCart } = useContext(ClientContext);

  const handleStock = (e) => {
    let value = e.target.value.trim();
    checkStock(value);
  };

  function checkStock(value) {
    if (value == 0) {
      value = 1;
    }
    if (isNaN(value) || Number(value) <= 0) {
      value = value.replace(/[^0-9.]/g, ""); // Loại bỏ các ký tự không phải số hoặc dấu chấm
    }
    value = value > 0 ? value : 1;
    if (value > productCurrent.stock) value = productCurrent.stock;
    setStock(value);
  }

  function plusStock() {
    let value = stock;
    value++;
    checkStock(value);
  }

  function minusStock() {
    let value = stock;
    value--;
    checkStock(Math.abs(value));
  }

  const handleUpdateOrder = async () => {
    startTransition(async () => {
      if (
        Object.values(selectedAttributes).filter((item) => item).length ===
        product.detail_variants.length
      ) {
        if (productCurrent.stock > 0) {
          const data = await postDraftOrder(
            {
              productId: productCurrent._id,
              stock,
            },
            "Vui lòng đăng nhập",
            `redirect=${pathname}`
          );
          console.log(data);
          if (data.status == 200) {
            setUpdateCart(true);
            product.variants = product.variants.map((variant) => {
              if (variant._id == productCurrent._id) {
                variant.stock = Number(variant.stock) - Number(stock);
              }
              return variant;
            });
            setProductCurrent((prev) => {
              prev.stock = Number(prev.stock) - Number(stock);
              return { ...prev };
            });
            return notify.changeNotify("success", data.message);
          } else if (data.status == 401) {
            router.push("/dang-nhap?" + data.searchParams);
            return notify.changeNotify("error", data.message);
          }
          return notify.changeNotify("error", data.message);
        } else {
          return notify.changeNotify("error", "Số lượng hàng hóa không hợp lệ");
        }
      }
      return notify.changeNotify("error", "Đặt hàng không hợp lệ");
    });
  };
  return (
    <form action={handleUpdateOrder}>
      <div className="flex w-fit items-center mt-10 border rounded-md">
        <button
          type="button"
          onClick={() => minusStock()}
          className={`px-2 py-2 min-w-[40px] rounded-bl-md border-r rounded-tl-md font-bold ${
            productCurrent.stock <= 0 ? "cursor-not-allowed bg-red-400" : ""
          }`}
          disabled={productCurrent.stock <= 0}
        >
          -
        </button>
        <input
          type="text"
          name="name"
          value={stock}
          autoComplete="off"
          onChange={handleStock}
          className={`max-w-[100px] px-2 py-2 font-bold text-center outline-none ${
            productCurrent.stock <= 0 ? "cursor-not-allowed bg-red-400" : ""
          }`}
          disabled={productCurrent.stock <= 0}
        />

        <button
          type="button"
          onClick={() => plusStock()}
          className={`px-2 py-2 min-w-[40px] font-bold border-l ${
            productCurrent.stock <= 0
              ? "cursor-not-allowed bg-red-400 rounded-br-md rounded-tr-md"
              : ""
          }`}
          disabled={productCurrent.stock <= 0}
        >
          +
        </button>
      </div>
      <button
        className={`px-2 py-2 font-bold my-4 border [&[disabled]]:opacity-50 [&[disabled]]:cursor-not-allowed rounded-md ${
          productCurrent.stock <= 0
            ? "cursor-not-allowed bg-red-400"
            : "bg-blue-700 text-white"
        }`}
        disabled={productCurrent.stock <= 0 || isPending}
      >
        Đặt hàng
      </button>
    </form>
  );
};

export default FormAddOrder;
