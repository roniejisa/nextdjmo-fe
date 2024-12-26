import LinkCustom from "@/packages/translation/Link";
import Image from "next/image";
import { getLogo } from "./Header";
import { showImageUrl } from "@/utils/client/util";
import FormReceive from "./FormReceive";
import { httpClient } from "@/utils/http";

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
    <footer className="pt-8 pb-4 px-10">
      <div className="flex justify-between items-start">
        <LinkCustom href="/">
          <Image
            src={showImageUrl(logo?.data)}
            alt="logo"
            width={100}
            height={100}
          />
        </LinkCustom>
        <FormReceive />
      </div>
      {copyRight && (
        <div className="mt-10 pt-4 border-t">
          <span>{copyRight.data}</span>
        </div>
      )}
    </footer>
  );
};

export default Footer;
