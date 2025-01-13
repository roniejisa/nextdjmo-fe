import React from "react";
import VideoPlayer from "./VideoPlayer";
import { getSignedUrl } from "./action";

const page = async () => {
  const signed_url = await getSignedUrl('data');
  return (
    <div>
      <VideoPlayer
        m3u8Url={
          process.env.NEXT_PUBLIC_URL + `api/hash?signedUrl=${signed_url}`
        }
      />
    </div>
  );
};

export default page;
