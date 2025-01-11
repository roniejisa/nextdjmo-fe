import SectionHome from "@/components/ui/client/components/SectionHome";
import SlideComponent from "@/packages/slides/SlideComponent";
import SlideProvider from "@/packages/slides/SlideProvider";
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
      <SlideProvider
        slides={slides}
        component={SlideComponent}
        autoPlay={true}
        ms={300}
        styleDotActive="bg-foreground border border-foreground"
        styleDotNotActive="bg-transparent border border-foreground"
      />
      <SectionHome />
    </>
  );
};

export default Home;
