import { httpClient } from "@/utils/http";
import NewsClient from "./News";

export const getNews = async (page = 1, limit = 10) => {
  const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + `news?page=${page}&limit=${limit}`)
  return response
}
const News = async () => {
  const {data} = await getNews()
  return (
    <div className="">
        <NewsClient items={data}/>
    </div>
  );
};

export default News;
