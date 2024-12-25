import { cookies } from "next/headers";
import MediaList from "./MediaList";
import UploadForm from "./UploadForm";
import MenuContext from "./components/MenuContext";
import Editor from "./components/Editor";
const MediaPage =async ({searchParams}) => {
    const storeSearchParams = await searchParams
    const {media_id, limit, page} = storeSearchParams
    const storeCookies = await cookies()
    const token = storeCookies.get('token')?.value;
  return (
    <div>
      <UploadForm media_id={media_id} />
      <MediaList token={token} {...storeSearchParams} />
      <MenuContext />
      <Editor />
    </div>
  );
};

export default MediaPage;
