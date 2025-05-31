"use client";

import { uploadFileResumable } from "@/utils/client";

const page = () => {
  const handleUploadFile = async (e) => {
    e.preventDefault();
    // if (fileListRef.current.files.length > 0) {
    //   setUploading(true);
    // } else {
    //   notify.changeNotify("error", "Vui lòng chọn file");
    //   return;
    // }

    for await (const file of e.target.files.files) {
      // random media_id str and text 10 ký tự
      const file_id = Math.random().toString(36).slice(-10);
      await uploadFileResumable(
        file,
        file_id,
        // (percent) => setProgress(percent), // Cập nhật tiến độ upload
        // (media) => {
        //   if (media && media.message && typeof media.message == "string")
        //     return;
        //   setMedias((medias) => [media, ...medias]);
        // },
        // token
      );
    }
  };
  return (
    <form onSubmit={handleUploadFile}>
      <input type="file" name="files" />
      <button>upload</button>
    </form>
  );
};

export default page;
