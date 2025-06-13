import { getToken } from "@/utils/server/utils";

import GrapesBuilder from "../../main/GrapesBuilder";
import { getProfile } from "@/app/(cms)/(has-sidebar)/system/[module]/actions";
import { redirect } from "next/navigation";

export const generateMetadata = async () => {
  return {
    title:"PAGE BUILDER"
  }
}

const UpdatePage = async ({ params }) => {
  const { id } = await params;
  const token = await getToken();
  const profile = await getProfile();
  if (
    !token ||
    !profile.permissions ||
    !profile.permissions.includes("pages.update")
  )
    return redirect("/");
  return <GrapesBuilder token={token} profile={profile} id={id} />;
};

export default UpdatePage;
