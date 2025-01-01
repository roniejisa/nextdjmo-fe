"use client";
import TooltipText from "@/components/Tooltip/Text";
import LinkCustom from "@/packages/translation/Link";

const EditItem = ({ module, item, data, action }) => {
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
          class="icon icon-tabler icons-tabler-outline icon-tabler-tool"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
        </svg>
      </TooltipText>
    </LinkCustom>
  );
};

export default EditItem;
