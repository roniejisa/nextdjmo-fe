import { useMediaStore } from "@/stories/files/mediaStore";

export const useCallbackMenu = (notify) => {
  const removeFromMedias = useMediaStore((state) => state.removeFromMedias);
  const removeFromFolders = useMediaStore((state) => state.removeFromFolders);

  const callbackMenu = (type, response, _id) => {
    switch (type) {
      case "delete-file":
        if (response.status === 200) {
          removeFromMedias(_id);
        }
        break;
      case "delete-folder":
        if (response.status === 200) {
          removeFromFolders(_id);
        }
        break;
    }

    if (response.status && response.message) {
      notify.changeNotify(
        response.status === 200 ? "success" : "error",
        response.message
      );
    }
  };

  return callbackMenu;
};
