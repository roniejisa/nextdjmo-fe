import { getNews } from "./action";
import NewsClient from "./News";
const News = async () => {
  const {data} = await getNews()
  return (
    <div className="">
        <NewsClient items={data}/>
    </div>
  );
};

export default News;
