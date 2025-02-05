"use client";

import ButtonSubmit from "@/components/ButtonSubmit/ButtonSubmit";
import { useEffect, useRef, useState, useTransition } from "react";
import { fetchTranslate } from "./action";
import { listLanguage } from "../constants/translate";
const Translate = () => {
  const [language, setLanguage] = useState("vi");
  const [languageSwitch, setLanguageSwitch] = useState("en");
  const [isPending, startTranslate] = useTransition();
  const [value, setValue] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const changeLanguageNow = (e) => {
    setLanguage(e.target.value.trim());
    setLanguageSwitch(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const translateData = async (form) => {
    startTranslate(async () => {
      try {
        const data = await fetchTranslate(Object.fromEntries(form));
        if (data !== undefined) {
          setValue(data);
        }
      } catch (error) {
        console.error("Error translating:", error);
      } finally {
        return true;
      }
    });
  };

  // useEffect(() => {
  // console.log("Loading state:", isPending);
  // }, [isPending]);

  // Debounce content
  useEffect(() => {
    const timer = setTimeout(() => {
      language && languageSwitch && content && formRef.current?.requestSubmit();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, language, languageSwitch]);

  useEffect(() => {
    setValue("");
  }, [content]);
  const changeValueToContent = () => {
    if (!language || !languageSwitch || !content) return;
    setLanguage(languageSwitch);
    setLanguageSwitch(language);
    setContent(value);
  };
  return (
    <>
      <form action={translateData} ref={formRef}>
        <input
          type="hidden"
          name="languageSwitch"
          value={languageSwitch ?? ""}
        />
        <div className="flex gap-4 mb-4 items-center">
          <select
            className="block flex-[0_0_110px] bg-background shadow-3d rounded-none w-full px-1 h-[34px] outline-none"
            onChange={changeLanguageNow}
            value={language}
            name="language"
          >
            {listLanguage.map((item) => (
              <option key={item.id} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Vấn đề"
            className="border rounded-md w-full py-1 px-2 focus:bg-border outline-none text-background"
            value={content}
            name="content"
            onChange={(e) => setContent(e.target.value)}
          />
          <ButtonSubmit
            typeButton="button"
            eventClick={changeValueToContent}
            classBtn="ml-2 bg-active px-2 h-[34px] rounded-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 8l4 -4l4 4" />
              <path d="M7 4l0 9" />
              <path d="M13 16l4 4l4 -4" />
              <path d="M17 10l0 10" />
            </svg>
          </ButtonSubmit>
        </div>
        <div className="flex gap-4">
          <ul className="flex-[0_0_110px] w-full flex gap-4 flex-col">
            {listLanguage
              .filter((item) => item.code != language)
              .map((item) => (
                <li
                  className={`rounded-none p-2 flex whitespace-nowrap items-center transition-all duration-300 gap-2 shadow-3d cursor-pointer ${
                    item.code === languageSwitch
                      ? "bg-yellow-active text-active"
                      : ""
                  }`}
                  key={item.id}
                  onClick={() => setLanguageSwitch(item.code)}
                >
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>

          <div className="border p-2 whitespace-pre-wrap w-full rounded-md">
            {isPending ? (
              <p className="w-6 h-6 border-2 rounded-full border-[#00000001] border-t-white animate-spin"></p>
            ) : (
              <>{value}</>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default Translate;
