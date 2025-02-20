import ExplodeClient from "./ExplodeClient";

const Explode = () => {
  return (
    <div>
      <div className="lg:px-10 relative h-[200px] bg-[#181617] mb-10">
        <h1 className="text-center text-4xl absolute top-1/2 -translate-y-1/2">
          <span className="relative z-10 px-4 text-active">Khám phá</span>
        </h1>
      </div>
      <div className="lg:px-10">
        <ExplodeClient />
      </div>
    </div>
  );
};

export default Explode;
