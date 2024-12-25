import ArtistItem from "@/components/ui/client/items/ArtistItem";
import ProductItem from "@/components/ui/client/items/ProductItem";
import LinkCustom from "@/packages/translation/Link";
import { chooseColorIndex, showImageUrl } from "@/utils/client/util";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import Image from "next/image";

const getSeachPages = async (q) => {
  try {
    const token = await getToken();
    const data = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "search",
      {
        Authorization: `Bearer ${token}`,
      },
      { q },
      "POST"
    );
    return data.data;
  } catch (e) {
    return {
      products: [],
      artists: [],
    };
  }
};
const SearchPage = async ({ q }) => {
  const data = await getSeachPages(q);
  const { products, artists } = data;
  const count = products.length + artists.length;
  return (
    <>
      <div className="px-10">
        <div className="flex flex-col gap-2 items-center py-10">
          <h1 className="text-4xl">Kết quả tìm kiếm: {q}</h1>
          <p className="text-gray-500 text-xl">{count} kết quả được tìm thấy</p>
        </div>
      </div>
      {products.length > 0 ? (
        <section className="px-10 py-4">
          <h3 className="border-b mb-4 text-2xl pb-4 font-medium">Tác phẩm</h3>
          <div className="flex flex-wrap -mx-4 -my-4">
            {products.map((item, index) => {
              return (
                <ProductItem
                  key={item._id || index}
                  index={index}
                  item={item}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {artists.length > 0 ? (
        <section className="px-10 py-4">
          <h3 className="border-b mb-4 text-2xl pb-4 font-medium">Tác giả</h3>
          <div className="">
            <div className="flex flex-wrap -mx-4">
              {artists.map(
                (
                  {
                    _id,
                    name: artistName,
                    slug: artistSlug,
                    image,
                    short_description,
                  },
                  index
                ) => (
                  <>
                    <div
                      className="lg:flex-[0_0_calc(100%/3)] md:flex-[0_0_calc(100%/2)] flex-[0_0_calc(100%)] px-4 pb-2"
                      key={_id}
                    >
                      <LinkCustom
                        href={"/tac-gia/" + artistSlug}
                        alt={artistName}
                        className="flex py-4 link-product group"
                      >
                        <div
                          className="bg-color h-full flex"
                        >
                          <div className="relative h-[200px] min-w-[200px] mb-3">
                            <Image
                              src={showImageUrl(image)}
                              alt={artistName}
                              fill={true}
                              className="mb-3 w-full h-full object-contain group-hover:scale-90 transition-all duration-300 ease-in-out"
                            />
                          </div>
                          <div className="px-4">
                            <span className="text-2xl">{artistName}</span>
                            <p className="flex-1 line-clamp-6">{short_description}</p>
                          </div>
                        </div>
                      </LinkCustom>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default SearchPage;
