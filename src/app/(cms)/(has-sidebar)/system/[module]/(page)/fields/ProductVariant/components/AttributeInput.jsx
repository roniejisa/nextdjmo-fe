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
    <div className="flex border p-2 gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          data-name="attribute"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          placeholder="Thuộc tính"
          ref={inputAddAttributeRef}
          onMouseDown={showProductAttributeAvailable}
        />
        {field.data_product_attributes.length > 0 && showSuggestion && (
          <div
            className="absolute top-10 left-0 w-full bg-white z-10"
            ref={suggestionRef}
          >
            {field.data_product_attributes.map((item, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
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
        )}
      </div>
      <button type="button" onClick={addAttribute} tabIndex="-1">
        Thêm
      </button>
    </div>
  );
};

export default AttributeInput;
