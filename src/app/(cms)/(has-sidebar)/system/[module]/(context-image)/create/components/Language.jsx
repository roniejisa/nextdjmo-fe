"use client";
import { useEffect, useState } from "react";
import useRouterCustom from "@/packages/translation/Navigation";
import { useSearchParams } from "next/navigation";

const Language = ({ field, module }) => {
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const [language, setLanguage] = useState(
    searchParams.get("language") ||
      field.data.find((item) => item.default === "active").code
  );
  const changeLanguage = async (e) => {
    setLanguage(e.target.value);
    router.push(
      process.env.NEXT_PUBLIC_ADMIN_URL +
        `${module}/create?language=${e.target.value}`
    );
  };

  useEffect(() => {}, []);

  return (
    <select
      name={field.name}
      defaultValue={language}
      onChange={changeLanguage}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    >
      {field.data?.map((item) => (
        <option key={item._id} value={item.code} data-code={item.code}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

export default Language;
