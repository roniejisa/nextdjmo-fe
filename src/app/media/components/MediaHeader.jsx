import ViewModeToggle from "./ViewModeToggle";
import { FilterDropdown } from "./FilterDropdown";

const MediaHeader = ({ 
  viewMode, 
  onViewModeChange, 
  itemCount,
  filteredCount,
  selectedFilter,
  onFilterChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex w-full items-center flex-wrap justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-white/50">
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-semibold text-gray-800 select-none">
          Tệp tin
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
            {filteredCount !== itemCount ? (
              <>
                <span className="font-medium text-blue-600">{filteredCount}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span>{itemCount}</span>
              </>
            ) : (
              itemCount
            )} items
          </span>
          
          {/* Hiển thị badge khi có filter hoặc search */}
          {(searchTerm || selectedFilter !== 'all') && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              Đã lọc
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Filter Component */}
        <FilterDropdown
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        {/* View Mode Toggle */}
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={onViewModeChange} 
        />
      </div>
    </div>
  );
};

export default MediaHeader;