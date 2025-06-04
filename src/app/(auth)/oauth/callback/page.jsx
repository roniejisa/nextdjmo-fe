import CallbackOAuth from "./CallbackOAuth";
const CallbackPage = async ({ searchParams }) => {
  return <CallbackOAuth searchParams={searchParams} />;
};

export default CallbackPage;
