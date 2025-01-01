"use client";
import TooltipText from "@/components/Tooltip/Text";
import LinkCustom from "@/packages/translation/Link";

const ReadItem = ({ module, item, data, action }) => {
  return (
    <LinkCustom
      className="ml-2 text-gray-500 px-2 py-1 rounded-md"
      href={process.env.NEXT_PUBLIC_ADMIN_URL + `${module}/${item._id}`}
    >
      <TooltipText label={action.label}>
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
          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M21 12h.01" />
          <path d="M3 12h.01" />
          <path d="M5 15h.01" />
          <path d="M5 9h.01" />
          <path d="M19 15h.01" />
          <path d="M12 18h.01" />
          <path d="M12 6h.01" />
          <path d="M8 17h.01" />
          <path d="M8 7h.01" />
          <path d="M16 17h.01" />
          <path d="M16 7h.01" />
          <path d="M19 9h.01" />
        </svg>
      </TooltipText>
    </LinkCustom>
  );
};

export default ReadItem;
