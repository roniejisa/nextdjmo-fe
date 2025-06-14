"use client";
import Edit from "@/components/Icon/svg/Edit";
import FolderUpload from "@/components/Icon/svg/FolderUpload";
import Open from "@/components/Icon/svg/Open";
import Trash from "@/components/Icon/svg/Trash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { deleteFolder, editFolder, getFolders } from "./action";
import { useMedia } from "./MediaProvider";
import Dot from "@/components/Icon/svg/Dot";
import { CMSContext } from "@/context/cms/CMSProvider";
import { useNotify } from "@/context/NotifyProvider";

const Folder = () => {
  const notify = useNotify();
  const {
    folders,
    setFolders,
    breadcrumbs,
    setBreadcrumbs,
    menuRef,
    resetDataFolder,
    openMenuIndex,
    setOpenMenuIndex,
  } = useMedia((media) => media);

  const { setShowModalQuestion, setModalOptions } = useContext(CMSContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuIndex !== null &&
        menuRef.current[openMenuIndex]?.el &&
        !menuRef.current[openMenuIndex].el.contains(event.target)
      ) {
        setOpenMenuIndex(null); // Đóng menu nếu click bên ngoài
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenuIndex, menuRef, breadcrumbs]);
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
    resetDataFolder();
  };

  const handleEditFolder = (e, folder) => {
    setShowModalQuestion(true);
    setModalOptions({
      title: "Sửa tên thư mục",
      component: (
        <input
          type="text"
          autoComplete="off"
          name="name"
          className="w-full outline-outline outline-4 transition border rounded-md p-2"
          placeholder="Tên thư mục"
          defaultValue={folder.filename}
        />
      ),
      btnAccept: "Sửa tên",
      btnCancel: "Hủy",
      confirm: async (form) => {
        const body = Object.fromEntries(form);
        const response = await editFolder({
          id: folder._id,
          ...body,
        });
        if (response.status == 200) {
          setFolders((prev) => {
            const newFolders = prev.map((item) =>
              item._id === folder._id
                ? {
                    ...item,
                    filename: body.name,
                  }
                : item
            );
            return newFolders;
          });
          setShowModalQuestion(false);
          setModalOptions({});
          notify.changeNotify("success", response?.message || "Thành công!");
        }
      },
    });
  };

  const handleDeleteFolder = async (e, folder) => {
    setShowModalQuestion(true);
    setModalOptions({
      title: "Xóa thư mục",
      component: (
        <div>
          <p className="mb-2 text-red-500">Lưu ý: (Sau khi xóa dữ liệu bên trong thư mục cũng sẽ bị xóa sạch!)</p>
          <input
            type="password"
            autoComplete="off"
            name="password"
            className="w-full outline-outline outline-4 transition border rounded-md p-2"
            placeholder="Nhập mật khẩu"
          />
        </div>
      ),
      btnAccept: "Xóa",
      btnCancel: "Hủy",
      confirm: async (form) => {
        const body = Object.fromEntries(form);
        body.folder_id = folder._id;
        const response = await deleteFolder(body);
        if (response.status == 200) {
          setFolders((prev) => {
            const newFolders = prev.filter((item) => item._id !== folder._id);
            return newFolders;
          });
          setShowModalQuestion(false);
          setModalOptions({});
          notify.changeNotify("success", response?.message || "");
        } else {
          notify.changeNotify("error", response?.message || "");
        }
      },
    });
  };

  return (
    <>
      {folders && folders.length > 0 && (
        <div className="select-none">
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
                    menuRef.current.filter((menu) => menu.id == folder._id)
                      .length === 0
                  ) {
                    menuRef.current.push({
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
                            <button
                              className="p-2 flex items-center gap-2 transition-all hover:bg-gray-200 w-full rounded-md"
                              onClick={(e) => handleEditFolder(e, folder)}
                            >
                              <Edit />
                              <span>Sửa tên</span>
                            </button>
                          </li>
                          <li>
                            <button
                              className="p-2 flex items-center gap-2 text-red-400 transition-all hover:bg-gray-200 w-full rounded-md"
                              onClick={(e) => handleDeleteFolder(e, folder)}
                            >
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
