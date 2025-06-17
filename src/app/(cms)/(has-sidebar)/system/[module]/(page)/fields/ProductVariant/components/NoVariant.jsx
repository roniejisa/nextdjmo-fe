"use client"

const NoVariant = ({
  data,
  handleChangePrice,
  handleChangeSku,
  changeStock,
}) => {
  return (
    <>
      <div className="mt-2">
        <p className="mb-2">Giá</p>
        <input
          type="text"
          data-name="price"
          value={data[0] ? data[0]?.price : ""}
          placeholder="Giá"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          onChange={handleChangePrice}
        />
      </div>
      <div className="mt-2">
        <p className="mb-2">Sku</p>
        <input
          type="text"
          data-name="sku"
          value={data[0] ? data[0]?.sku : ""}
          placeholder="Sku"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          onChange={handleChangeSku}
        />
      </div>
      <div className="mt-2">
        <p className="mb-2">Số lượng</p>
        <input
          type="text"
          data-name="stock"
          value={data[0] ? data[0]?.stock : 0}
          placeholder="Số lượng"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          onChange={changeStock}
        />
      </div>
    </>
  );
};

export default NoVariant;
