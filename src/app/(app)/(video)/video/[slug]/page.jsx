import React from "react";
import VideoPlayer from "../VideoPlayer";
import { getSignedUrl } from "../action";

const page = async ({ params }) => {
  const { slug } = params;
  const { status, data: signed_url, message } = await getSignedUrl(slug);
  if (status == 404) {
    return <div>{message}</div>;
  }
  return (
    <div className="min-h-screen max-h-screen">
      <VideoPlayer
        status={status}
        message={message}
        m3u8Url={
          process.env.NEXT_PUBLIC_URL + `api/hash?signedUrl=${signed_url}`
        }
      />
    </div>
  );
};

export default page;
