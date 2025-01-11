import SectionHome from "@/components/ui/client/components/SectionHome";
import SlideComponent from "@/packages/slides/SlideComponent";
import { httpClient } from "@/utils/http";

export const getDataHome = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "homepage"
  );
  return response.data;
};
const Home = async () => {
  const { slides } = await getDataHome();
  return (
    <>
      <SlideComponent slides={slides} />
      <SectionHome />
    </>
  );
};

export default Home;
