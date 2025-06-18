import { useState, useRef, useEffect } from 'react';
import { FilterIcon, MoveDownIcon } from 'lucide-react';

const FILTER_TYPES = {
  ALL: 'all',
  IMAGES: 'images',
  VIDEOS: 'videos', 
  DOCUMENTS: 'documents',
  AUDIO: 'audio',
  ARCHIVES: 'archives',
  OTHER: 'other'
};

const FILTER_CONFIG = {
  [FILTER_TYPES.ALL]: {
    label: 'Tất cả',
    extensions: [],
    icon: '📁'
  },
  [FILTER_TYPES.IMAGES]: {
    label: 'Hình ảnh',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'],
    icon: '🖼️'
  },
  [FILTER_TYPES.VIDEOS]: {
    label: 'Video',
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'],
    icon: '🎥'
  },
  [FILTER_TYPES.DOCUMENTS]: {
    label: 'Tài liệu',
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'],
    icon: '📄'
  },
  [FILTER_TYPES.AUDIO]: {
    label: 'Âm thanh',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
    icon: '🎵'
  },
  [FILTER_TYPES.ARCHIVES]: {
    label: 'Nén',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
    icon: '📦'
  },
  [FILTER_TYPES.OTHER]: {
    label: 'Khác',
    extensions: [],
    icon: '📋'
  }
};

const FilterDropdown = ({ selectedFilter, onFilterChange, searchTerm, onSearchChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (filterType) => {
    console.log(filterType)
    onFilterChange(filterType);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm tên file..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 px-3 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6M9 9l6 6M3 21l6-6" />
          </svg>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <FilterIcon className="h-4 w-4" />
          <span className="flex items-center space-x-1">
            <span>{FILTER_CONFIG[selectedFilter]?.icon}</span>
            <span>{FILTER_CONFIG[selectedFilter]?.label}</span>
          </span>
          <MoveDownIcon 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="py-1">
              {Object.entries(FILTER_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleFilterSelect(key)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                    selectedFilter === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-base">{config.icon}</span>
                  <span>{config.label}</span>
                  {selectedFilter === key && (
                    <span className="ml-auto">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { FilterDropdown, FILTER_TYPES, FILTER_CONFIG };