import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MTContext from "../../context/MTContext";
import ViewTicket from "./ViewTicket";
import ReactToPrint from "react-to-print";

const ViewModal = ({ showModal, handleCloseModal, contents }) => {
  const ref = React.createRef();
  const navigate = useNavigate();
  const context = useContext(MTContext);
  const { setAddeditor, MtLogs, SwiftLogs,addMtswift } = context;
  const [showTicketModal, setShowTicketModal] = useState(false);
  const handleCloseTicketModal = () => setShowTicketModal(false);
  const handleCopy = (containerId) => {
    setAddeditor({
      id: contents.id,
      status: contents.status,
      remark: contents.remark,
      // assignedto: contents.assignedto,
      contest: contents.contest,
    });
    const container = document.getElementById(containerId);
    // console.log(container)
    const html = container.innerHTML;
    const text = html.replace(/<p.*?>/gi, "").replace(/<\/p>/gi, "\n");
    navigate("/ckeditor", { state: { text } });
  };

  const handleForward = ()=>{
    addMtswift({Status:1,id:contents.id,Assigned_to:"Maker",Remarks:contents.remark});
    handleCloseModal();
  }

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-lg"
        style={{ zIndex: 10000 }}
      >
        <ViewTicket
          showModal={showTicketModal}
          handleCloseModal={handleCloseTicketModal}
          contents={contents}
          handleCloseViewModal={handleCloseModal}
        />
        <Modal.Header closeButton>
          <Modal.Title className="ml-auto">MT103 SWIFT MESSAGE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
          <div ref={ref} className="p-2">
            {[1,2,5].includes(contents.status) && (
              <div
                id="MTSwift"
                dangerouslySetInnerHTML={{ __html: contents.contest }}
              />
            )}
            {/* {[2,5].includes(contents.status) && (
              <div
                id="MTSwift"
                dangerouslySetInnerHTML={{ __html: contents.revcontest }}
              />
            )} */}
            {[3,4,6].includes(contents.status) && (
              <div
                id="MTSwift"
                dangerouslySetInnerHTML={{
                  __html: contents.Approved_Swift_Msg,
                }}
              />
            )}
            </div>
          </form>
          <div
            className={`comments ${
              [3, 6].includes(contents.status) && "d-none"
            }`}
          >
            <hr />
            <h5>
              <i>Comments</i>
            </h5>
            {MtLogs.map(
              (log, index) =>
                log.Status === 2 && (
                  <div key={index} className="mb-2">
                    <p>
                      <i className="bi bi-three-dots-vertical"></i> {log.Request_By}{" "}
                      has commented following to {log.Assigned_to}.
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
                      <i className="bi bi-three-dots-vertical"></i> {log.username}{" "}
                      has commented following to Trade.
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
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex align-items-center mr-5">
            <strong>TT application</strong>
            <a target="_blank" href={`${contents.TT_app}`}>
              <i className="bi bi-file-earmark-pdf-fill fs-2"></i>
            </a>
            <strong className="ml-3">Performa/Commercial Invoice</strong>
            <a target="blank" href={`${contents.Performa}`}>
              <i className="bi bi-file-earmark-pdf-fill fs-2"></i>
            </a>
          </div>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => ref.current}
            pageStyle={`.print-agreement { margin: 5px; }`}
            trigger={() => (
              <Button type="primary">
                Print
              </Button>
            )}
          />
          <Button
            variant="primary"
            disabled={[1, 3, 4, 6].includes(contents.status)}
            onClick={() => handleCopy("MTSwift")}
          >
            Review & Forward
          </Button>
          <Button
            variant="primary"
            disabled={[1, 3, 4, 6].includes(contents.status)}
            onClick={() => setShowTicketModal(true)}
          >
            Re-Generate Ticket Number
          </Button>
          <Button variant="primary" disabled={[1, 3, 4, 6].includes(contents.status)} onClick={()=>handleForward()}>Forward To Checker</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewModal;
