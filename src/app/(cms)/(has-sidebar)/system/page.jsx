import { notFound } from "next/navigation";
import { getProfile } from "./[module]/actions";

import { getToken } from "@/utils/server/utils";
import { httpClient } from "@/utils/http";
import Client from "./Client";


const getProductHot = async () => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/products",
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return response.data;
};
const Dashboard = async () => {
  const profile = await getProfile();
  const hotProducts = await getProductHot();
  if (
    profile &&
    profile?.permissions &&
    profile?.permissions.filter((permission) => permission.includes(".read"))
      .length === 0
  )
    return notFound();
  return (
    <div className="p-4">
      <Client hotProducts={hotProducts} profile={profile} />
    </div>
  );
};

export default Dashboard;
