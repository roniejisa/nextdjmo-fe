"use client";

import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client";

const ImageList = ({ value, item }) => {
  let listImage = [];
  try {
    listImage = JSON.parse(value);
  } catch (e) {}
  return (
    <div
      rs-preview={item._id}
      style={{
        cursor: "zoom-in",
      }}
    >
      {listImage.length > 0 ? (
        <div>
          <div
            rs-preview-show={"true"}
            className="w-full h-full"
            key={listImage[0]._id}
          >
            <span className="relative block w-[80px] h-[80px]">
              <ImageCustom
                fill={true}
                src={showImageUrl(listImage[0])}
                alt={item.name}
                className="w-full h-full object-constain"
              />
              {listImage.length > 1 ? (
                <>
                  {listImage.slice(1).map((item, index) => (
                    <span
                      className={`absolute bg-white right-0 border-left shadow-md block h-[80px]`}
                      style={{
                        width:`calc(70px - (${index} * 10px))`,
                      }}
                      key={item._id}
                    >
                      <ImageCustom
                        fill={true}
                        src={showImageUrl(item)}
                        alt={item.name}
                      />
                    </span>
                  ))}
                  <div className="absolute top-0 right-0 flex items-center justify-center w-[80px] font-bold text-xl h-full bg-gradient-to-r from-transparent to-black text-active-light">
                    +{listImage.length}
                  </div>
                </>
              ) : (
                <></>
              )}
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ImageList;
