import { httpClient } from "@/utils/http";
import { deleteFile } from "./action";

export const mediaOptions = (id, fn) => {
    return [
        {
            text: "Xóa",
            attribute: {
                onClick: async () => {
                    const response = await deleteFile(id)
                    return fn('delete-file', response, id)
                }
            }
        }
    ]
};
