import { notFound } from "next/navigation";
import { cache } from "react";
import { getDataModule, getProfile } from "../[module]/actions";
import ButtonUpload from "./ButtonUpload";
import { getToken } from "@/utils/server/utils";

const cacheGetDataModule = cache(async (module) => {
  return await getDataModule(module);
});
export async function generateMetadata({ params, searchParams }, parent) {
  const moduleName = "settings";
  const { data } = await cacheGetDataModule(moduleName);
  if (!data) {
    return notFound();
  }
  let { module: moduleMain } = data || {};
  return {
    title: moduleMain.name,
  };
}

const VideoPage = async ({ profile }) => {
  const moduleName = "videos";
  const user = await getProfile();
  const { data } = await cacheGetDataModule(moduleName);
  const token = await getToken();
  if (!data) {
    return notFound();
  }

  let { module: moduleMain } = data || {};
  
  return (
    <div className="px-4">
      <div className="flex py-4 sticky top-0 z-10 bg-white">
        <h1 className="text-3xl font-bold">{moduleMain.name}</h1>
        <div className="ml-auto">
          {user.permissions.includes(`${moduleName}.create`) && (
            <ButtonUpload token={token}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
