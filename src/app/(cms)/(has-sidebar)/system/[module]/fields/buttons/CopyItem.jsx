"use client";
import TooltipText from "@/components/Tooltip/Text";
import { copyItem } from "../../actions";
import useRouterCustom from "@/packages/translation/Navigation";
import { useNotify } from "@/context/NotifyProvider";

const CopyItem = ({ module, item, data, action }) => {
  const router = useRouterCustom();
  const notify = useNotify();

  const handleCopyData = async () => {
    const response = await copyItem(module, item._id);
    
    if(response.status == 200){
        notify.changeNotify("success", response.message)
        return router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}/${response.data._id}`)
    }else{
        notify.changeNotify("error", response.message)
    }
  };
  return (
    <button
      className="ml-2 text-gray-500 px-2 py-1 rounded-md"
      onClick={handleCopyData}
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
          <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
          <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
        </svg>
      </TooltipText>
    </button>
  );
};

export default CopyItem;
