import { useContext } from "react";
import { LoadingContext } from "../LoadingProvider";

const SpinnerTransition = ({
  width = "32px",
  height = "32px",
  color = "red",
  ms = "1s",
  bottom = "16px",
  right = "16px",
  zIndex = "10",
}) => {
  const { transition } = useContext(LoadingContext);
  return (
    <>
      <style>
        {`
          .animate-spin {
              animation: spin ${ms} linear infinite;
          }

          @keyframes spin {
              to {
                  transform: rotate(360deg);
              }
          }
        `}
      </style>
      {transition && (
        <div className="fixed" style={{ bottom, right, zIndex }}>
          <div
            className="block rounded-full border-2 border-b-transparent animate-spin"
            style={{
              width,
              height,
              borderColor: color,
              borderBottomColor: "transparent",
            }}
          ></div>
        </div>
      )}
    </>
  );
};

export default SpinnerTransition;
