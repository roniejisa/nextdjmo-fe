import NewsClient from "./NewsClient";

const News = async ({ params }) => {
  const { slug } = await params;
  console.log(slug)
  return (
    <div className="px-10">
      <div>
        <NewsClient />
      </div>
    </div>
  );
};

export default News;
