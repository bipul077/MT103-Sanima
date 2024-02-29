import React, { useContext,useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import MTContext from "../../context/MTContext";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

const ViewRemark = ({
  showModal,
  handleCloseModal,
  contents,
  handleCloseViewModal,
}) => {
  const context = useContext(MTContext);
  const { forSwift, setForSwift, addMtswift, Loading, setLoading, sendmail } = context;
  const { sendTrade } = context;
  let token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const handlechanged = (event) => {
    setForSwift({ ...forSwift, [event.target.name]: event.target.value });
  };
  const current = new Date();
  const parser = new DOMParser();
  const tableContentRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    const date = `${current.getFullYear()}-${
      String(current.getMonth() + 1).padStart(2, '0')
    }-${String(current.getDate()).padStart(2, '0')}`;
    const doc = parser.parseFromString(contents.swift, "text/html");
    const swiftHtmlElement = doc.getElementById("SwiftHtml");
    const extractedHtml = swiftHtmlElement.innerHTML;
    const docs = parser.parseFromString(contents.Approved_Swift_Msg, "text/html");
    const swiftApprovedElement = docs.getElementById("approved").innerHTML + docs.getElementById("approvedtwo").innerHTML;
    // console.log(swiftApprovedElement)
    const forward_to_swift_status = contents.swift_request_id ? "2" : ""; //if revert then 2 else ""
    const getresp = await sendTrade({
      remarks: forSwift.remark,
      file_text: extractedHtml,
      file_pdf: swiftApprovedElement,
      forwarded_by: decodedToken.data.recordset[0].Username,
      forwarded_branch: decodedToken.data.recordset[0].Branch,
      forwarded_department: decodedToken.data.recordset[0].DeptId,
      forwarded_at: date,
      conclusion: "From MT103",
      forwarded_domain_name: window.location.href,
      outward_tt_requests_id: contents.id,
      forward_to_swift_status: forward_to_swift_status,
      swift_request_id: contents.swift_request_id,
      message_type: "MT103" + contents.Ttref,
      currency_code: contents.Amount.substring(0, 3),
      cbs_reference_no: contents.Ttref,
      cbs_fcy_amount: contents.Amount.substring(3),
      application_for_fund_transfer_image: contents.TT_app_url,
      application_for_fund_transfer_image_name: "Application",
    });
    // console.log(getresp)
    if (getresp.status === true) {
      addMtswift({
        id: contents.id,
        Status: 4,
        Title: contents.title,
        is_forwarded_to_swift: 1,
        Swift_remark: forSwift.remark,
      });
      toast.success("Forwarded To Swift");
      const addtableContent = tableContentRef.current.innerHTML;
      sendmail({
        to: process.env.REACT_APP_MAIL_TO,
        cc: process.env.REACT_APP_CC,
        subject: "MT103",
        text:
          "We have executed the swift payment transaction. Please do the needful." +
          "\n" +
          addtableContent,
      });
      handleCloseModal();
      handleCloseViewModal();
      setLoading(false);
    } else {
      toast.error(getresp.message);
    }
  };
  return (
    <>
      {Loading && <Spinner />}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forward To Swift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group mb-2">
              <label htmlFor="tag">Remark</label>
              <input
                type="text"
                className="form-control"
                id="remark"
                name="remark"
                value={forSwift.remark}
                onChange={handlechanged}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={forSwift.remark < 1}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      <div id="mailsend" ref={tableContentRef} className="d-none">
        <table className="table table-bordered">
          <thead>
            <tr>
              <td>
                <b>TT Ref:</b>
              </td>
              <td>
                <b>Amount:</b>
              </td>
              <td>
                <b>Click Link:</b>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{contents.Ttref}</td>
              <td>{contents.Amount.replace(/\./g, ",")}</td>
              <td>https://sanimaapp.sanimabank.com/MT103/</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewRemark;
