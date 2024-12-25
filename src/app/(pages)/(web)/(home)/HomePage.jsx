import ArtistItem from "@/components/ui/client/items/ArtistItem";
import ProductItem from "@/components/ui/client/items/ProductItem";
import { redirect } from "next/dist/server/api-utils";

const getHomePages = async () => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT_URL + "homepage");
    const data = await response.json();
    return data.data;
  } catch (e) {
    return {
      products: [],
      artists: [],
    };
  }
};

export const metadata = {
  title: "Trang chủ",
};

const HomePage = async ({}) => {
  const data = await getHomePages();
  if(!data){
    return redirect("/404")
  }
  const { products, artists } = data;

  return (
    <>
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
          <div className="flex flex-col gap-8">
            {artists.map(
              (
                {
                  _id,
                  name: artistName,
                  slug: artistSlug,
                  products,
                  image,
                  short_description,
                },
                index
              ) => (
                <>
                  <div
                    className="flex flex-wrap -mx-4 -my-4 pb-2"
                    key={ _id}
                  >
                    <ArtistItem
                      index={index}
                      item={{
                        _id,
                        name: artistName,
                        slug: artistSlug,
                        image,
                        short_description,
                      }}
                    />
                    {products.map(({ name, slug, price, image }, index) => {
                      return (
                        <ProductItem
                          key={slug}
                          index={index}
                          item={{
                            name,
                            price,
                            author: { slug: artistSlug, name: artistName },
                            slug,
                            image,
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              )
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default HomePage;