"use client";
import { useEffect, useRef } from "react";
import { checkSlug } from "./action";
import { toSlug } from "@/utils/client/util";
import { useNotify } from "@/context/NotifyProvider";

const Slug = ({ field, defaultValue }) => {
  const slugRef = useRef(null);
  const notify = useNotify();
  const checkChangeInputSlug = async (e) => {
    slugRef.current.value = toSlug(e.target.value);
    if(!slugRef.current.value) return
    const data = await checkSlug(field.module, slugRef.current.value);
    if (data.status === 200) {
      notify.changeNotify("success", data.message);
    } else {
      slugRef.current.value = "";
      notify.changeNotify("error", data.message);
    }
  };

  useEffect(() => {
    const inputSlug = document.querySelector(`input[name="${field.from}"]`);
    const checkChange = async (e) => {
      if (slugRef.current.value == "") {
        checkChangeInputSlug(e);
      }
    };
    inputSlug.addEventListener("change", checkChange);
    return () => {
      inputSlug.removeEventListener("change", checkChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugRef]);
  return (
    <input
      type="text"
      autoComplete="off"
      name={field.name}
      ref={slugRef}
      placeholder={field.placeholder}
      defaultValue={defaultValue || ""}
      onBlur={checkChangeInputSlug}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Slug;
