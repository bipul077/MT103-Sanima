import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import MTContext from "../../context/MTContext";
import ReactToPrint from "react-to-print";

const ViewerMt = ({ showModal, handleCloseModal, contents }) => {
  const context = useContext(MTContext);
  const { MtLogs } = context;
  const ref = React.createRef();

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-lg"
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <div className="ml-auto">
            <strong>TT application</strong>
            <a target="_blank" rel="noreferrer" href={`${contents.TT_app_url}`}>
              <i className="bi bi-file-earmark-pdf-fill fs-3"></i>
            </a>
            <strong className="ml-3">Performa/Commercial Invoice</strong>
            <a
              target="blank"
              rel="noreferrer"
              href={`${contents.Performa_url}`}
            >
              <i className="bi bi-file-earmark-pdf-fill fs-3"></i>
            </a>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div ref={ref}>
              {[1, 2, 5].includes(contents.status) && (
                <div
                  id="swiftcontent"
                  dangerouslySetInnerHTML={{
                    __html: contents.swift,
                  }}
                />
              )}
              {[3, 4, 6].includes(contents.status) && (
                <div
                  id="swiftcontent"
                  // ref={swiftContentRefapprove}
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
                      <i className="bi bi-three-dots-vertical"></i>{" "}
                      {log.Request_By} has commented following to{" "}
                      {log.Assigned_to}.
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => {
              const contentToPrint = ref.current.cloneNode(true);
              // Remove the undesired div with the ID "SwiftHtml"
              const swiftHtmlDiv = contentToPrint.querySelector('#SwiftHtml');
              if (swiftHtmlDiv) {
                swiftHtmlDiv.parentNode.removeChild(swiftHtmlDiv);
              }
              return contentToPrint;
            }}
            // content={() => ref.current}
            pageStyle={`.print-agreement { margin: 5px; }`}
            trigger={() => (
              <Button type="primary">
                Print
              </Button>
            )}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewerMt;
