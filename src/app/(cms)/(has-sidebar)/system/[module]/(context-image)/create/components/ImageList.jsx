"use client";
import { GalleryContext } from "@/context/ImageProvider";
import { useContext, useEffect, useId, useRef } from "react";
import ImageCustom from "@/components/Maintain/Image";

const ImageListComponent = ({ field, defaultValue }) => {
  const {
    setShowMedia,
    itemCurrent,
    listImageChoosed,
    setIsMultiple,
    setItemCurrent,
  } = useContext(GalleryContext);
  const textareaRef = useRef(null);
  const id = useId();
  const handleShowUpload = () => {
    setShowMedia(id);
    setIsMultiple(true);
  };

  useEffect(() => {
    const index = itemCurrent.findIndex((item) => item.id == id);
    if (index != -1) {
      const list = itemCurrent.find((item) => item.id == id)?.items;
      textareaRef.current.value = JSON.stringify(list);
      setIsMultiple(false);
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCurrent, listImageChoosed]);

  const deleteItem = (idItem) => {
    setItemCurrent((prev) => {
      const index = prev.findIndex((item) => item.id == id);
      if (index !== -1) {
        const indexItem = prev[index].items.findIndex(
          (itemCurrent) => itemCurrent._id == idItem
        );
        if (indexItem !== -1) {
          prev[index].items.splice(indexItem, 1);
        }
      }
      return [...prev];
    });
  };
  return (
    <div className="relative">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-1">
        {itemCurrent.find((item) => item.id == id) ? (
          <>
            {itemCurrent
              .find((item) => item.id == id)
              ?.items.map((item, index) => (
                <div className="relative border" key={index}>
                  <ImageCustom
                    src={
                      item?.url
                        ? process.env.NEXT_PUBLIC_ENDPOINT_URL + item.url
                        : "/next.svg"
                    }
                    height={0}
                    width={0}
                    sizes="100vw"
                    style={{
                      width: "160px",
                      height: "160px",
                      objectFit: "contain",
                    }}
                    alt={""}
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-200 px-2 py-1 rounded-lg"
                    onClick={() => deleteItem(item._id)}
                    type="button"
                  >
                    Xóa
                  </button>
                </div>
              ))}
          </>
        ) : null}
        <textarea
          type="text"
          ref={textareaRef}
          name={field.name}
          defaultValue={defaultValue || ""}
          hidden
        ></textarea>
        <button
          type="button"
          className="h-[160px] border rounded-md"
          onClick={handleShowUpload}
        >
          + Chọn ảnh
        </button>
      </div>
    </div>
  );
};

export default ImageListComponent;
