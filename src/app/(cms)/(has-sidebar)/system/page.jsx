import { notFound } from "next/navigation";
import { httpClient } from "@/utils/http";
import Client from "./(dashboard)/Client";

const getProductHot = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/products",
    {}
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
