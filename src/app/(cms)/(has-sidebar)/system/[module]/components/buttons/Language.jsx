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
        onChange={(e) => {
          const newSeachParams = new URLSearchParams({
            ...Object.fromEntries(searchParams),
            language: e.target.value,
          });
          router.push(`${module}?${newSeachParams.toString()}`);
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
