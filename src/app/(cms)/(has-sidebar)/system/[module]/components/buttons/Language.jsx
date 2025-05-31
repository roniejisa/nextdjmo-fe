"use client";

import useRouterCustom from "@/packages/translation/Navigation";
import { useSearchParams } from "next/navigation";

const Language = ({ module, moduleMain }) => {
  const router = useRouterCustom();
  const searchParams = useSearchParams();
  if (!moduleMain.language || moduleMain.langs.length == 0) return;
  return (
    <div>
      <select
        defaultValue={
          searchParams.get("language") ||
          moduleMain.langs.find((item) => item.default === "active").code
        }
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
        onChange={(e) => {
          const newSeachParams = new URLSearchParams({
            ...Object.fromEntries(searchParams),
            language: e.target.value,
          });
          const paramsObject = Object.fromEntries(newSeachParams)
          router.pushWithQuery(`${module}`,paramsObject);
        }}
      >
        {moduleMain.langs.map((item) => (
          <option key={item._id} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Language;
