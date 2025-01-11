import ImageCustom from "@/components/Maintain/Image";
import SectionHome from "@/components/ui/client/components/SectionHome";
import SlideComponent from "@/packages/slides/SlideComponent";
import SlideMultipleClient from "@/packages/slides/SlideMultipleClient";
import SlideProvider from "@/packages/slides/SlideProvider";
import { showImageUrl } from "@/utils/client/util";
import { httpClient } from "@/utils/http";

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
      <div className="px-10">
        <div className="flex flex-wrap -mx-2">
          <div className="flex-[0_0_75%] max-w-[75%] px-2">
            <SlideProvider
              className="rounded-lg"
              slides={slides}
              component={SlideComponent}
              autoPlay={true}
              ms={300}
            />
          </div>
          <div className="flex-[0_0_25%] flex flex-col px-2 gap-4">
            {slides.map((item, index) => {
              return (
                <div key={index} className="bg-black rounded-lg flex-1">
                  <div className="flex justify-center items-center relative rounded-lg w-full h-full">
                    <ImageCustom
                      className="rounded-lg"
                      src={showImageUrl(item?.image)}
                      alt={item?.name}
                      fill={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SlideMultipleClient />
    </>
  );
};

export default Home;
