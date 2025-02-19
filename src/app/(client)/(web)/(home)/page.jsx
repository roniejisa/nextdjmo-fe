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
      <div className="mb-10">
        <div className="lg:flex flex-wrap">
          <div className="flex-1 lg:max-w-[100%] mb-4 lg:mb-0">
            <SlideProvider
              slides={slides}
              component={SlideComponent}
              height="800px"
              autoPlay={true}
              ms={300}
            />
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
