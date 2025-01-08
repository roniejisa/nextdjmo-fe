import LinkCustom from "@/packages/translation/Link";

const Group = ({ children, field: { label }, item }) => {
  return (
    <div className="-mx-2 flex flex-wrap">
      <div className="flex justify-between flex-[0_0_20%] items-start px-2">
        <div className="border w-full flex justify-between rounded-md relative">
          <label className="block p-2">{label}</label>
          <LinkCustom
            href={process.env.NEXT_PUBLIC_ADMIN_URL + "settings/" + item._id}
            className="group absolute -top-4 -right-4 p-2"
            title="Sửa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 text-gray-500 w-4 group-hover:text-outline"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
              <path d="M13.5 6.5l4 4" />
              <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M19.001 15.5v1.5" />
              <path d="M19.001 21v1.5" />
              <path d="M22.032 17.25l-1.299 .75" />
              <path d="M17.27 20l-1.3 .75" />
              <path d="M15.97 17.25l1.3 .75" />
              <path d="M20.733 20l1.3 .75" />
            </svg>
          </LinkCustom>
        </div>
      </div>
      <div className="px-2 flex-1">
        <div className="border rounded-md p-4 shadow-sm">{children}</div>
      </div>
    </div>
  );
};

export default Group;
