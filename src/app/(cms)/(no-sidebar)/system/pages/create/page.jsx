import { getToken } from "@/utils/server/utils";

import GrapesBuilder from "../main/GrapesBuilder";
import { getProfile } from "@/app/(cms)/(has-sidebar)/system/[module]/actions";
import { redirect } from "next/navigation";

const BuilderPage = async () => {
  const token = await getToken();
  const profile = await getProfile();
  if (
    !token ||
    !profile.permissions ||
    !profile.permissions.includes("pages.update")
  )
    return redirect("/");
  return <GrapesBuilder token={token} profile={profile} />;
};

export default BuilderPage;
