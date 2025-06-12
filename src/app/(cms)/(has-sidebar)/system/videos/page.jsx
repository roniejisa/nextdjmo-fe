export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from "next/navigation";
import { cache } from "react";
import { getDataModule, getProfile } from "../[module]/actions";
import ClientVideoPage from "./ClientVideoPage";
import Pagination from "@/components/Pagination/Pagination";

const cacheGetDataModule = cache(async (module, limit, page, searchParams) => {
  return await getDataModule(module, limit, page, searchParams);
});

export async function generateMetadata({ params, searchParams }, parent) {
  const { limit, page, ...propSearchParams } = await searchParams;
  const moduleName = "videos";
  const { data } = await cacheGetDataModule(
    moduleName,
    limit,
    page,
    propSearchParams
  );
  if (!data) {
    return notFound();
  }
  let { module: moduleMain } = data || {};
  return {
    title: moduleMain?.name,
  };
}

const VideoPage = async ({ profile, searchParams }) => {
  const { limit, page, ...propSearchParams } = await searchParams;
  const moduleName = "videos";
  const user = await getProfile();
  const { data } = await getDataModule(
    moduleName,
    limit,
    page,
    propSearchParams
  );
  if (!data) {
    return notFound();
  }

  let {
    items,
    limit: limitItem,
    page: pageItem,
    total,
    module: moduleMain,
  } = data || {};

  console.log(items)
  return (
    <div className="p-4">
      <ClientVideoPage
        permissions={user.permissions}
        items={items}
        moduleName={moduleName}
        nameLabel={moduleMain?.name}
      />

      {/* Pagination */}
      {items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-md border border-slate-200/60 p-2">
            <Pagination
              page={pageItem}
              limit={limitItem}
              total={total}
              module={moduleName}
              items={items}
              searchParams={propSearchParams}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
