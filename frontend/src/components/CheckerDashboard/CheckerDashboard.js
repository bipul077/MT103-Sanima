import React, { useContext, useEffect } from "react";
import MTContext from "../../context/MTContext";
import CheckerTable from "./CheckerTable";
import SideNav from "../SideNav";

const CheckerDashboard = () => {
  const context = useContext(MTContext);
  const { open,verifyrole } = context;

  useEffect(() => {
    verifyrole("verifychecker");
  }, []);

  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="row">
          {open && <div className="col-4 col-md-2"></div>}
          <div className="col-4 col-md">
            <SideNav role="Checker" />
            <div className="container">
                <div className="col-sm-12">
                  <div className="card w-100 mb-3">             
                      <CheckerTable/>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckerDashboard;
