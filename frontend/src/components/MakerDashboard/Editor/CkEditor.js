import React, { useContext, useEffect, useState, useRef } from "react";
import MTContext from "../../../context/MTContext";
import JoditEditor from "jodit-react";
import ForwardModal from "./ForwardModal";
import { useLocation } from "react-router-dom";
import SideNav from "../../SideNav";

const CkEditor = () => {
  const { state } = useLocation();
  const swift = state ? state.text : "";
  const context = useContext(MTContext);
  const [showModal, setShowModal] = useState(false);
  const {
    //verifyToken,
    getChecker,
    addeditor,
    setAddeditor,
    verifyrole,
    MtLogs,
    SwiftLogs,
  } = context;
  const editor = useRef(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    verifyrole("verifymaker");
    getChecker();
  }, []);

  const contextchanged = (event) => {
    // console.log(event)
    setAddeditor({ ...addeditor, contest: event });
  };

  return (
    <>
      <ForwardModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
      <div className="container-fluid min-vh-100">
        <div className="row">
          <div className="col-4 col-md-2"></div>
          <div className="col">
            <SideNav role="Maker" />
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <JoditEditor
                        ref={editor}
                        value={swift}
                        // value="asdfasdf"
                        tabIndex={1} // tabIndex of textarea
                        onChange={contextchanged} // preferred to use only this option to update the content for performance reasons
                      />
                      {/* {JSON.stringify(addeditor.contest)} */}
                      {/* {addeditor.contest.length} */}
                      <div className="card mt-3">
                        <div className="card-body">
                          <div className="comments">
                            <h5>
                              <i>Comments</i>
                            </h5>
                            <hr />
                            {MtLogs.map(
                              (log, index) =>
                                log.Status === 2 && (
                                  <div key={index} className="mb-2">
                                    <p>
                                      <i className="bi bi-three-dots-vertical"></i>{" "}
                                      {log.Request_By} has commented following
                                      to {log.Assigned_to}.
                                    </p>
                                    <textarea
                                      type="text"
                                      className="form-control"
                                      id="comment"
                                      name="comment"
                                      value={log.Message}
                                    />
                                  </div>
                                )
                            )}
                            <hr />
                            {SwiftLogs.map(
                              (log, index) =>
                                log.Message === "5" && (
                                  <div key={index} className="mb-2">
                                    <p>
                                      <i className="bi bi-three-dots-vertical"></i>{" "}
                                      {log.username} has commented following to
                                      Trade.
                                    </p>
                                    <textarea
                                      type="text"
                                      className="form-control"
                                      id="comment"
                                      name="comment"
                                      value={log.Comment}
                                    />
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="float-end">
                        <button
                          className="btn btn-primary ms-2"
                          onClick={handleOpenModal}
                          disabled={addeditor.contest.length < 12}
                        >
                          Forward
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CkEditor;
