import { httpClient } from "@/utils/http";
import { redirect } from "next/navigation";
import PageClient from "./PageClient";
import Header from "@/components/ui/client/Header";
import Footer from "@/components/ui/client/Footer";
import GoogleSignIn from "@/components/Google/GoogleSignIn";

const getPageData = async (slug) => {
  try {
    const response = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + `page/${slug}`
    );
    return response.data;
  } catch (e) {
    return false;
  }
};
const Page = async ({ params }) => {
  const { slug } = await params;
  const page = await getPageData(slug);
  if (!page) return redirect("/404");

  let dataContent;
  try {
    dataContent = JSON.parse(page.content);
  } catch (e) {}

  return (
    <>
      {page.header === "active" && (
        <>
          <Header />
          <GoogleSignIn />
        </>
      )}
      <PageClient dataContent={dataContent} />
      {page.footer === "active" && <Footer />}
    </>
  );
};

export default Page;
