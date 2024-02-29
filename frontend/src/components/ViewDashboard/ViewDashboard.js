import React, { useContext, useEffect } from "react";
import MTContext from "../../context/MTContext";
import SideNav from "../SideNav";
import ViewTable from "./ViewTable";

const ViewDashboard = () => {
  const context = useContext(MTContext);
  const { open,verifyrole } = context;

  useEffect(() => {
    verifyrole("verifyviewer");
  }, []);

  return (
    <>
     <div className="container-fluid min-vh-100">
        <div className="row">
          {open && <div className="col-4 col-md-2"></div>}
          <div className="col-4 col-md">
            <SideNav role="View" />
            <div className="container">
                <div className="col-sm-12">
                    <ViewTable/> 
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDashboard;
