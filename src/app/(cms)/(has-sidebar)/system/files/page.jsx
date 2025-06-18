import MediaProvider from "@/app/media/MediaProvider";
import MediaMain from "@/app/media/MediaMain";

const FileManager = () => {
  return (
    <MediaProvider>
      <MediaMain />
    </MediaProvider>
  );
};

export default FileManager;
