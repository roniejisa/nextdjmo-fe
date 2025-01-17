"use client";

import { AllContext } from "@/context/cms/AllProvider";
import { useContext, useState } from "react";
import { addActivityForOrder } from "../action";
import { useNotify } from "@/context/NotifyProvider";

const ActivityOrder = ({ order }) => {
  const notify = useNotify();
  const createActivites = () => {
    return Object.entries(
      order.activities
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .reduce((acc, item) => {
          const date = new Date(item.datetime);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const hour = date.getHours();
          const minute = date.getMinutes();
          if (!acc[`${year}-${month}-${day}`]) {
            acc[`${year}-${month}-${day}`] = [];
          }
          acc[`${year}-${month}-${day}`].push({
            ...item,
            time: `${hour}:${minute}`,
          });
          return acc;
        }, {})
    )
      .sort((a, b) => {
        return new Date(b[0]) - new Date(a[0]);
      })
      .map((item) => {
        const time = new Date(item[0]);
        const date = time.getDate();
        const month = time.getMonth() + 1;
        const year = time.getFullYear();
        // Xác định thứ trong tuần
        const days = [
          "Chủ Nhật",
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
        ];
        const day = days[time.getDay()]; // Lấy tên thứ từ mảng days

        return {
          date: `${day}, ngày ${date} tháng ${month} năm ${year}`,
          activities: item[1],
        };
      });
  };
  const [activities, setActivities] = useState(() => {
    return createActivites();
  });

  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);

  const addActivityOrder = () => {
    setShowModalQuestion(true);
    setModalOptions({
      title: "Thêm hành trình",
      component: (
        <div>
          <div>
            <label>
              <span className="mb-2 block">Tên</span>
              <input
                type="text"
                name="name"
                placeholder="Nhập tên"
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
              />
            </label>
          </div>
          <div>
            <label>
              <span className="mb-2 block">Ghi chú</span>
              <textarea
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
                type="text"
                name="note"
                placeholder="Ghi chú"
              ></textarea>
            </label>
          </div>
          <div>
            <label>
              <span className="mb-2 block">Thời gian</span>
              <input
                className="w-full outline-outline outline-4 transition border rounded-md p-2"
                type="datetime-local"
                name="datetime"
                placeholder="Thời gian"
              />
            </label>
          </div>
        </div>
      ),
      confirm: async (form) => {
        const body = Object.fromEntries(form);
        body.order_id = order._id;
        const response = await addActivityForOrder(body);
        if (response.status === 200) {
          order.activities.push(body);
          setActivities(createActivites());
          notify.changeNotify("success", response.message);
        } else {
          notify.changeNotify("error", response.message);
        }
      },
      btnAccept: "Thêm",
    });
  };
  return (
    <div className="shadow-md p-4 rounded-md border">
      <div className="flex items-center gap-4 justify-between">
        <p className="text-xl font-bold">Hành trình</p>
        <button
          className="text-orange-500 bg-orange-100 px-2 py-1 rounded transition-all duration-300 hover:bg-orange-500 hover:text-white"
          onClick={addActivityOrder}
        >
          Thêm hành trình
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {activities.map((item, index) => (
          <div className={`flex flex-col gap-2`} key={index}>
            <p className="text-sm font-bold mb-1">{item.date}</p>
            <div className="">
              {item.activities.map((data, indexData) => {
                const isLast = 0 === index && indexData === 0;
                return (
                  <div
                    className={`pl-5 flex flex-col gap-2 relative ${
                      indexData < item.activities.length - 1
                        ? "before:content-[''] before:absolute before:left-[3px] before:top-[20px] before:h-[calc(100%-20px)] before:w-[2px] before:bg-gray-300"
                        : ""
                    } ${item.activities.length - 1 > indexData ? "pb-6" : ""}`}
                    key={data._id}
                  >
                    <div>
                      <p
                        className={`text-sm font-bold relative before:absolute before:w-2 before:h-2 before:left-0 before:top-[6px] ${
                          isLast
                            ? "before:bg-green-500 text-green-500"
                            : "before:bg-outline"
                        } before:rounded-full before:-left-[20px]`}
                      >
                        {data.name}
                      </p>
                      {data.note && (
                        <p className="text-sm text-gray-500">{data.note}</p>
                      )}
                      <p className="text-sm text-gray-400">{data.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityOrder;
