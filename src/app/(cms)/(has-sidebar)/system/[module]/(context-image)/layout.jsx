import ImageProvider from "@/context/cms/ImageProvider";

const ImageContextLayout = ({ children }) => {
  return <ImageProvider>{children}</ImageProvider>;
};

export default ImageContextLayout;
