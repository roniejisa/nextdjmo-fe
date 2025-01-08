import ConfigurationComponent from "./Configuration";

export async function generateMetadata() {
  return {
    title: "Cấu hình chung",
  };
}

const Configuration = async () => {
  return (
    <div className="px-4">
      <div className="flex py-4 sticky top-0 z-10 bg-white">
        <h1 className="text-3xl font-bold">Cấu hình chung</h1>
        <div className="ml-auto"></div>
      </div>
      <div>
        <ConfigurationComponent />
      </div>
    </div>
  );
};

export default Configuration;
