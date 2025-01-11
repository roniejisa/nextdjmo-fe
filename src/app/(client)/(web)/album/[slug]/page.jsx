import { httpClient } from "@/utils/http";
import AlbumClient from "./AlbumClient";
import PreviewProvider from "@/packages/previews/PreviewProvider";

const getAlbum = async (slug) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `album/${slug}`
  );
  return response.data;
};
const AlbumDetail = async ({ params }) => {
  const { slug } = await params;
  const data = await getAlbum(slug);
  let images = [];
  try {
    images = JSON.parse(data.images);
  } catch (e) {}
  return (
    <PreviewProvider data={images} type="follow">
      <AlbumClient images={images} />
    </PreviewProvider>
  );
};

export default AlbumDetail;
