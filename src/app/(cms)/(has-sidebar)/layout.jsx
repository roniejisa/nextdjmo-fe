import Sidebar from "@/components/ui/admin/Sidebar";
import "@/app/system.scss";
import AllProvider from "@/context/cms/AllProvider";
import React from "react";
import { getProfile } from "./system/[module]/actions";
import SocketProvider from "@/context/SocketProvider";
const AdminLayout = async (data) => {
  const { params, children } = await data;
  const profile = await getProfile();
  const storeParams = await params;
  return (
    <SocketProvider>
      <AllProvider>
        <main className="grid lg:grid-cols-[280px_1fr] gap-4 lg:h-[100vh-16px*2] lg:p-4 h-screen p-0">
          <Sidebar storeParams={storeParams} profile={profile} />
          <div className="flex-1 shadow-lg  rounded-none lg:rounded-2xl bg-main overflow-auto h-screen lg:h-[calc(100vh-16px*2)]">
            {children}
          </div>
        </main>
      </AllProvider>
    </SocketProvider>
  );
};

export default AdminLayout;
