import React, { useState, useContext, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import RevertBack from "./RevertBack";
import MTContext from "../../context/MTContext";
import ViewRemark from "./ViewRemark";
import { decodeToken } from "react-jwt";
import { sanitize } from "isomorphic-dompurify";
import ReactToPrint from "react-to-print";

const ViewMt = ({ showModal, handleCloseModal, contents }) => {
  const ref = React.createRef();
  const swiftContentRef = useRef(null);
  const addContentRef = useRef(null);
  const approvedContentRef = useRef(null);

  let token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [Preview, setPreview] = useState(false);
  const context = useContext(MTContext);
  const [editedContent, setEditedContent] = useState("");
  const { reverteditor, setReverteditor, addMtswift, MtLogs, SwiftLogs } =
    context;
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const handleCloseRemarkModal = () => setShowRemarkModal(false);
  let combinedHTML;

  const handleOpenRevertModal = () => {
    setShowRevertModal(true);
    const divContent = document.querySelector("#swiftcontent").innerHTML;
    setReverteditor({
      ...reverteditor,
      contest: divContent,
      // assignedto: contents.Maker,
    });
    handleCloseModal();
  };
  const handleCloseRevertModal = () => setShowRevertModal(false);

  function getTextWithBreakdown(element) {
    let result = "";
    let posCount= 0;
    function traverse(node) {
      
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains("pos")) {
          // console.log(posCount)
          if (posCount > 0) {
            result += " <br/> "; // Add a line break for the second and subsequent elements with class "pos"
          }
          posCount++;
        }
        for (let childNode of node.childNodes) {
          traverse(childNode);
        }
      }
    }

    traverse(element);
    const sanitizedHtml = sanitize(result);
    return sanitizedHtml;
  }

  const handleApprove = async () => {
    const swiftContentHTML = swiftContentRef.current.innerHTML;
    // // console.log(swiftContentHTML);
    const addContentHTML = addContentRef.current.innerHTML;
    // console.log(addContentHTML);
    const approvedContentHTML = approvedContentRef.current.innerHTML;
    // console.log(approvedContentHTML);
    combinedHTML = swiftContentHTML + addContentHTML + approvedContentHTML;
    // console.log(combinedHTML);
    addMtswift({
      id: contents.id,
      Title: contents.title,
      Status: 3,
      Approved_Swift_Msg: combinedHTML,
    });
    handleCloseModal();
  };

  const handlePreview = () => {
    setEditedContent({
      sender: document.querySelector("#sender")
        ? document.querySelector("#sender").textContent
        : "",
      sendertwo: document.querySelector("#sender2")
        ? document.querySelector("#sender2").textContent
        : "",
      receiver: document.querySelector("#receiver")
        ? document.querySelector("#receiver").textContent
        : "",
      receivertwo: document.querySelector("#receiver2")
        ? document.querySelector("#receiver2").textContent
        : "",
      remid: document.querySelector("#remid")
        ? document.querySelector("#remid").textContent
        : "",
      BOC: document.querySelector("#BOC")
        ? document.querySelector("#BOC").textContent
        : "",
      curamnt: document.querySelector("#curamnt")
        ? getTextWithBreakdown(document.querySelector("#curamnt"))
        : "",
      appac: document.querySelector("#appac")
        ? getTextWithBreakdown(document.querySelector("#appac"))
        : "",
      pan: document.querySelector("#pan")
        ? document.querySelector("#pan").textContent
        : "",
      party: document.querySelector("#party")
        ? getTextWithBreakdown(document.querySelector("#party"))
        : "",
      Instrument: document.querySelector("#Instrument")
        ? getTextWithBreakdown(document.querySelector("#Instrument"))
        : "",
      cod: document.querySelector("#cod")
        ? document.querySelector("#cod").textContent
        : "",
      cod2: document.querySelector("#cod2")
        ? document.querySelector("#cod2").textContent
        : "",
      DOC: document.querySelector("#DOC")
        ? getTextWithBreakdown(document.querySelector("#DOC"))
        : "",
    });
    setPreview(true);
  };

  return (
    <div>
      <RevertBack
        showModal={showRevertModal}
        handleCloseModal={handleCloseRevertModal}
        id={contents.id}
        title={contents.title}
        // revmakers={contents.Maker}
      />
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-lg"
        style={{ zIndex: 10000 }}
      >
        <ViewRemark
          showModal={showRemarkModal}
          handleCloseModal={handleCloseRemarkModal}
          contents={contents}
          handleCloseViewModal={handleCloseModal}
        />
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
            {/* {contents.status} */}
            <div ref={ref} className="p-2">
              {[1, 2, 5].includes(contents.status) && (
                <div
                  id="swiftcontent"
                  ref={swiftContentRef}
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

              <div
                id="addcontent"
                ref={addContentRef}
                className={
                  Preview === false ||
                  contents.status === 3 ||
                  contents.status === 4
                    ? "d-none"
                    : ""
                }
                // className={contents.status === 3 ? "mt-3" : "d-none"}
              >
                <div id="approved">
                  <div className="pdf_file">
                    <table className="table table-bordered mt-4">
                      <tbody>
                        <tr>
                          <td className="col-sm-3">SENDER INSTITUTION</td>
                          <td colspan="3">
                            {editedContent.sender}
                            <br />
                            {editedContent.sendertwo}
                          </td>
                        </tr>
                        <tr>
                          <td className="col-sm-3">RECEIVER INSTITUTION</td>
                          <td colspan="3">
                            {editedContent.receiver}
                            <br />
                            {editedContent.receivertwo}
                          </td>
                        </tr>
                        <tr>
                          <td className="col-sm-3">SENDER REFERENCE</td>
                          <td colspan="3">{editedContent.remid}</td>
                        </tr>
                        <tr>
                          <td>BANK OPERATION Code</td>
                          <td colspan="3">{editedContent.BOC}</td>
                        </tr>
                        <tr>
                          <td>VALUE DATE (YYMMDD)/CUR/AMOUNT</td>
                          <td colspan="3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: editedContent.curamnt,
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td rowspan="2">
                            ORDERING CUSTOMER - ACCOUNT NAME AND ADDRESS
                          </td>
                          <td colspan="3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: editedContent.appac,
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colspan="3">{editedContent.pan}</td>
                        </tr>
                        <tr>
                          <td rowspan="1">
                            ACCOUNT WITH INSTITUTION – PARTY IDENTIFIER –NAME
                            AND ADDRESS
                          </td>
                          <td colspan="3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: editedContent.party,
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td rowspan="1">
                            BENEFICIARY CUSTOMER – ACCOUNT – NAME AND ADDRESS
                          </td>
                          <td colspan="3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: editedContent.Instrument,
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td rowspan="2">REMITTANCE INFORMATION</td>
                          <td colspan="3">{editedContent.cod}</td>
                        </tr>
                        <tr>
                          <td colspan="3">{editedContent.cod2}</td>
                        </tr>
                        <tr>
                          <td rowspan="5">DETAIL OF CHARGES</td>
                          <td colspan="3">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: editedContent.DOC,
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div ref={approvedContentRef} className="d-none">
                <div id="approvedtwo">
                  <div className="pdf_file d-flex">
                    <table className="table-bordered w-25 text-center">
                      <tr>
                        <th style={{ height: "40px" }}>RECOMMENDED BY</th>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>
                          <span className="border border-2 border-success rounded p-1">
                            Recommended
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>{contents.Maker}</td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>Trade Finance</td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>
                          Date:{" "}
                          {new Date(contents.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    </table>

                    <table className="table-bordered mx-5 w-25 text-center">
                      <tr>
                        <th style={{ height: "40px" }}>APPROVED BY</th>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>
                          <span className="border border-2 border-success rounded p-1">
                            Approved
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>
                          {decodedToken.data.recordset[0].Username}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>Trade Finance</td>
                      </tr>
                      <tr>
                        <td style={{ height: "40px" }}>
                          Date:{" "}
                          {new Date(contents.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
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
            <hr />
            {SwiftLogs.map(
              (log, index) =>
                log.Message === "5" && (
                  <div key={index} className="mb-2">
                    <p>
                      <i className="bi bi-three-dots-vertical"></i>{" "}
                      {log.username} has commented following to Trade.
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => ref.current}
            trigger={() => <Button type="primary">Print</Button>}
          />
          {/* <Button variant="secondary" >
            Print
          </Button> */}
          <Button
            variant="primary"
            disabled={[2, 3, 4, 5, 6].includes(contents.status)}
            onClick={() => handlePreview()}
          >
            Preview
          </Button>
          {Preview && (
            <Button
              variant="success"
              disabled={[2, 3, 4, 5, 6].includes(contents.status)}
              onClick={() => {
                handleApprove();
              }}
            >
              Approve
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => {
              handleOpenRevertModal();
            }}
            disabled={[3, 2, 4, 5, 6].includes(contents.status)}
          >
            Revert Back
          </Button>
          <Button
            variant="success"
            disabled={[1, 2, 4, 5, 6].includes(contents.status)}
            onClick={() => setShowRemarkModal(true)}
            title="Forward To Swift"
          >
            <i className="bi bi-fast-forward"></i>
          </Button>
          <Button
            variant="primary"
            disabled={[1, 2, 3, 4, 5].includes(contents.status)}
            // onClick={() => setShowRemarkModal(true)}
            title="Revert To Swift"
          >
            <i className="bi bi-backspace-reverse"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewMt;
