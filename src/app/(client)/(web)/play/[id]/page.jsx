import React from "react";
import PockerTable from "../../../components/PockerTable";

const Play = ({ params }) => {
  const { id } = params;
  
  return (
    <div>
      <PockerTable id={id} />
    </div>
  );
};

export default Play;
