import React from "react";
import LoaderIcon from "../assets/./sanima_loader.svg";
const Spinner = () => {
  return (
    <div className="text-center mt-5">
      <div>
        <img
          src={LoaderIcon}
          alt="loading"
          style={{
            position: "fixed",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            zIndex: 1060,
          }}
        />
      </div>
    </div>
  );
};

export default Spinner;
