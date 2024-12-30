import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

const getReturnData = async (data) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `payment-return-result`,
    {
      Authorization: `Bearer ${token}`,
    },
    data,
    "POST"
  );
  return response;
};
const PaymentResultPage = async ({ searchParams }) => {
  const storeSearchParams = await searchParams;
  const response = await getReturnData(storeSearchParams);
  return <div>page</div>;
};

export default PaymentResultPage;
