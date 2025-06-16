import { cfl } from "@/utils/client";
import ModuleClient from "./ModuleClient";
import { getSeo } from "./actions";

export async function generateMetadata({ params }) {
  const { module } = await params;
  const { data, status } = await getSeo(module);
  if (status == 200) {
    return {
      title: `${cfl(data.title)}`,
      description: `${cfl(data.description)}`,
      robots: "noindex, nofollow",
    };
  }
  return {
    title: "CMS quản trị",
    robots: "noindex, nofollow",
  };
}

const Module = () => {
  return <ModuleClient />;
};

export default Module;
