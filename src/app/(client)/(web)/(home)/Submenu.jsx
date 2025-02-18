import LinkCustom from "@/packages/translation/Link";
import Image from "next/image";

const Submenu = () => {
  return (
    <section className="px-10 ">
      <h3 className="text-4xl text-center mb-10">Phần chính</h3>
      <div className="lg:flex block justify-center items-center flex-wrap -mx-4 -my-4 ">
        <LinkCustom href="/tin-tuc" className="flex-[0_0_33.33333%] px-4 py-4">
          <div className="border-2 border-gray-500 w-full relative py-10 rounded-md group hover:border-active transition-all duration-300">
            <div className="absolute w-full h-full top-0 left-0 after:content-[''] after:absolute after:w-full after:rounded-md after:h-full after:bg-background after:transition-all  after:bottom-0 group-hover:after:h-0 before:content-[''] before:absolute before:w-full before:rounded-md before:z-[9] before:h-full before:bg-background before:opacity-50 before:transition-all before:top-0 overflow-hidden">
              <Image
                src="/images/img.jpg"
                fill={true}
                alt={""}
                className="object-cover object-top rounded-md"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center text-2xl group-hover:text-active transition-all duration-300">
              <svg
                className="w-10 h-10 mb-2"
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
                <path d="M8 21h8a5 5 0 0 0 5 -5v-3a3 3 0 0 0 -3 -3h-1v-2a5 5 0 0 0 -5 -5h-4a5 5 0 0 0 -5 5v8a5 5 0 0 0 5 5z" />
                <path d="M7 7m0 1.5a1.5 1.5 0 0 1 1.5 -1.5h3a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1 -1.5 1.5h-3a1.5 1.5 0 0 1 -1.5 -1.5z" />
                <path d="M7 14m0 1.5a1.5 1.5 0 0 1 1.5 -1.5h7a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1 -1.5 1.5h-7a1.5 1.5 0 0 1 -1.5 -1.5z" />
              </svg>
              <span>Tin tức</span>
            </div>
          </div>
        </LinkCustom>
        <LinkCustom href="/kham-pha" className="flex-[0_0_33.33333%] px-4 py-4">
          <div className="border-2 border-gray-500 w-full relative py-10 rounded-md group hover:border-active transition-all duration-300">
            <div className="absolute w-full h-full top-0 left-0 after:content-[''] after:absolute after:w-full after:rounded-md after:h-full after:bg-background after:transition-all  after:bottom-0 group-hover:after:h-0 before:content-[''] before:absolute before:w-full before:rounded-md before:z-[9] before:h-full before:bg-background before:opacity-50 before:transition-all before:top-0 overflow-hidden">
              <Image
                src="/images/img.jpg"
                fill={true}
                alt={""}
                className="object-cover object-top rounded-md"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center text-2xl group-hover:text-active transition-all duration-300">
              <svg
                className="w-10 h-10 mb-2"
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
                <path d="M7 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M17 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M16.346 9.17l-.729 -1.261c-.16 -.248 -1.056 -.203 -1.117 .091l-.177 1.38" />
                <path d="M19.761 14.813l-2.84 -5.133c-.189 -.31 -.592 -.68 -1.421 -.68c-.828 0 -1.5 .448 -1.5 1v6" />
                <path d="M7.654 9.17l.729 -1.261c.16 -.249 1.056 -.203 1.117 .091l.177 1.38" />
                <path d="M4.239 14.813l2.84 -5.133c.189 -.31 .592 -.68 1.421 -.68c.828 0 1.5 .448 1.5 1v6" />
                <rect width="4" height="2" x="10" y="12" />
              </svg>
              <span>Khám phá</span>
            </div>
          </div>
        </LinkCustom>
        <LinkCustom href="/chat" className="flex-[0_0_33.33333%] px-4 py-4">
          <div className="border-2 border-gray-500 w-full relative py-10 rounded-md group hover:border-active transition-all duration-300">
            <div className="absolute w-full h-full top-0 left-0 after:content-[''] after:absolute after:w-full after:rounded-md after:h-full after:bg-background after:transition-all  after:bottom-0 group-hover:after:h-0 before:content-[''] before:absolute before:w-full before:rounded-md before:z-[9] before:h-full before:bg-background before:opacity-50 before:transition-all before:top-0 overflow-hidden">
              <Image
                src="/images/img.jpg"
                fill={true}
                alt={""}
                className="object-cover object-top rounded-md"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center text-2xl group-hover:text-active transition-all duration-300">
              <svg
                className="w-10 h-10 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12.4 2l.253 .005a6.34 6.34 0 0 1 5.235 3.166l.089 .163l.178 .039a6.33 6.33 0 0 1 4.254 3.406l.105 .228a6.334 6.334 0 0 1 -5.74 8.865l-.144 -.002l-.037 .052a5.26 5.26 0 0 1 -5.458 1.926l-.186 -.051l-3.435 2.06a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2.435l-.055 -.026a3.67 3.67 0 0 1 -1.554 -1.498l-.102 -.199a3.67 3.67 0 0 1 -.312 -2.14l.038 -.21l-.116 -.092a5.8 5.8 0 0 1 -1.887 -6.025l.071 -.238a5.8 5.8 0 0 1 5.42 -4.004h.157l.15 -.165a6.33 6.33 0 0 1 4.33 -1.963zm1.6 11h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0 -2m3 -4h-10a1 1 0 1 0 0 2h10a1 1 0 0 0 0 -2" />
              </svg>
              <span>Chat</span>
            </div>
          </div>
        </LinkCustom>
        <LinkCustom href="/chu-de" className="flex-[0_0_33.33333%] px-4 py-4">
          <div className="border-2 border-gray-500 w-full relative py-10 rounded-md group hover:border-active transition-all duration-300">
            <div className="absolute w-full h-full top-0 left-0 after:content-[''] after:absolute after:w-full after:rounded-md after:h-full after:bg-background after:transition-all  after:bottom-0 group-hover:after:h-0 before:content-[''] before:absolute before:w-full before:rounded-md before:z-[9] before:h-full before:bg-background before:opacity-50 before:transition-all before:top-0 overflow-hidden">
              <Image
                src="/images/img.jpg"
                fill={true}
                alt={""}
                className="object-cover object-top rounded-md"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center text-2xl group-hover:text-active transition-all duration-300">
              <svg
                className="w-10 h-10 mb-2"
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
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              </svg>
              <span>Chủ đề</span>
            </div>
          </div>
        </LinkCustom>
        <LinkCustom href="/viet-bai" className="flex-[0_0_33.33333%] px-4 py-4">
          <div className="border-2 border-gray-500 w-full relative py-10 rounded-md group hover:border-active transition-all duration-300">
            <div className="absolute w-full h-full top-0 left-0 after:content-[''] after:absolute after:w-full after:rounded-md after:h-full after:bg-background after:transition-all  after:bottom-0 group-hover:after:h-0 before:content-[''] before:absolute before:w-full before:rounded-md before:z-[9] before:h-full before:bg-background before:opacity-50 before:transition-all before:top-0 overflow-hidden">
              <Image
                src="/images/img.jpg"
                fill={true}
                alt={""}
                className="object-cover object-top rounded-md"
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center text-2xl group-hover:text-active transition-all duration-300">
              <svg
                className="w-10 h-10 mb-2"
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
                <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                <path d="M13 8l2 0" />
                <path d="M13 12l2 0" />
              </svg>
              <span>Viết bài</span>
            </div>
          </div>
        </LinkCustom>
      </div>
    </section>
  );
};

export default Submenu;
