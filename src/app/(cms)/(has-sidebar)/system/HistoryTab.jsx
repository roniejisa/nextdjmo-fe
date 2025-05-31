"use client";

import { useEffect, useState } from "react";
import { getDataHistory } from "./action";
import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client/util";
import { cfl } from "@/utils/client/text";

const HistoryTab = () => {
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [listHistory, setListHistory] = useState([]);

  const updateData = async () => {
    const data = await getDataHistory(email, startTime, endTime);
    if(data && data.data){
      setListHistory(data.data);
    }
  };
  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="px-2 w-full">
      {/* Chọn ngày */}
      <div className="flex flex-wrap justify-between gap-2 md:gap-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                e.key == "Enter" && updateData();
              }}
              value={email}
              className="form-control p-2 flex-1"
              placeholder="Tài khoản cần tìm"
            />
          </div>
          <div className="flex gap-2 whitespace-nowrap items-center w-full md:w-auto">
            <label htmlFor="start-time">Bắt đầu</label>
            <input
              type="date"
              id="start-time"
              className="p-2"
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex gap-2 whitespace-nowrap items-center w-full md:w-auto">
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

      <div className="w-full mt-10 space-y-4">
        {listHistory.map((history) => {
          const changed_data = JSON.parse(history.changed_data);
          return (
            <div key={history._id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-600">IP</div>
                  <div className="text-sm break-all">{history.ip}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-600">Thời gian</div>
                  <div className="text-sm">{history.time_at}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-600">Tài khoản</div>
                  <div className="text-sm break-all">
                    {history.customer.email} | {history.customer.username}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-600">Hành động</div>
                  <div className="text-sm">{history.action}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-600">Dữ liệu</div>
                  <div className="text-sm">{history.table}</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm font-semibold text-gray-600 mb-2">Thay đổi</div>
                <div className="space-y-2">
                  {Array.isArray(changed_data) ?
                    changed_data.map((item, index) => {
                      if (item["old"] && item["new"]) {
                        if(item['type'] == 'image') {
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Sửa ${item["label"]}`)}: </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <ImageCustom src={showImageUrl(item['old'])} width={60} height={60} />
                                <span className="text-sm">→</span>
                                <ImageCustom src={showImageUrl(item['new'])} width={60} height={60} />
                              </div>
                            </div>
                          )
                        } else if(item['type'] == 'editor'){
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Sửa ${item["label"]}`)}: </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div dangerouslySetInnerHTML={{__html:item['old']}}></div>
                                <span className="text-sm">→</span>
                                <div dangerouslySetInnerHTML={{__html:item['new']}}></div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div key={index} className="text-sm break-words">
                              {cfl(`Sửa ${item["label"]}`)} : 
                              <del className="text-red-500 mx-1">{item["old"]}</del>
                              <span className="mx-1">→</span>
                              <span className="text-green-500">{item["new"]}</span>
                            </div>
                          );
                        }
                      } else if(item['new']) {
                        if(item['type'] == 'image') {
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Thêm ${item["label"]}`)}: </span>
                              <ImageCustom src={showImageUrl(item['new'])} width={60} height={60} />
                            </div>
                          )
                        } else if(item['type'] == 'editor'){
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Sửa ${item["label"]}`)}: </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div dangerouslySetInnerHTML={{__html:item['new']}}></div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div key={index} className="text-sm break-words">
                              {cfl(`Thêm ${item["label"]}`)} : 
                              <span className="text-green-500 ml-1">{item["new"]}</span>
                            </div>
                          );
                        }
                      } else {
                        if(item['type'] == 'image') {
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Xóa ${item["label"]}`)}: </span>
                              <ImageCustom src={showImageUrl(item['old'])} width={60} height={60} />
                            </div>
                          )
                        } else if(item['type'] == 'editor'){
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-sm">{cfl(`Sửa ${item["label"]}`)}: </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div dangerouslySetInnerHTML={{__html:item['old']}}></div>
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div key={index} className="text-sm break-words">
                              {cfl(`Xóa ${item["label"]}`)} : 
                              <del className="text-red-500 ml-1">{item["old"]}</del>
                            </div>
                          );
                        }
                      }
                    }) : <>
                    </>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTab;
