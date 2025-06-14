import ClientProvider from "@/context/client/ClientProvider";
import "@/app/client.scss";
import { getProfile } from "@/utils/server/utils";
import { getssId } from "@/components/ui/client/action";
const ClientPage = async ({ children }) => {
  const profile = await getProfile();
  const ssId = await getssId();
  return (
    <ClientProvider profile={profile} ssId={ssId}>
      {children}
    </ClientProvider>
  );
};

export default ClientPage;
