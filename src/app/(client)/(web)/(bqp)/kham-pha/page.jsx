import ExplodeClient from "./ExplodeClient";

const Explode = () => {
  return (
    <div className="lg:px-10">
      <h1 className="text-center text-4xl mb-10 relative before:h-[2px] before:absolute before:w-2/3 before:bg-white before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:translate-y-1/2">
        <span className="relative z-10 bg-[#221f20] px-4">Khám phá</span>
      </h1>
      <ExplodeClient />
    </div>
  );
};

export default Explode;
