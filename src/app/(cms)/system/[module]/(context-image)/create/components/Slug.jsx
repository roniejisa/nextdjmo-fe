"use client";
import { useEffect, useRef } from "react";
import { checkSlug } from "./action";
import { toSlug } from "@/utils/client/util";
import { useNotify } from "@/context/NotifyProvider";

const Slug = ({ field, defaultValue }) => {
  const slugRef = useRef(null);
  const notify = useNotify();
  const checkChangeInputSlug = async (e) => {
    const data = await checkSlug(field.module, toSlug(e.target.value));
    if (data.status === 200) slugRef.current.value = toSlug(e.target.value);
    else notify.changeNotify("error", data.message);
  };

  useEffect(() => {
    const inputSlug = document.querySelector(`input[name="${field.from}"]`);
    inputSlug.addEventListener("change", checkChangeInputSlug);
    return () => {
      inputSlug.removeEventListener("change", checkChangeInputSlug);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <input
      name={field.name}
      ref={slugRef}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Slug;
