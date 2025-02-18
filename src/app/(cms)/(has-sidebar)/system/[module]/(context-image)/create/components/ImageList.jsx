"use client";
import { GalleryContext } from "@/context/cms/ImageProvider";
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
    <div className="relative" rs-preview={field.name}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-1">
        {itemCurrent.find((item) => item.id == id) ? (
          <>
            {itemCurrent
              .find((item) => item.id == id)
              ?.items.map((item, index) => (
                <div
                  className="relative border rounded-md group before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:opacity-0 p-2 before:transition-opacity before:duration-300 before:z-10 before:ease-in-out hover:before:opacity-70 before:rounded-md h-40 w-40"
                  key={index}
                >
                  <div className="relative w-full h-full">
                    <ImageCustom
                      src={
                        item?.url
                          ? process.env.NEXT_PUBLIC_ENDPOINT_URL + item.url
                          : "/next.svg"
                      }
                      fill={true}
                      sizes="100vw"
                      style={{
                        objectFit: "contain",
                      }}
                      className="border rounded-md"
                      alt={""}
                    />
                  </div>
                  <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 justify-center group-hover:opacity-100 opacity-0">
                    <button
                      className=" text-white hover:text-[#d8d8d8] transition duration-300 py-1 px-2"
                      rs-preview-show={"true"}
                      type="button"
                    >
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
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                      </svg>
                    </button>
                    <button
                      className=" text-white hover:text-[#d8d8d8] transition duration-300 py-1 px-2"
                      onClick={() => deleteItem(item._id)}
                      type="button"
                    >
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
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </button>
                  </div>
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
          className="h-[160px] border-dashed hover:border-outline border-2 hover:text-outline text-black transition-all duration-300 rounded-md"
          onClick={handleShowUpload}
        >
          + Chọn ảnh
        </button>
      </div>
    </div>
  );
};

export default ImageListComponent;
