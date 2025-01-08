"use client";
import { GalleryContext } from "@/context/ImageProvider";
import { useContext, useEffect, useId, useRef } from "react";
import Group from "../../../[module]/(context-image)/create/components/Group";
import ImageCustom from "@/components/Maintain/Image";

const ImageComponent = ({
  field,
  defaultValue,
  oldData,
  updateData,
  itemData,
}) => {
  const { setShowMedia, itemCurrent, setItemCurrent, choosed, isMultiple } =
    useContext(GalleryContext);
  const imageRef = useRef(null);
  const id = useId();
  const handleShowUpload = () => {
    setShowMedia(id);
  };

  useEffect(() => {
    if (isMultiple) return;
    const index = itemCurrent.findIndex((item) => item.id == id);
    if (index !== -1) {
      imageRef.current.src = itemCurrent[index]?.data
        ? process.env.NEXT_PUBLIC_ENDPOINT_URL + itemCurrent[index]?.data.url
        : "/next.svg";

      updateData(
        {
          target: {
            value: JSON.stringify(itemCurrent[index]?.data),
          },
        },
        itemData.id,
        field
      );
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCurrent, choosed]);

  useEffect(() => {
    let itemCurrent;
    try {
      itemCurrent = JSON.parse(defaultValue || "");
    } catch (e) {
      itemCurrent = null;
    }
    if (itemCurrent) {
      setItemCurrent((prev) => [...prev, { id, data: itemCurrent }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Group field={field}>
      <div className="relative">
        <div className="group w-[200px] h-[200px] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-50 hover:text-white">
          <ImageCustom
            ref={imageRef}
            src={
              itemCurrent.find((item) => item.id == id)
                ? process.env.NEXT_PUBLIC_ENDPOINT_URL +
                  itemCurrent.find((item) => item.id == id).data.url
                : "/next.svg"
            }
            height={0}
            width={0}
            className="absolute top-0 left-0 object-contain px-4"
            style={{ width: "100%", height: "100%" }}
            alt={"image"}
          />
          <button
            type="button"
            className="group-hover:opacity-100 py-4 px-6 group-hover:border group-hover:border-white rounded-[99px] opacity-0 absolute transition top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:bg-white hover:text-black"
            onClick={handleShowUpload}
          >
            Chọn ảnh
          </button>
        </div>
      </div>
    </Group>
  );
};

export default ImageComponent;
