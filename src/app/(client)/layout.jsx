import ClientProvider from "@/context/client/ClientProvider";
import '@/app/client.scss'
const ClientPage = ({ children }) => {
  return <ClientProvider>{children}</ClientProvider>;
};

export default ClientPage;
