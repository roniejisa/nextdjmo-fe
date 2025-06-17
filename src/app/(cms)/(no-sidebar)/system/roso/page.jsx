import Chat from "./Chat";
import History from "./History";
import Message from "./Message";
import { httpClient } from "@/utils/http";
import Header from "./Header";
import "./chat.css";
import RosoProvider from "@/context/cms/RosoProvider";
export const getModels = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-models",
    {}
  );
  return response;
};

export const generateMetadata = async () => {
  return {
    title: "ROSO AI",
  };
};

const ChatPage = async () => {
  const models = await getModels();
  return (
    <RosoProvider>
      <div className="grid grid-cols-8 min-h-screen">
        <History className="col-span-1 border-r p-4" />
        <div className="col-span-7 relative">
          <Header models={models?.data} />
          <Message />
          <Chat />
        </div>
      </div>
    </RosoProvider>
  );
};

export default ChatPage;
