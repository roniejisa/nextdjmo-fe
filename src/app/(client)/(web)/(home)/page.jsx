import ImageCustom from "@/components/Maintain/Image";
import SlideComponent from "@/packages/slides/single/SlideComponent";
import SlideMultipleClient from "@/packages/slides/multiple/SlideMultipleClient";
import SlideProvider from "@/packages/slides/single/SlideProvider";
import { showImageUrl } from "@/utils/client/util";
import { httpClient } from "@/utils/http";
import LinkCustom from "@/packages/translation/Link";
import Image from "next/image";
import Submenu from "./Submenu";

export const getDataHome = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "homepage"
  );
  return response.data;
};
const Home = async () => {
  const { slides } = await getDataHome();
  return (
    <>
      <div className="px-10 py-10">
        <div className="lg:flex flex-wrap -mx-2">
          <div className="flex-[0_0_75%] lg:max-w-[75%] px-2 mb-4 lg:mb-0">
            <SlideProvider
              className="rounded-lg"
              slides={slides}
              component={SlideComponent}
              height="500px"
              autoPlay={true}
              ms={300}
            />
          </div>
          <div className="flex-[0_0_25%] flex flex-wrap lg:flex-col px-2 gap-4">
            {slides?.map((item, index) => {
              return (
                <div key={index} className="bg-black rounded-lg md:flex-1 h-[200px] lg:h-auto w-full">
                  <LinkCustom
                    href={item?.url}
                    className="flex justify-center items-center relative rounded-lg w-full h-full"
                  >
                    <ImageCustom
                      className="rounded-lg object-cover"
                      src={showImageUrl(item?.image)}
                      alt={item?.name}
                      fill={true}
                    />
                  </LinkCustom>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Submenu />
      <SlideMultipleClient />
      <SlideMultipleClient />
      <SlideMultipleClient />
      <SlideMultipleClient />
      {/* <SectionHome /> */}
    </>
  );
};

export default Home;
