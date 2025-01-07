import LinkCustom from "@/packages/translation/Link";
import { getLogo } from "./Header";
import { showImageUrl } from "@/utils/client/util";
import FormReceive from "./FormReceive";
import { httpClient } from "@/utils/http";
import ImageCustom from "@/components/Maintain/Image";

const getCopyRight = async () => {
  try {
    const res = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-setting/copyright"
    );
    return res;
  } catch (e) {
    return {};
  }
};

const Footer = async () => {
  const copyRight = await getCopyRight();
  const logo = await getLogo();
  return (
    <footer className="pt-8 pb-4 bg-white border-t-[20px] border-t-gray-800 text-black">
      <div className="flex justify-between items-start px-4 lg:px-10">
        <LinkCustom href="/" className="flex h-10">
          <ImageCustom
            src={showImageUrl(logo?.data)}
            alt="logo"
            width={100}
            height={100}
            style={{ objectFit: "contain" }}
          />
        </LinkCustom>
        <FormReceive />
      </div>
      {copyRight && (
        <div className="mt-10 pt-4 px-4 lg:px-10 border-t">
          <span>{copyRight.data}</span>
        </div>
      )}
    </footer>
  );
};

export default Footer;
