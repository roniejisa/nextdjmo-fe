import Image from "next/image";
import { forwardRef } from "react";

const ImageCustom = forwardRef(function ImageCustom({ ...props }, ref) {
  return (
    <Image
      ref={ref}
      {...props}
      onError={({ target }) => (target.src = "/next.svg")}
      alt={props.alt || ""}
    />
  );
});

export default ImageCustom;
