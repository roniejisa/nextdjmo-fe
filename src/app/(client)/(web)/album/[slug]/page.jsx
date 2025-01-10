import { httpClient } from "@/utils/http";
import AlbumClient from "./AlbumClient";

const getAlbum = async (slug) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `album/${slug}`
  );
  return response.data;
};
const AlbumDetail = async ({ params }) => {
  const { slug } = await params;
  const data = await getAlbum(slug);
  return <AlbumClient data={data} type="follow" />;
};

export default AlbumDetail;