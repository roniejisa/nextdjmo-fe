import CallbackOAuth from "./CallbackOAuth";
const CallbackPage = async ({ params }) => {
  const storeParams = await params;
  return <CallbackOAuth params={storeParams} />;
};

export default CallbackPage;
