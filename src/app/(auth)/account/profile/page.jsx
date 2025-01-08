import { getProfile } from "@/app/(cms)/(has-sidebar)/system/[module]/actions";
import { redirect } from "next/navigation";
import FormUpdate from "./FormUpdate";

const ProfilePage = async () => {
  const profile = await getProfile();
  if (!profile.user) return redirect("/dang-nhap");
  return (
    <div>
      <h1>Profile</h1>
      <FormUpdate />
    </div>
  );
};

export default ProfilePage;
