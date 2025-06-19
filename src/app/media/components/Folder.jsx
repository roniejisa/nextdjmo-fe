"use client";
import Edit from "@/components/Icon/svg/Edit";
import FolderUpload from "@/components/Icon/svg/FolderUpload";
import Open from "@/components/Icon/svg/Open";
import Trash from "@/components/Icon/svg/Trash";
import React, { useContext, useEffect, useRef } from "react";
import { deleteFolder, editFolder, getFolders } from "../action";
import { MediaContext } from "../MediaProvider";
import Dot from "@/components/Icon/svg/Dot";
import { CMSContext } from "@/context/cms/CMSProvider";
import { useNotify } from "@/context/NotifyProvider";
import { useAutoMaxHeight } from "@/hooks/useAutoMaxHeight";
import { useMediaStore } from "@/stories/files/mediaStore";

const Folder = () => {
  const notify = useNotify();
  const menuListRef = useRef(null);
  const { menuRef } = useContext(MediaContext);
  const folders = useMediaStore((state) => state.folders);
  const setFolders = useMediaStore((state) => state.setFolders);
  const breadcrumbs = useMediaStore((state) => state.breadcrumbs);
  const addToBreadcrumbs = useMediaStore((state) => state.addToBreadcrumbs);
  const resetDataFolder = useMediaStore((state) => state.resetDataFolder);
  const openMenuIndex = useMediaStore((state) => state.openMenuIndex);
  const setOpenMenuIndex = useMediaStore((state) => state.setOpenMenuIndex);
  const { setShowModalQuestion, setModalOptions } = useContext(CMSContext);

  // Reset menuRef khi folders thay đổi
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current = [];
    }
  }, [folders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuIndex !== null &&
        menuRef.current[openMenuIndex]?.el &&
        !menuRef.current[openMenuIndex].el.contains(event.target)
      ) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
  }, [breadcrumbs]);

  const handleFolderClick = (folder) => {
    addToBreadcrumbs(folder);
    resetDataFolder();
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setOpenMenuIndex(null); // Đóng menu trước khi mở modal
    setShowModalQuestion(true);
    setModalOptions({
      title: "Sửa tên thư mục",
      component: (
        <input
          type="text"
          autoComplete="off"
          name="name"
          className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-3 text-slate-700 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent transition-all duration-300"
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
          setFolders(folders.map((item) => item._id === folder._id ? { ...item, filename: body.name, } : item));
          setShowModalQuestion(false);
          setModalOptions({});
          notify.changeNotify("success", response?.message || "Thành công!");
        }
      },
    });
  };

  const handleDeleteFolder = async (e, folder) => {
    e.stopPropagation();
    setOpenMenuIndex(null); // Đóng menu trước khi mở modal
    setShowModalQuestion(true);
    setModalOptions({
      title: "Xóa thư mục",
      component: (
        <div>
          <p className="mb-4 text-red-400 bg-red-50/80 backdrop-blur-sm p-3 rounded-lg border border-red-200/50">
            Lưu ý: (Sau khi xóa dữ liệu bên trong thư mục cũng sẽ bị xóa sạch!)
          </p>
          <input
            type="password"
            autoComplete="off"
            name="password"
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-3 text-slate-700 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent transition-all duration-300"
            placeholder="Nhập mật khẩu"
          />
        </div>
      ),
      btnAccept: "Xóa",
      btnCancel: "Hủy",
      confirm: async (form) => {
        const body = Object.fromEntries(form);
        body.folder_id = folder._id;
        if (!body.password) {
          return notify.changeNotify("error", "Vui lòng nhập mật khẩu");
        }
        const response = await deleteFolder(body);
        if (response.status == 200) {
          const newFolders = folders.filter((item) => item._id !== folder._id);
          setFolders(newFolders);
          setShowModalQuestion(false);
          setModalOptions({});
          notify.changeNotify("success", response?.message || "");
        } else {
          notify.changeNotify("error", response?.message || "");
        }
      },
    });
  };

  useAutoMaxHeight(menuListRef, 3, [folders]);

  return (
    <>
      {/* Header với Glassmorphism */}
      <div className="flex items-center justify-between px-6 bg-gradient-to-r from-slate-50/80 via-white/60 to-indigo-50/80 backdrop-blur-xl border-b border-white/40 h-[67px] shadow-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent select-none">
            Thư mục
          </h3>
          <span className="text-sm font-medium text-slate-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-inner border border-white/50">
            {folders.length} thư mục
          </span>
        </div>
      </div>

      {folders && folders.length > 0 && (
        <div
          className="flex flex-col overflow-auto bg-gradient-to-br from-slate-50 to-slate-100/80"
          ref={menuListRef}
        >
          {folders?.map((folder, index) => (
            <div
              key={folder._id}
              className="col-span-1 p-2"
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleFolderClick(folder);
              }}
              ref={(el) => {
                // Cải thiện logic ref assignment
                if (el && menuRef.current) {
                  const existingIndex = menuRef.current.findIndex(
                    (menu) => menu.id === folder._id
                  );
                  if (existingIndex >= 0) {
                    menuRef.current[existingIndex].el = el;
                  } else {
                    menuRef.current.push({
                      id: folder._id,
                      el,
                    });
                  }
                }
              }}
            >
              {/* Folder Item với Neumorphism */}
              <div
                className={`group relative bg-gradient-to-br from-white to-slate-50/90 backdrop-blur-sm rounded-2xl shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-white/60 cursor-pointer hover:shadow-[12px_12px_24px_#c1c5cb,-12px_-12px_24px_#ffffff] transition-all duration-500 transform hover:scale-[1.02] hover:rotate-[0.5deg] ${
                  openMenuIndex === index ? "z-[2000]" : "z-10"
                }`}
              >
                <div className="py-4 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl shadow-inner flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                      <FolderUpload />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                      {folder.filename}
                    </span>
                  </div>

                  {/* Menu Button với Neumorphism */}
                  <div className="relative">
                    <button
                      className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200/80 rounded-xl shadow-[4px_4px_8px_#c1c5cb,-4px_-4px_8px_#ffffff] border border-white/70 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:shadow-[6px_6px_12px_#b1b5bb,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c1c5cb,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 transform hover:scale-105"
                      onDoubleClick={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          "Menu button clicked for folder:",
                          folder.filename,
                          "index:",
                          index
                        ); // Debug log
                        if (openMenuIndex === index) {
                          setOpenMenuIndex(null);
                        } else {
                          setOpenMenuIndex(index);
                        }
                      }}
                    >
                      <Dot />
                    </button>

                    {/* Dropdown Menu với Glassmorphism */}
                    {openMenuIndex === index && (
                      <div className="min-w-[200px] absolute top-[calc(100%+12px)] z-[200] right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-slate-50/50"></div>
                        <ul className="w-full p-2 relative z-10">
                          <li>
                            <button
                              className="p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/60 hover:shadow-inner w-full rounded-xl text-slate-700 hover:text-slate-900 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFolderClick(folder);
                                setOpenMenuIndex(null);
                              }}
                            >
                              <div className="w-5 h-5 text-green-500">
                                <Open />
                              </div>
                              <span>Mở thư mục</span>
                            </button>
                          </li>
                          <li>
                            <button
                              className="p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/60 hover:shadow-inner w-full rounded-xl text-slate-700 hover:text-slate-900 font-medium"
                              onClick={(e) => handleEditFolder(e, folder)}
                            >
                              <div className="w-5 h-5 text-blue-500">
                                <Edit />
                              </div>
                              <span>Sửa tên</span>
                            </button>
                          </li>
                          <li>
                            <button
                              className="p-3 flex items-center gap-3 text-red-500 hover:text-red-600 transition-all duration-300 hover:bg-red-50/60 hover:shadow-inner w-full rounded-xl font-medium"
                              onClick={(e) => handleDeleteFolder(e, folder)}
                            >
                              <div className="w-5 h-5">
                                <Trash />
                              </div>
                              <span>Xóa</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Folder;
