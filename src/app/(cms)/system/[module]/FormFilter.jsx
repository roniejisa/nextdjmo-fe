"use client";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Text from "./searchs/Text";
import { ModuleContext } from "@/context/ModuleProvider";

const component = {
  text: Text,
};
const FormFilter = () => {
  const {fields} = useContext(ModuleContext);
  const [searchFields, setSearchFields] = useState([]);
  const pathname = usePathname();
  const router = useRouterCustom();
  const searchForm = async (form) => {
    const searchParams = new URLSearchParams(Object.fromEntries(form));
    console.log(pathname+"?"+searchParams.toString())
    router.replace(pathname+"?"+searchParams.toString());
  };

  useEffect(() => {
    console.log(searchFields);
  }, [searchFields]);
  return (
    <div className="my-4">
      <select
        onChange={(e) => {
          if (!e.target.value) return;
          setSearchFields((prev) => {
            const newFields = prev;
            const obj = JSON.parse(e.target.value);
            return [...newFields, obj];
          });
        }}
      >
        <option value="">-- Chọn bộ lọc --</option>
        {fields.map((item, index) => {
          return (
            <option value={JSON.stringify(item)} key={index}>
              {item.label}
            </option>
          );
        })}
      </select>
      <form action={searchForm}>
        {searchFields.map((item, index) => {
          const Component = component[item.search_type];
          return <Component field={item} key={index} />;
        })}
        <button>Tìm kiếm</button>
      </form>
    </div>
  );
};

export default FormFilter;
