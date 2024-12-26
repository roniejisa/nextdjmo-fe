import Sidebar from "@/components/ui/admin/Sidebar";
import "@/app/system.scss";
import AllProvider from "@/context/AllProvider";
import { getProfile } from "./system/settings/actions";
import React from "react";
const AdminLayout = async (data) => {
  const { params, children } = await data;
  const profile = await getProfile();
  const storeParams = await params;
  return (
    <AllProvider>
      <main className="grid md:grid-cols-[280px_1fr] gap-4 md:h-[100vh-16px*2] md:p-4 h-screen p-0">
        <Sidebar storeParams={storeParams} profile={profile} />
        <div className="flex-1 shadow-lg  rounded-none md:rounded-2xl bg-main overflow-auto h-screen md:h-[calc(100vh-16px*2)]">
          {children}
        </div>
      </main>
    </AllProvider>
  );
};

export default AdminLayout;
