import { showDate } from "@/utils/client/util";
import LinkCustom from "@/packages/translation/Link";
import FullModel from "./Model";
import Tab from "./Tab";
import { cookies } from "next/headers";
import ProductItem from "@/components/ui/client/items/ProductItem";
import { redirect } from "next/navigation";
import ArtistItem from "@/components/ui/client/items/ArtistItem";
import { cache } from "react";

const getProduct = async (slug, ssId) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + `product/${slug}`,
      {
        headers: {
          ssId,
        },
      }
    );
    const data = await response.json();
    return data.data;
  } catch (e) {
    return {};
  }
};

const getHotline = cache(async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-setting/hotline"
    );
    const data = await response.json();
    return data.data;
  } catch (e) {
    return null;
  }
});

const page = async ({ params }) => {
  const { slug } = await params;
  const ssId = cookies().get("ssId")?.value;
  const data = await getProduct(slug, ssId);
  const hotline = await getHotline();
  if (Object.keys(data).length === 0) return redirect("/404");
  return (
    <div className="mt-10 px-10">
      <div className="flex gap-10 border-b py-10">
        {/* <Gallery data={data} /> */}
        <div className="relative flex-[0_0_40%] min-h-[400px]">
          <FullModel model={"/gom.gltf"} />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-semibold mb-3">{data.name}</h1>
          {data.author?.slug && (
            <p>
              Từ{" "}
              <LinkCustom
                href={`/tac-gia/${data?.author?.slug}`}
                alt={data?.author?.name}
                className="opacity-60 hover:text-blue-600 hover:opacity-100 transition-all"
              >
                {data?.author?.name}
              </LinkCustom>
            </p>
          )}
          {data.description && (
            <p>
              <span>Mô tả:</span> {data.description}
            </p>
          )}
          {data.creation_date && (
            <p>
              <span>Ngày hoàn thành:</span>{" "}
              {showDate(data.creation_date, "year")}
            </p>
          )}
          {data.dimension && (
            <p>
              <span>Kích thước:</span> {data.dimension}
            </p>
          )}
          {data.price && <p className="border-t pt-5 mt-5 text-3xl">{Intl.NumberFormat().format(data.price)} VND</p>}
          {hotline && (
            <div className="flex items-center gap-4  mt-10 ">
              <a
                href={"tel:" + hotline}
                className="inline-flex rounded-[99px] text-white text-lg px-8 py-2 border bg-gray-600 hover:bg-white transition-all hover:border-gray-600 hover:text-gray-600"
              >
                Liên hệ
              </a>
            </div>
          )}
        </div>
      </div>
      <Tab data={data} />

      {/* Về tác giả */}
      <section className="py-4">
        <h3 className="border-b mb-4 text-2xl pb-4 font-medium">Tác giả</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap -mx-4 -my-4 pb-2">
            <ArtistItem
              item={{
                ...data.author,
              }}
            />
            {data.author.products.map(({ name, slug, price, image }, index) => {
              return (
                <ProductItem
                  key={slug || index}
                  index={index}
                  item={{
                    name,
                    price,
                    author: { slug: data.author.slug, name: data.author.name },
                    slug,
                    image,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
      {/* Kết thúc về tác giả */}
      {data.recent_products.length ? (
        <section className="py-4">
          <h3 className="border-b mb-4 text-2xl pb-4 font-medium">
            Tác phẩm đã xem
          </h3>
          <div className="flex flex-wrap -mx-4 -my-4">
            {data.recent_products.map((item, index) => {
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
    </div>
  );
};

export default page;
