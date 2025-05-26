"use client";

import { useEffect, useState } from "react";
import { getDataHistory } from "./action";
import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client/util";

const HistoryTab = () => {
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [listHistory, setListHistory] = useState([]);

  const updateData = async () => {
    const data = await getDataHistory(email, startTime, endTime);
    setListHistory(data.data);
  };
  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="px-2 w-full">
      {/* Chọn ngày */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                e.key == "Enter" && updateData();
              }}
              value={email}
              className="form-control p-2"
              placeholder="Tài khoản cần tìm"
            />
          </div>
          <div className="flex gap-2 whitespace-nowrap items-center">
            <label htmlFor="start-time">Bắt đầu</label>
            <input
              type="date"
              id="start-time"
              className="p-2"
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex gap-2 whitespace-nowrap items-center">
            <label htmlFor="end-time">Kết thúc</label>
            <input
              type="date"
              id="end-time"
              className="p-2"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <button className="border p-2 rounded-md" onClick={updateData}>
          Tìm kiếm
        </button>
      </div>

      <table className="w-full mt-10 border border-collapse border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">IP</th>
            <th className="border border-gray-300 p-2">Thời gian</th>
            <th className="border border-gray-300 p-2">Tài khoản</th>
            <th className="border border-gray-300 p-2">Hành động</th>
            <th className="border border-gray-300 p-2">Dữ liệu</th>
            <th className="border border-gray-300 p-2">Thay đổi</th>
          </tr>
        </thead>
        <tbody>
          {listHistory.map((history) => {
            const changed_data = JSON.parse(history.changed_data);
            return (
              <tr key={history._id}>
                <td className="border border-gray-300 p-2">{history.ip}</td>
                <td className="border border-gray-300 p-2">
                  {history.time_at}
                </td>
                <td className="border border-gray-300 p-2">
                  {history.customer.email} | {history.customer.username}
                </td>
                <td className="border border-gray-300 p-2">{history.action}</td>
                <td className="border border-gray-300 p-2">{history.table}</td>
                <td className="border border-gray-300 p-2">
                  {Array.isArray(changed_data) &&
                    changed_data.map((item, index) => {
                      if (item["old"] && item["new"]) {
                          if(item['type'] == 'image'){
                            return (<div key={index} className="flex">
                              Sửa {item["label"]} : <div className="flex ml-2">{<ImageCustom src={showImageUrl(item['old'])} width={60} height={60} />}<span className="mx-2">{" -> "}</span>{<ImageCustom src={showImageUrl(item['new'])} width={60} height={60} />}</div>
                            </div>)
                          }else{
                            return (
                              <div key={index}>
                                Sửa {item["label"]} : <del className="text-red-500">{item["old"]}</del>{" -> "}<span className="text-green-500">{item["new"]}</span>
                              </div>
                            );
                          }
                      }else if(item['new']){
                        if(item['type'] == 'image'){
                          return (<div key={index}>
                            Thêm {item["label"]} : {<ImageCustom src={showImageUrl(item['new'])} width={60} height={60} />}
                          </div>)
                        }else{
                        return (
                            <div key={index}>
                              Thêm {item["label"]} : <span className="text-green-500">{item["new"]}</span>
                            </div>
                          );
                        }
                      }else{
                        if(item['type'] == 'image'){
                          return (<div key={index}>
                            Xóa {item["label"]} : {<ImageCustom src={showImageUrl(item['old'])} width={60} height={60} />}
                          </div>)
                        }else{
                          return (
                            <div key={index}>
                              Xóa {item["label"]} : <del className="text-red-500">{item["old"]}</del>
                            </div>
                          );
                        }
                      }
                    })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTab;
