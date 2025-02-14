import ImageCustom from "@/components/Maintain/Image";
import Robot from "@/components/three/Robot";
import ThreeRobot from "@/components/three/ThreeScene";
import LinkCustom from "@/packages/translation/Link";
import { formatTime } from "@/utils/client/util";

const News = ({ searchParams }) => {
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  return (
    <div>
      <div className="p-10">
        <div className="flex -mx-4">
          <div className="flex-[0_0_75%] px-4">
            <div className="flex flex-wrap -mx-4 -my-4">
              {Array.from({ length: 12 }).map((item, index) => {
                return (
                  <LinkCustom
                    href={"/"}
                    className="flex-[0_0_33.33%] px-4 py-4 group"
                    key={index}
                  >
                    <div className="shadow-[1px_2px_2px_1px] shadow-light rounded-md group-hover:shadow-active-light transition-all duration-300">
                      <span className="relative h-[200px] block">
                        <ImageCustom
                          src="/images/image-1.avif"
                          fill={true}
                          alt="image"
                          className="rounded-tl-md rounded-tr-md"
                        />
                      </span>
                      <p className="px-4 text-sm mt-2">
                        {formatTime(new Date())}
                      </p>
                      <h3 className="px-4 mt-2 text-lg pb-6 group-hover:text-active transition-all duration-300 font-bold">
                        Tin tức {index + 1}
                      </h3>
                    </div>
                  </LinkCustom>
                );
              })}
            </div>
          </div>
          <div className="flex-[0_0_25%] px-4">
            <h3 className="text-2xl">Chủ đề</h3>
            <div className="mt-4">
              <div>
                <LinkCustom href={"/"}>Đời sống</LinkCustom>
              </div>
              <div>
                <LinkCustom href={"/"}>Kinh nghiệm</LinkCustom>
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <div className="grid grid-cols-3 gap-4"></div>
        <div></div>
      </div>
    </div>
  );
};

export default News;
