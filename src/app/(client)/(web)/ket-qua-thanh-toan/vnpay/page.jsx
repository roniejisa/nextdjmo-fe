import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const getReturnData = async (data) => {
  if (!Object.keys(data).length) return;
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      message: "Vui lòng đăng nhập",
    };
  }
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `payment-return-result`,
    {
      Authorization: `Bearer ${token}`,
    },
    data,
    "POST",
    true,
    true
  );
  return response;
};
const PaymentResultPage = async ({ searchParams }) => {
  const storeSearchParams = await searchParams;
  const response = await getReturnData(storeSearchParams);
  return <div>page</div>;
};

export default PaymentResultPage;
