"use client";

import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { CMSContext } from "@/context/cms/CMSProvider";
import { moduleCreate } from "../create/actions";
import { components } from ".";
const QuickCreate = () => {
  const { modalQuick, setModalQuick, setUpdateField } = useContext(CMSContext);
  const [isPending, startTransition] = useTransition();
  const [module, setModule] = useState(null);
  const modalQuickRef = useRef(null);
  useEffect(() => {
    if (!modalQuick) return;
    moduleCreate(modalQuick.module).then((res) => setModule(res.data));
  }, [modalQuick]);

  const handleSubmit = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const data = await handleCreate(modalQuick.module, formData);
      if (data.status == 201) {
        setUpdateField(modalQuick.name);
        setModalQuick(null);
      }
    });
  };

  const handleOffQuickModal = (e) => {
    if (e.target.contains(modalQuickRef.current)) {
      setModalQuick(null);
    }
  };
  return (
    <>
      {modalQuick && (
        <div
          className="fixed z-[9999] w-full h-full inset-0 overflow-y-auto flex items-center bg-[#00000020] justify-center"
          ref={modalQuickRef}
          style={{
            backdropFilter: "blur(12px)",
          }}
          onClick={handleOffQuickModal}
        >
          {module && (
            <div
              className="bg-white p-4 shadow-lg rounded-md"
              style={{
                pointerEvents: isPending ? "none" : "all",
              }}
            >
              <h3 className="mb-4 font-medium">
                Thêm nhanh {module.module.name}
              </h3>
              <div>
                <form action={handleSubmit}>
                  {module.fields.map((field, index) => {
                    const Component = components[field.type];
                    if (Component) {
                      return (
                        <div key={index} className="mb-2">
                          <p className="text-md">{field.label}</p>
                          <Component field={field} module={module} />
                        </div>
                      );
                    }else{
                      console.log(field.type)
                    }
                  })}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setModalQuick(null)}
                      className="border rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      Đóng
                    </button>
                    <button className="border rounded-md px-2 py-1 bg-outline text-white hover:bg-green-500 ml-2">
                      Tạo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuickCreate;
