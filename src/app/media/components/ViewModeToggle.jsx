"use client";

import { VIEW_MODES } from "../lib";

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  const handleViewModeChange = (newMode) => {
    onViewModeChange(newMode);
    // Clear all selections when switching view mode to avoid conflicts
    setTimeout(() => {
      const items = Array.from(
        document.querySelectorAll(".item input[type='checkbox']")
      );
      items.forEach((input) => {
        input.checked = false;
      });
    }, 50);
  };

  return (
    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
      <button
        onClick={() => handleViewModeChange(VIEW_MODES.GRID)}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === VIEW_MODES.GRID
            ? "bg-white/80 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-white/40"
        }`}
        title="Grid View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => handleViewModeChange(VIEW_MODES.LIST)}
        className={`p-2 rounded-md transition-all duration-200 ${
          viewMode === VIEW_MODES.LIST
            ? "bg-white/80 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-white/40"
        }`}
        title="List View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </button>
    </div>
  );
};

export default ViewModeToggle;
