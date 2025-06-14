import GrapesBuilder from "../../main/GrapesBuilder";

export const generateMetadata = async () => {
  return {
    title: "PAGE BUILDER",
  };
};

const UpdatePage = async ({ params }) => {
  const { id } = await params;
  return <GrapesBuilder id={id} />;
};

export default UpdatePage;