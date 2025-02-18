import MediaProvider from "@/app/media/MediaProvider";
import MediaComponent from "@/components/Media/MediaComponent";
import ImageProvider from "@/context/cms/ImageProvider";

const FileManager = () => {
  return (
    <ImageProvider>
      <MediaProvider>
        <MediaComponent />
      </MediaProvider>
    </ImageProvider>
  );
};

export default FileManager;
