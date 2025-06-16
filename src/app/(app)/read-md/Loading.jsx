"use client";
const { useEffect, useState } = require("react");

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 0);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 animate-pulse"></div>

      {/* Floating orbs for extra effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-300/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-300/10 rounded-full blur-xl animate-float-slow"></div>
      </div>

      {/* Glassmorphism card */}
      <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
        {/* Shimmering border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

        <div className="relative flex flex-col items-center space-y-8">
          {/* Main loader */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-2 border-white/30 rounded-full animate-spin-slow"></div>

            {/* Inner spinning dots */}
            <div className="absolute inset-2 flex items-center justify-center">
              <div className="w-16 h-16 relative">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-white/70 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${
                        i * 90
                      }deg) translateY(-24px)`,
                      animation: `orbit 2s infinite linear ${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Center pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h2 className="text-2xl font-light text-white/90 mb-2">
              Đang tải{dots}
            </h2>
            <p className="text-white/60 text-sm">Vui lòng chờ trong giây lát</p>
          </div>

          {/* Progress indicator */}
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-24px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateY(-24px);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
