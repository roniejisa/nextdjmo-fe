"use client"

import LinkCustom from "@/packages/translation/Link";


const GroupButtonForm = ({ module, isPending,title }) => {
  return (
    <div className="sticky top-0 z-[999] flex items-center justify-between px-4 py-2 bg-white">
      <h2 className="font-bold whitespace-nowrap text-2xl">{title.toUpperCase()}</h2>
      <div className="w-full  rounded-tl-2xl flex  justify-end ">
        <button className="bg-outline  py-2 px-4 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none" disabled={isPending}>
          Lưu
        </button>
        <LinkCustom
          href={process.env.NEXT_PUBLIC_ADMIN_URL+module}
          type="button"
          className="bg-danger ml-2 py-2 px-4 rounded-lg text-white"
        >
          Hủy
        </LinkCustom>
      </div>
    </div>
  );
};

export default GroupButtonForm;
