"use client";
const ProductVariantApplyAll = () => {
  return (
    <div className="flex gap-2">
      <div>
        <input
          type="text"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
        />
      </div>
      <div>
        <input
          type="text"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
        />
      </div>
      <div>
        <input
          type="text"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
        />
      </div>
      <button>Cập nhật tất cả</button>
    </div>
  );
};

export default ProductVariantApplyAll;
