import ImageProvider from "@/context/ImageProvider";
import MediaProvider from "./MediaProvider";

const layout = ({ children }) => {
  return (
    <ImageProvider>
      <MediaProvider>{children}</MediaProvider>
    </ImageProvider>
  );
};

export default layout;
