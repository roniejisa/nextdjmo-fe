import { httpClient } from "@/utils/http";
import FormContact from "./FormContact";
import { getToken } from "@/utils/server/utils";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";

const getDataContact = async () => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-setting",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      keys: ["logo", "hotline", "social"],
    },
    "POST"
  );

  return response;
};
const Contact = async () => {
  const dataContact = await getDataContact();
  const logo = dataContact.data.find((item) => item.key === "logo");
  const hotline = dataContact.data.find((item) => item.key === "hotline");
  const social = dataContact.data.find((item) => item.key === "social");

  let socialItems = [];
  try {
    socialItems = JSON.parse(social.data) || [];
  } catch (e) {}
  return (
    <div className="px-10">
      <h1 className="text-center text-4xl py-10">Liên hệ</h1>
      <div className="flex gap-10">
        <div className="flex-[0_0_calc(100%/2) flex flex-col flex-1 gap-4">
          <div>
            <Image
              src={showImageUrl(logo?.data)}
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div className="flex justify-start">
            <a href={"tel:" + hotline?.data} name="Liên hệ">
              {hotline?.data}
            </a>
          </div>
          <div>
            <div className="flex gap-4">
              {socialItems.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    name={item.name}
                    rel="noopener noreferrer"
                    className="relative h-0 pt-[60px] w-[60px]"
                  >
                    <Image
                      src={showImageUrl(item.image)}
                      alt={item.name}
                      className="rounded-full object-cover"
                      fill={true}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <FormContact />
      </div>
    </div>
  );
};

export default Contact;
