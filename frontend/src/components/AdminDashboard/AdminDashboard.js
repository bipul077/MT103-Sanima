import React, { useContext, useEffect } from "react";
import MTContext from "../../context/MTContext";
import Tradestaff from "./Tradestaff";
import Assignroles from "./Assignroles";
import HeadLogs from "./HeadLogs";
import SideNav from "../SideNav";

const AdminDashboard = () => {
  const context = useContext(MTContext);
  const { open,verifyrole } = context;
 

  useEffect(() => {
    verifyrole("verifyadmin");
  }, []);


  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="row">
          {open && <div className="col-4 col-md-2"></div>}
          <div className="col">
            <SideNav role="Head" />
            <div className="container">
              <div className="row">
                <div className="col-sm-8">
                  <Assignroles />
                  <Tradestaff />
                </div>
                <div className="col-sm-4">
                  <HeadLogs />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
