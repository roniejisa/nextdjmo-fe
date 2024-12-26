import ImageProvider from "@/context/ImageProvider";

const ImageContextLayout = ({ children }) => {
  return <ImageProvider>{children}</ImageProvider>;
};

export default ImageContextLayout;