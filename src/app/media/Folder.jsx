"use client";
import Edit from "@/components/Icon/svg/Edit";
import FolderUpload from "@/components/Icon/svg/FolderUpload";
import Open from "@/components/Icon/svg/Open";
import Trash from "@/components/Icon/svg/Trash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getFolders } from "./action";
import { useMedia } from "./MediaProvider";
import Dot from "@/components/Icon/svg/Dot";

const Folder = () => {
  const { folders, setFolders, breadcrumbs, setBreadcrumbs, loadedPages } =
    useMedia((media) => media);
  const [openMenuIndex, setOpenMenuIndex] = useState(null); // Lưu index của menu đang mở
  const menuRefs = useRef([]); // Mảng chứa ref của từng menu

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex]?.el &&
        !menuRefs.current[openMenuIndex].el.contains(event.target)
      ) {
        setOpenMenuIndex(null); // Đóng menu nếu click bên ngoài
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenuIndex]);
  const getFolder = async () => {
    const response = await getFolders({
      folder_id:
        breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1]._id : null,
    });
    setFolders(response.data);
  };

  useEffect(() => {
    getFolder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadcrumbs]);

  const handleFolderClick = (folder) => {
    setBreadcrumbs((prev) => [...prev, folder]);
    loadedPages.current = new Set();
  };
  return (
    <>
      {folders && folders.length > 0 && (
        <div className="">
          <h3 className="mb-3 text-xl px-4 font-medium">Thư mục</h3>
          <div className="grid grid-cols-4 gap-4 p-4">
            {folders?.map((folder, index) => (
              <div
                key={folder._id}
                className={"col-span-1"}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleFolderClick(folder);
                }}
                ref={(el) => {
                  if (
                    menuRefs.current.filter((menu) => menu.id == folder._id)
                      .length === 0
                  ) {
                    menuRefs.current.push({
                      id: folder._id,
                      el,
                    });
                  }
                }}
              >
                <div className="border rounded-lg p-4 cursor-pointer hover:shadow-2xl transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4 font-bold">
                    <FolderUpload />
                    <span>{folder.filename}</span>
                  </div>
                  <div className="transition cursor-pointer group rounded-md hover:bg-gray-100 relative">
                    <span
                      className="group-hover:text-outline transition w-6 h-6 flex justify-center items-center"
                      onDoubleClick={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openMenuIndex === index) {
                          setOpenMenuIndex(null);
                        } else {
                          setOpenMenuIndex(index);
                        }
                      }}
                    >
                      <Dot />
                    </span>
                    {openMenuIndex === index && (
                      <div className="min-w-[150px] absolute top-[calc(100%+10px)] z-[999] right-0 shadow-lg bg-white rounded-md">
                        <ul className="w-full p-2">
                          <li>
                            <button
                              className="p-2 flex items-center gap-2 transition-all hover:bg-gray-200 w-full rounded-md"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleFolderClick(folder);
                              }}
                            >
                              <Open />
                              <span>Mở thư mục</span>
                            </button>
                          </li>
                          <li>
                            <button className="p-2 flex items-center gap-2 transition-all hover:bg-gray-200 w-full rounded-md">
                              <Edit />
                              <span>Sửa tên</span>
                            </button>
                          </li>
                          <li>
                            <button className="p-2 flex items-center gap-2 text-red-400 transition-all hover:bg-gray-200 w-full rounded-md">
                              <Trash />
                              <span>Xóa</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Folder;
