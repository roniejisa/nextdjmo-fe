import { notFound } from "next/navigation";
import { getProfile } from "./[module]/actions";

const Dashboard = async () => {
  const profile = await getProfile();

  if (
    profile &&
    profile?.permissions &&
    profile?.permissions.filter((permission) => permission.includes(".read"))
      .length === 0
  )
    return notFound();
  return <div>Thôn tin cơ bản</div>;
};

export default Dashboard;
