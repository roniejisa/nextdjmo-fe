"use client";

import { ModuleContext } from "@/context/cms/ModuleProvider";
import { useNotify } from "@/context/NotifyProvider";
import useRouterCustom from "@/packages/translation/Navigation";
import { useContext } from "react";
import { deleteItems } from "../actions";
import { CMSContext } from "@/context/cms/CMSProvider";

const ActionTable = ({mutate}) => {
  const { module, selectIds, setSelectIds, selectAllRef, data } =
    useContext(ModuleContext);
  const { setShowModalQuestion, setModalOptions, profile } = useContext(CMSContext);
  const router = useRouterCustom();
  const notify = useNotify();

  // Logic handlers
  const handleShowModalDeleteForm = () => {
    setShowModalQuestion(true);
    setModalOptions({
      title: (
        <span>
          Bạn có chắc chắn muốn xóa {selectIds.length} mục này không ?
        </span>
      ),
      confirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    const response = await deleteItems(module, selectIds);
    notify.changeNotify(
      response.status === 200 ? "success" : "error",
      response.message
    );
    
    if (response.status === 200) {
      resetSelection();
      setShowModalQuestion(false);
      mutate()
    }
  };

  const resetSelection = () => {
    setSelectIds([]);
    if (selectAllRef.current) {
      selectAllRef.current.checked = false;
    }
  };

  // Don't render if no items selected
  if (selectIds.length === 0) {
    return null;
  }

  // Check if user has delete permission
  const hasDeletePermission = profile?.permissions?.includes(`${module}.delete`);

  return (
    <ActionToolbar
      selectedCount={selectIds.length}
      onDelete={handleShowModalDeleteForm}
      hasDeletePermission={hasDeletePermission}
    />
  );
};

// Separate UI Component
const ActionToolbar = ({ selectedCount, onDelete, hasDeletePermission }) => {
  return (
    <div className="sticky bottom-4 left-0 w-full z-50">
      <div className="mx-4 mb-4 bg-white rounded-lg shadow-lg border border-gray-200 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Selection Info */}
          <SelectionInfo count={selectedCount} />
          
          {/* Action Buttons */}
          <ActionButtons 
            onDelete={onDelete}
            hasDeletePermission={hasDeletePermission}
          />
        </div>
      </div>
    </div>
  );
};

// Selection Info Component
const SelectionInfo = ({ count }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <CheckIcon />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {count} mục được chọn
        </span>
        <span className="text-xs text-gray-500">
          Thực hiện các hành động với các mục đã chọn
        </span>
      </div>
    </div>
  );
};

// Action Buttons Component  
const ActionButtons = ({ onDelete, hasDeletePermission }) => {
  return (
    <div className="flex items-center gap-3">
      {hasDeletePermission && (
        <DeleteButton onClick={onDelete} />
      )}
    </div>
  );
};

// Delete Button Component
const DeleteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-2.5 rounded-lg
        text-sm font-medium
        text-red-600 bg-red-50 
        border border-red-200
        hover:bg-red-100 hover:border-red-300
        active:bg-red-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        transition-all duration-200
        group
      `}
    >
      <TrashIcon />
      <span>Xóa</span>
    </button>
  );
};

// Icon Components
const CheckIcon = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 12l5 5l10 -10" />
      <path d="M2 12l5 5m5 -5l5 -5" />
    </svg>
  </div>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4 transition-transform group-hover:scale-110"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default ActionTable;