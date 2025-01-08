"use client";
import { useEffect, useRef } from "react";
import { checkSlug } from "./action";
import { toSlug } from "@/utils/client/util";
import { useNotify } from "@/context/NotifyProvider";

const Slug = ({ field, defaultValue, item }) => {
  const slugRef = useRef(null);
  const notify = useNotify();
  const timer = useRef(null);
  const checkChangeInputSlug = async (e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const data = await checkSlug(field.module, toSlug(e.target.value), item._id);
      if (data.status === 200) {
        slugRef.current.value = toSlug(e.target.value);
        notify.changeNotify("success", data.message);
      } else {
        slugRef.current.value = "";
        notify.changeNotify("error", data.message);
      }
    }, 1000);
  };

  return (
    <input
      name={field.name}
      ref={slugRef}
      onChange={checkChangeInputSlug}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Slug;
