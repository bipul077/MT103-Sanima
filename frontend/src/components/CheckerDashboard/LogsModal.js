import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import MTContext from "../../context/MTContext";

const LogsModal = ({ showModal, handleCloseModal }) => {
  const context = useContext(MTContext);
  const { MtLogs, SwiftLogs } = context;
  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ zIndex: 10000 }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="ml-auto">Logs Activities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="card col-sm-6">
              <div className="">
                <div className="card-header text-center">
                  <strong>MT Logs</strong>
                </div>
                <div className="card-body p-2">
                  <div style={{ height: "400px", overflowY: "scroll" }}>
                    {MtLogs.map((log, index) => (
                      <div className="d-flex" key={index}>
                        <p className="mr-2">{index + 1}.</p>
                        {log.Status === 3 ? (
                          <p>
                            MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was{" "}
                            <b>Approved by</b> {log.Request_By} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        ) : (
                          <p>
                            MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was
                            <b>{log.Status === 1 && " Forwarded to"}</b>
                            <b>{log.Status === 2 && " Reverted to"}</b>{" "}
                            <b>{log.Assigned_to}</b> with message <span className="text-danger">{log.Message}</span> by {log.Request_By} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card col-sm-6">
              <div className="">
                <div className="card-header text-center">
                  <strong>Swift Logs</strong>
                </div>
                <div className="card-body p-2">
                  <div style={{ height: "400px", overflowY: "scroll" }}>
                    {SwiftLogs.map((log, index) => (
                      <div className="d-flex" key={index}>
                        <p className="mr-2">{index + 1}.</p>

                        {log.Message === "4" && (
                          <p>
                            MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was
                            <b> Forwarded To Swift</b> with Comment <span className="text-danger">"{log.Comment}"</span> by{" "}
                            {log.username} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        )}
                          {log.Message === "5" && (
                          <p>
                            MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was
                            <b> Reverted By Swift</b> with Comment <span className="text-danger">"{log.Comment}"</span> by{" "}
                            {log.username} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        )}
                          {log.Message === "6" && (
                          <p>
                            MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was
                            <b> Accepted By Swift</b> by{" "}
                            {log.username} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        )}
                          {log.Message === "7" && (
                          <p>
                            Approved File of MTSwift(103) of TT number '{log.SwiftMsg.Ttref}' was
                            <b> Uploaded</b> by{" "}
                            {log.username} at (
                            {new Date(log.updatedAt).toLocaleString()}).
                          </p>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LogsModal;
