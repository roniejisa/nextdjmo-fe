import Sidebar from "@/components/ui/admin/Sidebar";
import "@/app/system.scss";
import CMSProvider from "@/context/cms/CMSProvider";
import React from "react";
import SocketProvider from "@/context/SocketProvider";
import PreviewProvider from "@/packages/previews/PreviewProvider";
import { getMenu } from "@/components/ui/admin/action";
import { clearTokensAndRedirect } from "@/utils/action";
import { getProfile } from "@/utils/server/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Utility function để kiểm tra permission
const checkPermission = (pathname, permissions) => {
  const segments = pathname.split("/").filter(Boolean);

  // TH1: Vào /system bắt buộc phải có ít nhất 1 cái [segment1].read
  if (segments.length === 1 && segments[0] === "system") {
    const hasReadPermission = permissions.some((permission) =>
      permission.endsWith(".read")
    );
    return hasReadPermission;
  }

  // TH2 & TH3: segment 1 là system và có segment 2 (module)
  if (segments.length >= 2 && segments[0] === "system") {
    const moduleName = segments[1];

    // TH2: segment 3 là 'create'
    if (segments.length === 3 && segments[2] === "create") {
      return (
        permissions.includes(`${moduleName}.create`) ||
        permissions.includes(`${moduleName}.add`)
      );
    }

    // TH3: segment 3 là ID (không phải 'create' và có length >= 3)
    if (segments.length >= 3 && segments[2] !== "create") {
      // Kiểm tra xem segment[2] có phải là ID không (có thể là số hoặc string dài)
      const isId =
        segments[2] &&
        segments[2] !== "create" &&
        segments[2] !== "list" &&
        segments[2] !== "edit";
      if (isId) {
        return (
          permissions.includes(`${moduleName}.edit`) ||
          permissions.includes(`${moduleName}.update`)
        );
      }
    }

    // Trường hợp khác: chỉ có segment 1 và 2 (/system/posts)
    if (segments.length === 2) {
      return permissions.includes(`${moduleName}.read`);
    }
  }

  // Mặc định cho phép truy cập nếu không match case nào ở trên
  return true;
};

const AdminLayout = async ({ children, params }) => {
  let { status, data: profile, message } = await getProfile();
  if ((status !== 200 || !profile) && !profile?.user && !profile?.permissions) {
    await clearTokensAndRedirect();
    return null;
  }

  const { permissions } = profile;

  // Lấy pathname từ headers
  const headersList = headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  console.log(pathname)
  // Kiểm tra permission
  const hasPermission = checkPermission(pathname, permissions);

  if (!hasPermission) {
    redirect("/403"); // Chuyển hướng đến trang 403
  }

  const response = await getMenu();

  return (
    <SocketProvider>
      <CMSProvider profile={profile}>
        <main className="grid lg:grid-cols-[auto_1fr] gap-4 lg:h-[calc(100vh-16px*2)] lg:p-4 h-screen p-0">
          <Sidebar storeParams={params} menus={response.data} />
          <div className="flex-1 shadow-lg rounded-none lg:rounded-2xl bg-main overflow-auto h-screen lg:h-[calc(100vh-16px*2)]">
            {children}
          </div>
        </main>
        <PreviewProvider />
      </CMSProvider>
    </SocketProvider>
  );
};

export default AdminLayout;
