import LinkCustom from "@/packages/translation/Link";
import MenuProfile from "./MenuProfile";
import { showImageUrl } from "@/utils/client";
import ImageCustom from "@/components/Maintain/Image";

const SidebarProfile = ({profile}) => {
  if (!profile) redirect("/");
  const {
    user: { avatar, email, username, _id }
  } = profile;
  return (
    <div className="p-2 rounded-xl bg-white mx-4 ">
      <div className="flex gap-2 items-center">
        <LinkCustom
          href={process.env.NEXT_PUBLIC_ADMIN_URL + `customers/${_id}`}
          className="flex-1 gap-2 flex w-full"
        >
          <div className="relative w-10 h-0 pt-10 rounded-full shadow-2xl">
            <ImageCustom
              src={showImageUrl(avatar)}
              alt={username}
              fill={true}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div className="flex flex-col">
            <div>@{username}</div>
            <div className="text-xs text-[#ccc]">{email}</div>
          </div>
        </LinkCustom>
        <MenuProfile id={_id} />
      </div>
    </div>
  );
};

export default SidebarProfile;
