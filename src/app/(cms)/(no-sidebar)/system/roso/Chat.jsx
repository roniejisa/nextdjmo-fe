"use client";

import CustomEditor from "@/components/EditorCustom/EditorCustom";
import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.scss";
import { useMessage } from "@/hooks/useMessage";

const Chat = () => {
  const { setEditorHeight, heightChat, isStreaming, submitFormQuestion, editorRef } =
    useMessage();
  const [value, setValue] = useState("");
  const boxEditorRef = useRef(null);
  const buttonRef = useRef(null);
  const boxFileRef = useRef(null);
  const listImage = [];

  // Text temp
  const handleSend = (content) => {
    // textRef.current.value = content;
    setValue(content);
    // Bạn có thể thực hiện các hành động khác như gửi dữ liệu lên server tại đây
  };
  const submitForm = () => {
    buttonRef.current.click();
  };

  useEffect(() => {
    if (value.length > 0) {
      setEditorHeight(heightChat + boxEditorRef.current.clientHeight - 52);
    } else {
      setEditorHeight(heightChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const changeFile = (e) => {
    boxFileRef.current.innerHTML = "";
    for (var url of listImage) {
      window.URL.revokeObjectURL(url);
    }
    for (var file of e.target.files) {
      var imageUrl = window.URL.createObjectURL(file);
      listImage.push(imageUrl);
      const imageEl = document.createElement("img");
      imageEl.width = "80";
      imageEl.height = "80";
      imageEl.src = imageUrl;
      boxFileRef.current.append(imageEl);
    }
  };

  return (
    <>
      {/* Hiển thị hiệu ứng gõ chữ khi đang stream */}
      <div ref={boxEditorRef} className="m-4 rounded-md">
        <form
          className="w-full lg:max-w-[70%] mx-auto rounded-md"
          action={submitFormQuestion}
        >
          <div className="relative flex h-full max-w-full flex-1 flex-col">
            <div className="group relative flex flex-col w-full">
              <label
                htmlFor="file-upload"
                className="flex justify-start mb-2"
                ref={boxFileRef}
              ></label>
              <div className="flex w-full flex-col gap-1.5 p-1.5 transition-colors contain-inline-size bg-white border rounded-md">
                <div className="flex items-end gap-1.5 pl-4 md:gap-2">
                  <div className="-ml-2.5 flex opacity-100 will-change-auto">
                    <div className="relative">
                      <div className="relative">
                        <div className="flex flex-col">
                          <input
                            multiple={true}
                            type="file"
                            name="image"
                            id="file-upload"
                            tabIndex="-1"
                            className="hidden"
                            onChange={changeFile}
                            hidden
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center cursor-pointer justify-center h-8 w-8 text-token-text-primary text-color focus-visible:outline-black mb-1"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </label>
                          <div
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:r3q:"
                            data-state="closed"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div
                      className={`max-h-[25dvh] overflow-auto default-browser ${styles["default-browser"]}`}
                    >
                      <textarea
                        name="message"
                        hidden
                        defaultValue={value}
                      ></textarea>
                      <CustomEditor
                        placeholder="Bạn muốn tôi giúp gì?"
                        ref={editorRef}
                        sendContent={handleSend}
                        submitForm={submitForm}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      disabled={value.length <= 0 && !isStreaming}
                      ref={buttonRef}
                      aria-label="Send"
                      data-testid="send-button"
                      className={`mb-1 me-1 flex h-8 w-8 items-center justify-center bg-active text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-main disabled:text-[#f4f4f4] disabled:hover:opacity-100 disabled:bg-[#D7D7D7]`}
                    >
                      {isStreaming ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />
                        </svg>
                      ) : (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon-2xl"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
