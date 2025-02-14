import { MessageContext } from "@/context/cms/MessageProvider";
import { useContext } from "react";

export const useMessage = () => {
    const context = useContext(MessageContext);
    return context
};