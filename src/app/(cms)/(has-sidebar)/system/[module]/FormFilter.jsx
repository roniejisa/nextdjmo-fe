"use client";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Text from "./searchs/Text";
import { ModuleContext } from "@/context/cms/ModuleProvider";

const component = {
  text: Text,
};

// Icon Components for better maintainability
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform group-hover:scale-105"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12.97 19.677l-3.97 1.323v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v1.5" />
    <path d="M17 17v5" />
    <path d="M21 17v5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 20 20"
    aria-hidden="true"
    className="w-4 h-4 transition-transform hover:scale-110"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Filter Button Component
const FilterButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-11 h-11 flex items-center justify-center
               border border-gray-300 rounded-xl
               bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600
               text-gray-600 hover:text-white
               shadow-sm hover:shadow-lg
               transition-all duration-300 ease-in-out
               hover:border-transparent hover:-translate-y-0.5
               focus:outline-none focus:ring-4 focus:ring-blue-100"
    aria-label="Mở bộ lọc"
  >
    <FilterIcon />
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
  </button>
);

// Modal Header Component
const ModalHeader = ({ onClose }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between p-6 
                  bg-gradient-to-r from-slate-800 to-slate-900 text-white
                  shadow-lg backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        <FilterIcon />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Bộ lọc tìm kiếm</h3>
        <p className="text-sm text-slate-300">Chọn tiêu chí để lọc kết quả</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="group p-2 rounded-full
                 bg-white/10 hover:bg-white/20
                 text-white/80 hover:text-white
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label="Đóng bộ lọc"
    >
      <CloseIcon />
    </button>
  </div>
);

// Filter Select Component
const FilterSelect = ({ fields, onFieldAdd }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Thêm bộ lọc mới
    </label>
    <select
      onChange={(e) => {
        if (!e.target.value) return;
        const obj = JSON.parse(e.target.value);
        onFieldAdd(obj);
        e.target.value = ""; // Reset select after adding
      }}
      className="w-full px-4 py-3 text-sm
                 border border-gray-200 rounded-xl
                 bg-white hover:bg-gray-50
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200
                 shadow-sm hover:shadow-md"
    >
      <option value="">🔍 Chọn tiêu chí lọc...</option>
      {Array.from(fields).map((item, index) => (
        <option value={JSON.stringify(item)} key={index}>
          {item.label}
        </option>
      ))}
    </select>
  </div>
);

// Filter Form Component
const FilterForm = ({ searchFields, onCancel, onSubmit, onRemoveField }) => (
  <form action={onSubmit} className="space-y-4">
    {searchFields
      .filter((item) => item.search_type || item.type === "text")
      .map((item, index) => {
        const Component = component[item.search_type || item.type];
        return (
          <div key={index} className="group relative p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemoveField(index)}
              className="absolute top-2 right-2 z-10
                         w-6 h-6 flex items-center justify-center
                         bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700
                         rounded-full opacity-0 group-hover:opacity-100
                         transition-all duration-200 transform hover:scale-110
                         focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-red-300"
              title={`Xóa bộ lọc: ${item.label}`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Field label */}
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm">
                {item.label}
              </span>
            </div>
            
            <Component field={item} />
          </div>
        );
      })}
    
    {searchFields.length > 0 && (
      <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
        <button
          onClick={onCancel}
          type="button"
          className="px-6 py-2.5 text-sm font-medium
                     text-gray-600 hover:text-gray-800
                     bg-white hover:bg-gray-50
                     border border-gray-200 hover:border-gray-300
                     rounded-xl transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium
                     text-white bg-gradient-to-r from-blue-500 to-purple-600
                     hover:from-blue-600 hover:to-purple-700
                     rounded-xl shadow-lg hover:shadow-xl
                     transition-all duration-200 transform hover:-translate-y-0.5
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    )}
  </form>
);

// Main Component
const FormFilter = () => {
  const { fields } = useContext(ModuleContext);
  const [searchFields, setSearchFields] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterCustom();
  const modalRef = useRef(null);

  // Logic functions
  const searchForm = async (form) => {
    const newSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(form),
    });
    newSearchParams.set("page", 1);
    router.push(pathname + "?" + newSearchParams.toString());
  };

  const handleAddField = (field) => {
    setSearchFields((prev) => [...prev, field]);
  };

  const handleRemoveField = (index) => {
    setSearchFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseFilter = (e) => {
    if (e.target.contains(modalRef.current)) {
      setShowFilter(false);
    }
  };

  // Effects
  useEffect(() => {
    setShowFilter(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <FilterButton onClick={() => setShowFilter(true)} />
      
      {isClient && (
        <div
          className={`fixed inset-0 z-[9999] transition-all duration-500 ease-out
                     ${showFilter ? 'opacity-100 visible' : 'opacity-0 invisible'}
                     bg-black/40 backdrop-blur-sm`}
          onClick={handleCloseFilter}
          ref={modalRef}
          style={{
            transitionDelay: showFilter ? "0ms" : "200ms",
          }}
        >
          <div
            className={`absolute right-0 top-0 h-full w-full max-w-md
                       bg-white shadow-2xl
                       transform transition-all duration-500 ease-out
                       ${showFilter ? 'translate-x-0' : 'translate-x-full'}
                       sm:max-w-lg lg:max-w-xl`}
            style={{
              transitionDelay: showFilter ? "100ms" : "0ms",
            }}
          >
            <div className="flex flex-col h-full">
              <ModalHeader onClose={() => setShowFilter(false)} />
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <FilterSelect 
                  fields={fields} 
                  onFieldAdd={handleAddField} 
                />
                
                <FilterForm 
                  searchFields={searchFields}
                  onCancel={() => setShowFilter(false)}
                  onSubmit={searchForm}
                  onRemoveField={handleRemoveField}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormFilter;