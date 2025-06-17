"use client"

const AttributeInput = ({
  setAttribute,
  attribute,
  showProductAttributeAvailable,
  inputAddAttributeRef,
  field,
  suggestionRef,
  setShowSuggestion,
  showSuggestion,
  addAttribute,
}) => {
  return (
    <div className="p-4 relative z-10 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/10 border border-white/20 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <div className="flex gap-3 relative">
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-slate-700 drop-shadow-sm mb-2">
            Thêm thuộc tính mới
          </label>
          <input
            type="text"
            data-name="attribute"
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm border border-white/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-0 focus:border-blue-400/50 transition-all duration-200 text-slate-700 placeholder-slate-400 font-medium"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
            placeholder="Nhập tên thuộc tính (vd: Màu sắc, Kích thước...)"
            ref={inputAddAttributeRef}
            onMouseDown={showProductAttributeAvailable}
          />
          {field.data_product_attributes.length > 0 && showSuggestion && (
            <div
              className="absolute top-full left-0 w-full mt-2 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl z-50 rounded-xl shadow-[8px_8px_24px_rgba(0,0,0,0.2),-4px_-4px_12px_rgba(255,255,255,0.9)] border border-white/40 overflow-hidden max-h-64 overflow-y-auto"
              ref={suggestionRef}
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-slate-600 drop-shadow-sm mb-2 px-2">
                  Gợi ý thuộc tính
                </div>
                <div className="space-y-1">
                  {field.data_product_attributes.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm border border-white/30 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.6)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:from-blue-50/60 hover:to-blue-100/40 cursor-pointer transition-all duration-200 text-slate-700 hover:text-slate-900 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setAttribute(item.name);
                        setShowSuggestion(false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-end">
          <button 
            type="button" 
            onClick={addAttribute} 
            tabIndex="-1"
            className="px-6 py-3 font-medium rounded-xl bg-gradient-to-br from-blue-500/90 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/80 disabled:from-gray-400/60 disabled:to-gray-500/50 border border-white/30 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.3)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.4)] disabled:shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transform hover:scale-95 disabled:scale-100 transition-all duration-200 text-white disabled:text-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Thêm
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeInput;