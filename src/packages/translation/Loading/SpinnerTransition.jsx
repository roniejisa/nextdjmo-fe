import { useContext } from "react";
import { LoadingContext } from "../LoadingProvider";

const SpinnerTransition = ({
  width = "32px",
  height = "32px",
  color = "#ef4444", // red-500
  ms = "1s",
  bottom = "16px",
  right = "16px",
  zIndex = "9999",
  type = "spinner", // spinner | dots | pulse
}) => {
  const { transition } = useContext(LoadingContext);

  const getSpinnerStyle = () => {
    switch (type) {
      case "dots":
        return {
          display: "flex",
          gap: "4px",
          alignItems: "center",
        };
      case "pulse":
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      default:
        return {};
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case "dots":
        return (
          <div style={getSpinnerStyle()}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-bounce"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: color,
                  borderRadius: "50%",
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        );
      
      case "pulse":
        return (
          <div
            className="animate-pulse"
            style={{
              width,
              height,
              backgroundColor: color,
              borderRadius: "50%",
              opacity: 0.6,
            }}
          />
        );
      
      default:
        return (
          <div
            className="animate-spin"
            style={{
              width,
              height,
              border: "2px solid transparent",
              borderTop: `2px solid ${color}`,
              borderRight: `2px solid ${color}`,
              borderRadius: "50%",
            }}
          />
        );
    }
  };

  if (!transition) return null;

  return (
    <>
      <style>
        {`
          .animate-spin {
            animation: spin ${ms} linear infinite;
          }

          .animate-bounce {
            animation: bounce 1s ease-in-out infinite;
          }

          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: none;
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }

          @keyframes pulse {
            50% {
              opacity: .5;
            }
          }

          .loading-backdrop {
            backdrop-filter: blur(1px);
            background: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
      
      <div
        className="fixed loading-backdrop"
        style={{
          bottom,
          right,
          zIndex,
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {renderSpinner()}
      </div>
    </>
  );
};

export default SpinnerTransition;