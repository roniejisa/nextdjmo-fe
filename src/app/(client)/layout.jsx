import ClientProvider from "@/context/ClientProvider";
import '@/app/client.scss'
const ClientPage = ({ children }) => {
  return <ClientProvider>{children}</ClientProvider>;
};

export default ClientPage;
