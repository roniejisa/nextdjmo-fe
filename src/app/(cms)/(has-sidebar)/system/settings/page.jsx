import { notFound } from "next/navigation";
import LinkCustom from "@/packages/translation/Link";
import { getDataModule } from "./actions";
import SettingComponent from "./components/tab/SettingComponent";
import FormSubmit from "./components/tab/FormSubmit";
import { cache } from "react";
import { getProfile } from "../[module]/actions";

const cacheGetDataModule = cache(async (module) => {
  return await getDataModule(module);
});

export async function generateMetadata() {
  return {
    title: "Cài đặt chung",
    robots: "noindex, nofollow",
  };
}

const Module = async () => {
  const moduleName = "settings";
  const user = await getProfile();
  const { data } = await cacheGetDataModule(moduleName);

  if (!data) {
    return notFound();
  }

  let {
    items,
    limit: limitItem,
    page: pageItem,
    fields,
    total,
    module: moduleMain,
  } = data || {};

  fields = fields
    .sort((a, b) => {
      b.sort = b.sort ?? 999999;
      return a.sort - b.sort;
    })
    .filter((item) => {
      item.hidden = item.hidden ?? 0;
      return item.hidden === 0;
    });

  return (
    <div className="px-4">
      <FormSubmit>
        <div className="flex py-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            {moduleMain.name}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            {user.permissions.includes(`${moduleName}.create`) && (
              <LinkCustom
                href={`${moduleName}/create`}
                className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 rounded-lg shadow-sm hover:from-amber-100 hover:to-yellow-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
              >
                <svg
                  className="w-4 h-4 mr-2 text-amber-600 group-hover:text-amber-700 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm mới
              </LinkCustom>
            )}
            <button className="group relative inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-transparent rounded-lg shadow-sm hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95">
              <svg
                className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Lưu lại
              <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
        <SettingComponent data={data} />
      </FormSubmit>
    </div>
  );
};

export default Module;
