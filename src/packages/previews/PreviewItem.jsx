const PreviewItem = ({ children, item, index, ...props }) => {
  return (
    <div
      rs-preview-show={"true"}
      {...props}
    >
      {children}
    </div>
  );
};

export default PreviewItem;
