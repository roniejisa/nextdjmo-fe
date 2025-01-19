const Skeleton = ({ variant, width = "100%", height = "100%", style = {} }) => {
  return (
    <div
      style={{
        width: `calc(${width})`,
        height: `calc(${height})`,
        minHeight: "32px",
        borderRadius: variant == "circle" ? "100%" : "4px",
        background:
          "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s cubic-bezier(.4,0,.6,1) infinite",
        ...style,
      }}
    ></div>
  );
};

export default Skeleton;
