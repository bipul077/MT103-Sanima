import React, { useContext, useEffect } from "react";
import MTContext from "../../context/MTContext";

const HeadLogs = () => {
  const context = useContext(MTContext);
  const { getHeadLogs, Headlogs } = context;

  useEffect(() => {
    getHeadLogs();
  }, []);

  return (
    <div>
      <div className="card">
        <div className="card-header text-center">
          <strong>Logs Activities</strong>
        </div>
        <div className="card-body">
          <div style={{ height: "600px", overflowY: "scroll" }}>
            {Headlogs.map((all, index) => (
              <React.Fragment key={index}>
                <div className="d-flex">
                  <p className="mr-2">{index + 1}. </p>
                  <p>
                    {all.Name}({all.StaffId}) was {all.Action} to role {all.Role}. (
                    {new Date(all.updatedAt).toLocaleString()})
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadLogs;
