"use client";
import { useRef } from "react";
import { checkKey } from "./action";
import { toSlug } from "@/utils/client";
import { useNotify } from "@/context/NotifyProvider";

const Key = ({ field, defaultValue, item }) => {
  const keyRef = useRef(null);
  const notify = useNotify();
  const timerRef = useRef(null);
  const checkChangeInputKey = async (e) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const data = await checkKey(
        field.module,
        toSlug(e.target.value),
        item._id
      );
      if (data.status === 200) {
        keyRef.current.value = e.target.value;
        notify.changeNotify("success", data.message);
      } else {
        keyRef.current.value = "";
        notify.changeNotify("error", data.message);
      }
    }, 500);
  };

  return (
    <input
      name={field.name}
      ref={keyRef}
      onChange={checkChangeInputKey}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
      autoComplete="off"
    />
  );
};

export default Key;
