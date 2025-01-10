import { useContext } from "react";
import { PreviewContext } from "./PreviewProvider";

const PreviewItem = ({ children, item, index, ...props }) => {
  const { setPreviewIndex } = useContext(PreviewContext);

  return (
    <div
      onClick={() => {
        setPreviewIndex(index);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PreviewItem;
