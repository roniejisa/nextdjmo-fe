import { httpClient } from "@/utils/http";
import Slide from "./Slide";

const getDataHome = async () => {
  const res = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "homepage"
  );
  return res;
};
const Home = async () => {
  const data = await getDataHome();
  const { slides } = data.data;
  return (
    <div>
      <Slide items={slides}/>
    </div>
  );
};

export default Home;
