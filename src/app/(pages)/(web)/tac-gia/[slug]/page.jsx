import ProductItem from "@/components/ui/client/items/ProductItem";
import { showDate, showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import Nav from "./Nav";

const getArtist = async (slug) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + "artist/" + slug);
    const data = await response.json();
    return data.data;
  } catch (e) {
    return {};
  }
};
const ArtistPage = async ({ params }) => {
  const storeParam = await params;
  const artist = await getArtist(storeParam.slug);
  if (!artist._id) return redirect("/404");
  let data = [];
  try {
    data = JSON.parse(artist.cv) || [];
  } catch (e) {
    data = [];
  }

  return (
    <>
      <section className="px-10 py-6">
        <div className="flex pb-10 border-b mb-10">
          <div className="flex-[0_0_60%]">
            <div className="flex gap-4 flex-wrap">
              <div>
                <Image
                  src={showImageUrl(artist.image)}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-semibold mb-3">{artist.name}</h1>
                <p className="text-gray-700">
                  {showDate(artist.date, "year")}
                  {artist.native_place ? ", " + artist.native_place : ""}
                </p>
                <p className="text-gray-700">{artist.work_address}</p>
              </div>
            </div>
            {artist.slogan && (
              <blockquote className="text-gray-600 text-lg mt-8">
                “{artist.slogan}”
              </blockquote>
            )}
            <div className="mt-4 font-medium">{artist.short_description}</div>
          </div>
        </div>
      </section>
      <section className="px-10">
        <div className="flex flex-wrap gap-10">
          <Nav data={data} />
          <div className="flex flex-col gap-8 flex-1">
            <div data-id="products">
              <h3 className="border-b mb-4 text-2xl pb-4 font-medium">
                Tác phẩm
              </h3>
              <div className="flex flex-wrap -mx-4 -my-4">
                {artist.products.map((item, index) => {
                  return (
                    <ProductItem
                      key={item._id || index}
                      index={index}
                      item={{
                        ...item,
                        author: {
                          name: artist.name,
                          slug: artist.slug,
                        },
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div data-id="cv">
              <h3 className="border-b mb-4 text-2xl pb-4 font-medium">
                Tiểu sử và CV
              </h3>
              {data?.map((item, index) => {
                return (
                  <div key={index}>
                    <h3 className="text-2xl mb-4 pb-2 border-b">{item.name}</h3>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: item.value }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ArtistPage;
