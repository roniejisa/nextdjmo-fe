"use client"

const AttributeListRender = ({
  listAttribute,
  dragEnd,
  deleteAttribute,
  changeNameAttribute,
  handleDrop,
  dragOver,
  handleChangeValue,
  dragStart,
  deleteAttributeValue,
}) => {
  return (
    <div className="flex flex-wrap flex-col gap-2">
      {listAttribute.map((item, index) => (
        <div
          className="p-2 pr-16 relative border"
          key={index}
          onDragEnd={dragEnd}
          onDragLeave={(e) => {
            // Remove visual feedback khi drag leave
            e.currentTarget.querySelectorAll(".item-group").forEach((item) => {
              item.classList.remove("drag-over");
            });
          }}
        >
          <button
            type="button"
            onClick={(e) => deleteAttribute(index)}
            className="absolute top-2 right-2"
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
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <input
            type="text"
            className="w-full outline-outline outline-4 transition border rounded-md p-2"
            value={item.name}
            onChange={(e) => changeNameAttribute(e, index)}
          />
          {/* Bắt đầu giá trị ở đây */}
          <div className="flex flex-wrap py-2 -my-2 -mx-4">
            {item.values.map((value, indexValue) => (
              <div
                className="flex-[0_0_50%] px-4 py-2 flex item-group"
                key={indexValue}
                onDragOver={(e) => dragOver(e, index, indexValue)}
                onDrop={(e) => handleDrop(e, index, indexValue)}
              >
                <input
                  type="text"
                  value={value.value}
                  className="w-full outline-outline outline-4 transition border rounded-md p-2 mr-2"
                  placeholder={value.placeholder}
                  onChange={(e) => handleChangeValue(e, index, indexValue)}
                />
                <button
                  draggable="true"
                  onDragStart={(e) => dragStart(e, index, indexValue)}
                  className="text-gray-500 mr-2"
                  tabIndex="-1"
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
                    className="w-4 h-4"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 9l3 3l-3 3" />
                    <path d="M15 12h6" />
                    <path d="M6 9l-3 3l3 3" />
                    <path d="M3 12h6" />
                    <path d="M9 18l3 3l3 -3" />
                    <path d="M12 15v6" />
                    <path d="M15 6l-3 -3l-3 3" />
                    <path d="M12 3v6" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteAttributeValue(index, indexValue)}
                  className="text-gray-500"
                  type="button"
                  tabIndex="-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                    <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributeListRender;
