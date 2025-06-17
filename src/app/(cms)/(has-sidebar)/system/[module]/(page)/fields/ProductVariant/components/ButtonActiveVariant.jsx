"use client"
import { useState } from "react";

const ButtonActiveVariant = ({ field, setHasVariant, hasVariant }) => {
  const [activeVariant, setActiveVariant] = useState(
    field.active_variant == "active"
  );
  
  return (
    <>
      {activeVariant && (
        <div className="mb-4 p-4 relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
          <div className="relative z-10">
            <label
              htmlFor={field.name}
              className={`
                inline-flex items-center gap-3 px-6 py-3 font-medium rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-95 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]
                ${hasVariant 
                  ? 'bg-gradient-to-br from-red-500/90 to-red-600/80 hover:from-red-600/90 hover:to-red-700/80 text-white' 
                  : 'bg-gradient-to-br from-emerald-500/90 to-emerald-600/80 hover:from-emerald-600/90 hover:to-emerald-700/80 text-white'
                }
              `}
            >
              {hasVariant ? (
                <>
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
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                  </svg>
                  <span>Hủy phân loại</span>
                </>
              ) : (
                <>
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
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                  <span>Thêm phân loại</span>
                </>
              )}
            </label>
            
            <input
              type="checkbox"
              id={field.name}
              hidden
              onChange={(e) => setHasVariant(e.target.checked)}
            />
            
            <div className="mt-3 text-xs text-slate-600/80 drop-shadow-sm">
              {hasVariant 
                ? "Nhấn để tắt phân loại và sử dụng thông tin sản phẩm đơn giản" 
                : "Nhấn để thêm các thuộc tính phân loại như màu sắc, kích thước..."
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonActiveVariant;