import LinkCustom from "@/packages/translation/Link";

const ErrorPage = ({ href = "/", number = 4 }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Background 403 with Door */}
        <div className="relative">
          {/* Large 403 Text */}
          <div className="text-[200px] lg:text-[300px] font-bold text-[#f4edf5] leading-none tracking-wider text-center">
            4
            <span className="relative inline-block">
              {/* Door in the zero */}
              <span className="relative z-10">0</span>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-20 bg-white rounded-t-full border-2 border-purple-200">
                {/* Door handle */}
                <div className="absolute right-2 top-1/2 w-2 h-2 rounded-full bg-purple-200"></div>
              </div>
            </span>
            {number}
          </div>

          {/* Decorative Elements */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-6 border-2 border-[#f2f1f3] z-20"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                transform: `rotate(${Math.random() * 45}deg)`,
              }}
            />
          ))}
          <div className="absolute bottom-0 -translate-y-2/3 w-full h-[50px] border-t-2 border-[#f3f0f7] bg-white z-10"></div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-4 -mt-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#693e93]">
            You&apos;re not permitted to see this.
          </h1>
          <p className="text-[#693e93] text-lg">
            The page you&apos;re trying to access has restricted access.
          </p>
          <p className="text-[#693e93] text-lg">
            If you feel this is a mistake, contact your admin.
          </p>
        </div>
      </div>
      <div className="text-center mt-10">
        <LinkCustom
          href={href}
          className="bg-[#693e93]  rounded-md text-lg text-white px-20 py-2"
        >
          Back to Home
        </LinkCustom>
      </div>
    </div>
  );
};

export default ErrorPage;
