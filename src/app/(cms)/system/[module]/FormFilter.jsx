"use client";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Text from "./searchs/Text";
import { ModuleContext } from "@/context/ModuleProvider";

const component = {
  text: Text,
};
const FormFilter = () => {
  const { fields } = useContext(ModuleContext);
  const [searchFields, setSearchFields] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isClient, setIsClient] = useState(false); // Trạng thái kiểm tra client
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const modalRef = useRef(null);
  const searchForm = async (form) => {

    const newSeachParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(form),
    });
    router.replace(pathname + "?" + newSeachParams.toString());
  };

  useEffect(() => {
    setShowFilter(false);
  }, [pathname, searchParams]);
  useEffect(() => {
    setIsClient(true); // Đảm bảo chỉ render trên client
  }, []);

  const handleCloseFilter = (e) => {
    if (e.target.contains(modalRef.current)) {
      setShowFilter(false);
    }
  };
  return (
    <>
      <button onClick={(e) => setShowFilter(true)} className="border rounded-md w-[42px] flex justify-center items-center hover:bg-outline hover:border-outline transition-all hover:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12.97 19.677l-3.97 1.323v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v1.5" />
          <path d="M17 17v5" />
          <path d="M21 17v5" />
        </svg>
      </button>
      {isClient && (
        <div
          className="fixed top-0 left-0 transition-all duration-300 inset-0 z-[9999] bg-[#00000050] overflow-hidden"
          style={{
            backdropFilter: "blur(12px)",
            opacity: showFilter ? 1 : 0,
            visibility: showFilter ? "visible" : "hidden",
            pointerEvents: showFilter ? "auto" : "none",
            transitionDelay: showFilter ? "0" : "300ms",
          }}
          onClick={handleCloseFilter}
          ref={modalRef}
        >
          <div
            className="lg:h-screen bg-white absolute right-0 transition-all duration-300 lg:min-w-[300px]"
            style={{
              transform: showFilter ? "translateX(0)" : "translateX(100%)",
              transitionDelay: showFilter ? "300ms" : "0",
            }}
          >
            <div className="flex justify-between p-4 border-b bg-gray-500 text-white">
              <h3>Bộ lọc</h3>
              <button
                onClick={(e) => setShowFilter(false)}
                className="w-6 h-6 flex justify-center items-center rounded-full bg-white text-gray-500"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
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
                {Array.from(fields).length > 0 &&
                  fields.map((item, index) => {
                    return (
                      <option value={JSON.stringify(item)} key={index}>
                        {item.label}
                      </option>
                    );
                  })}
              </select>
              <form action={searchForm}>
                {searchFields
                  .filter((item) => item.search_type || item.type == "text")
                  .map((item, index) => {
                    const Component = component[item.search_type || item.type];
                    return <Component field={item} key={index} />;
                  })}
                <div className="flex mt-5 justify-end">
                  <button
                    onClick={() => setShowFilter(false)}
                    type="button"
                    className="px-4 rounded-lg text-gray-400 hover:text-black transition py-2 mr-2"
                  >
                    Hủy
                  </button>
                  <button className="px-4 border rounded-lg bg-outline transition hover:text-outline hover:bg-white border-outline text-white py-2">
                    Đồng ý
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormFilter;
