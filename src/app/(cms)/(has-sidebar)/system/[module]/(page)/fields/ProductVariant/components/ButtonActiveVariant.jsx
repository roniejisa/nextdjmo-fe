"use client"
import { useState } from "react";

const ButtonActiveVariant = ({ field, setHasVariant, hasVariant }) => {
  const [activeVariant, setActiveVariant] = useState(
    field.active_variant == "active"
  );
  return (
    <>
      {activeVariant && (
        <>
          <label
            htmlFor={field.name}
            className="border border-double flex items-center justify-center cusor-pointer gap-2 p-2 cursor-pointer w-fit mb-2"
            style={{
              color: hasVariant ? "red" : "green",
            }}
          >
            {hasVariant ? (
              <>
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
                  <path d="M5 12l14 0" />
                </svg>
                Hủy phân loại
              </>
            ) : (
              <>
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
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                Thêm phân loại
              </>
            )}
          </label>
          <input
            type="checkbox"
            id={field.name}
            hidden
            onChange={(e) => setHasVariant(e.target.checked)}
          />
        </>
      )}
    </>
  );
};

export default ButtonActiveVariant;
