import SocketProvider from "@/context/SocketProvider";
import MediaProvider from "./MediaProvider";
import CMSProvider from "@/context/cms/CMSProvider";
import '../system.scss'
const layout = ({ children }) => {
  return (
    <SocketProvider>
      <CMSProvider>
        <MediaProvider>{children}</MediaProvider>
      </CMSProvider>
    </SocketProvider>
  );
};

export default layout;