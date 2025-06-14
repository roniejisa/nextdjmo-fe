export const dynamic = "force-dynamic";
export const revalidate = 0;
import { notFound } from "next/navigation";
import { getDataModule } from "../[module]/actions";
import ClientVideoPage from "./ClientVideoPage";
import Pagination from "@/components/Pagination/Pagination";

export async function generateMetadata() {
  return {
    title: "Quản lý Video",
    robots: "noindex, nofollow",
  };
}

const VideoPage = async ({ searchParams }) => {
  const { limit, page, ...propSearchParams } = await searchParams;
  const moduleName = "videos";
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

  console.log(items);
  return (
    <div className="p-4">
      <ClientVideoPage
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
