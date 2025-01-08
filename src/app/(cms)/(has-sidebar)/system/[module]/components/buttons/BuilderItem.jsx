"use client";
import TooltipText from "@/components/Tooltip/Text";
import LinkCustom from "@/packages/translation/Link";

const BuilderItem = ({ module, item, data, action }) => {
  return (
    <LinkCustom
      className="ml-2 text-gray-500 px-2 py-1 rounded-md"
      href={process.env.NEXT_PUBLIC_ADMIN_URL + `${module}/builder/${item._id}`}
    >
      <TooltipText label={action.label}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-building"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 21l18 0" />
          <path d="M9 8l1 0" />
          <path d="M9 12l1 0" />
          <path d="M9 16l1 0" />
          <path d="M14 8l1 0" />
          <path d="M14 12l1 0" />
          <path d="M14 16l1 0" />
          <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
        </svg>
      </TooltipText>
    </LinkCustom>
  );
};

export default BuilderItem;
