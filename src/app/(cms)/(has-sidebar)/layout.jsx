import Sidebar from "@/components/ui/admin/Sidebar";
import "@/app/system.scss";
import AllProvider from "@/context/cms/AllProvider";
import React from "react";
import { getProfile } from "./system/[module]/actions";
import SocketProvider from "@/context/SocketProvider";
import PreviewProvider from "@/packages/previews/PreviewProvider";
import { getMenu } from "@/components/ui/admin/action";
const AdminLayout = async (data) => {
  const { params, children } = await data;
  const profile = await getProfile();
  const menus = await getMenu()
  const storeParams = await params;
  return (
    <SocketProvider>
      <AllProvider profile={profile}>
        <main className="grid lg:grid-cols-[auto_1fr] gap-4 lg:h-[calc(100vh-16px*2)] lg:p-4 h-screen p-0">
          <Sidebar storeParams={storeParams} profile={profile} menus={menus}/>
          <div className="flex-1 shadow-lg  rounded-none lg:rounded-2xl bg-main overflow-auto h-screen lg:h-[calc(100vh-16px*2)]">
            {children}
          </div>
        </main>
        <PreviewProvider />
      </AllProvider>
    </SocketProvider>
  );
};

export default AdminLayout;
