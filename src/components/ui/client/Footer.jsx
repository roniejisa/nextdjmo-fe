import LinkCustom from "@/packages/translation/Link";
import { getLogo } from "./Header";
import { showImageUrl } from "@/utils/client/util";
import FormReceive from "./FormReceive";
import { httpClient } from "@/utils/http";
import ImageCustom from "@/components/Maintain/Image";

const getConfigs = async () => {
  try {
    const res = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-setting",
      {},
      {
        keys: ["copyright", "hotline", "address"],
      },
      "POST"
    );
    return res;
  } catch (e) {
    return {};
  }
};

const Footer = async () => {
  const configs = await getConfigs();
  const { copyright, hotline, address } = configs.data;
  const logo = await getLogo();
  return (
    <footer className="pt-8 bg-[#251c14] text-black">
      <div className="flex flex-wrap justify-center items-center px-4 lg:px-10 lg:gap-[80px]">
        <div className="flex flex-col text-white text-right">
          <span className="block text-2xl">Liên hệ</span>
          <p className="text-[#928e8a]">{hotline}</p>
        </div>
        <LinkCustom href="/" className="flex h-[200px]">
          <ImageCustom
            src={showImageUrl(logo?.data)}
            alt="logo"
            width={300}
            height={100}
            style={{ objectFit: "contain" }}
          />
        </LinkCustom>
        <div className="flex flex-col text-white">
          <span className="block text-2xl">Vị trí</span>
          <p className="text-[#928e8a]">{address}</p>
        </div>
        {/* <FormReceive /> */}
      </div>
      {copyright && (
        <div className="mt-10 py-6 border-t border-[#928e8a] text-center lg:px-10 text-[#928e8a]">
          <span>{copyright}</span>
        </div>
      )}
    </footer>
  );
};

export default Footer;
