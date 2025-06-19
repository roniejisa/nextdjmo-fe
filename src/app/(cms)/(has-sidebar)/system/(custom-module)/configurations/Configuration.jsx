"use client";
import React, {
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from "react";
import { configLanguage, getConfiguration } from "./action";
import NotificationTabContent from "./NotificationTabContent";

// Constants
const ALL_TABS = [
  {
    name: "language",
    value: "Ngôn ngữ",
    icon: "🌐",
    description: "Quản lý ngôn ngữ hệ thống",
  },
  {
    name: "notification",
    value: "Thông báo",
    icon: "🔔",
    description: "Cấu hình thông báo",
  },
];

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  </div>
);

// Search Input Component
const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
    />
  </div>
);

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <nav className="w-full lg:w-80 lg:sticky lg:top-[9rem] lg:self-start">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Cấu hình</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý thiết lập hệ thống</p>
      </div>

      <div className="p-2">
        <ul className="space-y-1">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                onClick={() => onTabChange(tab.name)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === tab.name
                    ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{tab.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tab.description}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

// Language Item Component
const LanguageItem = ({
  item,
  defaultLanguage,
  onToggleActive,
  onSetDefault,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        {/* Checkbox */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={item.active === "active"}
            data-code={item.code}
            onChange={(e) => onToggleActive(e.target.checked, item)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>

        {/* Language Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded">
              {item.code}
            </span>
          </div>
          {item.active === "active" && (
            <p className="text-xs text-green-600 mt-1">Đang hoạt động</p>
          )}
        </div>
      </div>

      {/* Default Language Button */}
      <div className="ml-4">
        {defaultLanguage === item.code ? (
          <div className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
            Mặc định
          </div>
        ) : (
          <button
            onClick={() => onSetDefault(item)}
            className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            Đặt mặc định
          </button>
        )}
      </div>
    </div>
  </div>
);

// Language Tab Content
const LanguageTabContent = ({
  data,
  isPending,
  inputSearch,
  setInputSearch,
  filteredData,
  defaultLanguage,
  handleChangeLanguage,
}) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Quản lý ngôn ngữ
      </h1>
      <p className="text-gray-600">
        Cấu hình các ngôn ngữ hỗ trợ và thiết lập ngôn ngữ mặc định
      </p>
    </div>

    {isPending ? (
      <LoadingSpinner />
    ) : (
      <div className="space-y-6">
        {/* Search */}
        <SearchInput
          value={inputSearch}
          onChange={setInputSearch}
          placeholder="Tìm kiếm ngôn ngữ theo tên hoặc mã..."
        />

        {/* Language List */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy ngôn ngữ
              </h3>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredData
              .sort((a, b) => {
                if (a.default === "active") return -1;
                if (b.default === "active") return 1;
                if (a.active === "active") return -1;
                if (b.active === "active") return 1;
                return 0;
              })
              .map((item) => (
                <LanguageItem
                  key={item._id}
                  item={item}
                  defaultLanguage={defaultLanguage}
                  onToggleActive={(checked, item) =>
                    handleChangeLanguage(checked, item, item.default)
                  }
                  onSetDefault={(item) =>
                    handleChangeLanguage(true, item, "active")
                  }
                />
              ))
          )}
        </div>

        {/* Statistics */}
        {filteredData.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredData.length}
                </div>
                <div className="text-sm text-gray-500">Tổng số</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    filteredData.filter((item) => item.active === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">Hoạt động</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {
                    filteredData.filter((item) => item.default === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">Mặc định</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {
                    filteredData.filter((item) => item.active === "unactive")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">Không hoạt động</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

// Main Configuration Component
const ConfigurationComponent = () => {
  const [tabCurrent, setTabCurrent] = useState(ALL_TABS[0].name);
  const [data, setData] = useState({});
  const [isPending, startTransition] = useTransition();
  const [defaultLanguage, setDefaultLanguage] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const deferredInputSearch = useDeferredValue(inputSearch);
  const [filteredData, setFilteredData] = useState([]);

  const handleConfiguration = async () => {
    return getConfiguration(tabCurrent);
  };

  // Filter data based on search
  useEffect(() => {
    if (deferredInputSearch) {
      const filtered = data[tabCurrent]?.filter(
        (item) =>
          item.name.toLowerCase().includes(deferredInputSearch.toLowerCase()) ||
          item.code.toLowerCase().includes(deferredInputSearch.toLowerCase())
      );
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data[tabCurrent] || []);
    }
  }, [deferredInputSearch, data, tabCurrent]);

  // Handle language configuration
  const handleChangeLanguage = async (
    checked,
    item,
    defaultLanguage = "unactive"
  ) => {
    const response = await configLanguage({
      code: item.code,
      active: checked ? "active" : "unactive",
      default: defaultLanguage,
    });

    if (response.status === 200) {
      setData((prev) => {
        const languages = prev.language || [];
        const indexLanguageDefaultOld = languages.findIndex(
          (language) => language.default === "active"
        );

        if (indexLanguageDefaultOld !== -1) {
          languages[indexLanguageDefaultOld].default = "unactive";
        }

        const indexLanguageChange = languages.findIndex(
          (language) => language.code === item.code
        );

        if (indexLanguageChange !== -1) {
          languages[indexLanguageChange].active = checked
            ? "active"
            : "unactive";
          languages[indexLanguageChange].default = defaultLanguage;
        }
        if (defaultLanguage === "active" && checked) {
          const code = document.querySelector(`[data-code="${item.code}"]`);
          if (code) {
            code.checked = true;
          }
        }

        return {
          ...prev,
          language: languages,
        };
      });
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!data[tabCurrent]) {
      startTransition(async () => {
        const response = await handleConfiguration();
        setData((prev) => ({ ...prev, [tabCurrent]: response.data }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabCurrent]);

  // Update default language
  useEffect(() => {
    const item = data["language"]?.find((item) => item.default === "active");
    if (item && defaultLanguage !== item.code) {
      setDefaultLanguage(item.code);
    }
  }, [data, defaultLanguage]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab Navigation */}
          <TabNavigation
            tabs={ALL_TABS}
            activeTab={tabCurrent}
            onTabChange={setTabCurrent}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {tabCurrent === "language" && (
              <LanguageTabContent
                data={data}
                isPending={isPending}
                inputSearch={inputSearch}
                setInputSearch={setInputSearch}
                filteredData={filteredData}
                defaultLanguage={defaultLanguage}
                handleChangeLanguage={handleChangeLanguage}
              />
            )}

            {tabCurrent === "notification" && <NotificationTabContent />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationComponent;
