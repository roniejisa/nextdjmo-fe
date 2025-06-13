import { notFound } from "next/navigation";
import { getDataModule } from "../[module]/actions";
import MenuBuilder from "@/packages/menu_builder/MenuBuilder";

export async function generateMetadata() {
  return {
    title: 'Quản lý Menu',
    robots: "noindex, nofollow",
  };
}

const LinkBuilder = async ({}) => {
  const moduleName = "links";
  const { data } = await getDataModule(moduleName);
  if (!data) {
    return notFound();
  }

  let { module: moduleMain, items } = data || {};
  return (
    <>
      <MenuBuilder data={data} moduleMain={moduleMain} items={items} />
    </>
  );
};

export default LinkBuilder;
