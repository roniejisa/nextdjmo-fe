import { notFound, } from "next/navigation";
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
  return response;
};

const Dashboard = async () => {
  const { status, data, message } = await getProductHot();
  if (status !== 200) {
    return notFound();
  }

  return (
    <div className="p-4">
      <Client hotProducts={data} />
    </div>
  );
};

export default Dashboard;
