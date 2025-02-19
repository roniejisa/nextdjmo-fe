"use client";
import React, {
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from "react";
import { configLanguage, getConfiguration } from "./action";

const ConfigurationComponent = () => {
  const [tabCurrent, setTabCurrent] = useState(allTab[0].name);
  const [data, setData] = useState({});
  const [isPending, startTransition] = useTransition(false);
  const [defaultLanguage, setDefaultLanguage] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const deferredInputSearch = useDeferredValue(inputSearch);
  const [filteredData, setFilteredData] = useState([]);

  const handleConfiguration = async () => {
    return getConfiguration(tabCurrent);
  };

  useEffect(() => {
    if (deferredInputSearch) {
      const filtered = data[tabCurrent]?.filter(
        (item) =>
          item.name.toLowerCase().includes(deferredInputSearch.toLowerCase()) ||
          item.code.toLowerCase().includes(deferredInputSearch.toLowerCase())
      );
      setFilteredData(filtered || []); // Cập nhật filteredData
    } else {
      setFilteredData(data[tabCurrent] || []); // Khi không có inputSearch, dùng data gốc
    }
  }, [deferredInputSearch, data, tabCurrent]);

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
    if (response.status == 200) {
      setData((prev) => {
        const languages = prev.language || [];
        const indexLanguageDefaultOld = languages.findIndex(
          (language) => language.default === "active"
        );
        if (indexLanguageDefaultOld != -1) {
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
          document.querySelector(`[data-code="${item.code}"]`).checked = true;
        }
        return {
          ...prev,
          language: languages,
        };
      });
    }
  };
  useEffect(() => {
    if (!data[tabCurrent]) {
      startTransition(async () => {
        const response = await handleConfiguration();
        setData((prev) => ({ ...prev, [tabCurrent]: response.data }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabCurrent]);

  useEffect(() => {
    const item = data["language"]?.find((item) => item.default === "active");
    if (!item) return;
    setDefaultLanguage((prev) => {
      if (prev != item.code) {
        return item.code;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="flex flex-wrap -mx-4">
      <ul className="flex flex-col flex-[0_0_20%] pl-4 sticky top-[68px] self-start h-[calc(100vh-68px-16px*2)] border-r">
        {allTab.map((item, index) => (
          <li
            key={index}
            className="border-b py-2 cursor-pointer"
            onClick={() => {
              setTabCurrent(item.name);
            }}
          >
            <span
              className={`transition hover:opacity-100 ${
                tabCurrent == item.name
                  ? "font-bold text-outline opacity-100"
                  : "opacity-50"
              }`}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex-[0_0_80%] px-4 pb-4">
        <div
          className={`flex flex-col flex-wrap ${
            tabCurrent == "language" ? "" : "hidden"
          }`}
        >
          {isPending ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div>
                <div className="flex mb-2">
                  <input
                    type="text"
                    className="p-2"
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)}
                    placeholder="Ngôn ngữ cần tìm"
                    autoComplete="off"
                  />
                </div>
                <div className="flex">
                  <label className="flex flex-[0_0_300px] gap-2">
                    <div></div>
                    <div className="flex-[0_0_220px]">
                      <b>Ngôn ngữ</b>
                    </div>
                    <div>
                      <b>Code</b>
                    </div>
                  </label>
                  <div></div>
                </div>
                {filteredData
                  .sort((a, b) => {
                    if (a.default === "active") {
                      return -1;
                    } else if (a.active === "active") {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((item) => {
                    return (
                      <div className="flex mt-1" key={item._id}>
                        <label className="flex flex-[0_0_300px] gap-2 cursor-pointer">
                          <div>
                            <input
                              type="checkbox"
                              defaultChecked={item.active == "active"}
                              data-code={item.code}
                              onChange={(e) =>
                                handleChangeLanguage(
                                  e.target.checked,
                                  item,
                                  item.default
                                )
                              }
                            />
                          </div>
                          <div className="flex-[0_0_220px]">{item.name}</div>
                          <div>{item.code}</div>
                        </label>
                        <div>
                          {defaultLanguage == item.code ? (
                            <div className="p-1 text-red-500 pointer-events-none">
                              Mặc định
                            </div>
                          ) : (
                            <button
                              className="border p-1 rounded-sm"
                              onClick={() => {
                                handleChangeLanguage(true, item, "active");
                              }}
                            >
                              Mặc định
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex flex-col flex-wrap ${
            tabCurrent == "notification" ? "" : "hidden"
          }`}
        >
          <h3 className="text-3xl font-bold mb-3">Thông báo</h3>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationComponent;

const allTab = [
  {
    name: "language",
    value: "Ngôn ngữ",
  },
  {
    name: "notification",
    value: "Thông báo",
  },
];
