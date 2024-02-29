import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import MTContext from "../../../context/MTContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForwardModal = ({ showModal, handleCloseModal }) => {
  const navigate = useNavigate();
  const context = useContext(MTContext);
  const {
    addeditor,
    setAddeditor,
    addMtswift,
    MtTitle,
    Appurl,
    Invurl,
    formData,
    TTamount,
    Comurl,
    TranID,
    SelectedHead,
  } = context;

  const contextchanged = (event) => {
    setAddeditor({ ...addeditor, [event.target.name]: event.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(addeditor.assignedto,addeditor.remark);
    if (addeditor.remark.length === 0 || MtTitle.length === 0) {
      toast.error("Please fill the field");
    } else {
      // console.log(swiftTable);
      addMtswift({
        id: addeditor.id,
        Title: MtTitle,
        Assigned_to: "Checker",
        Remarks: addeditor.remark,
        Swift_Msg: addeditor.contest,
        Status: 1,
        TT_app_url: Appurl,
        Performa_url: Invurl ? Invurl : Comurl,
        Ttref: formData.ttnum ? formData.ttnum : formData.icpnum,
        Amount: TTamount,
        Ticket: formData.ticket,
        Tran_ID: TranID.trim(),
        Refstatus: SelectedHead.value,
      });
      setAddeditor({ contest: " ", title: "", remark: "" });
      handleCloseModal();
      navigate("/mtassign");
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: 10000 }}>
      <Modal.Header closeButton>
        <Modal.Title>Forward MT103 {TranID}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {/* {addeditor.assignedto} */}
          {/* {addeditor.status} */}
          <div className="form-group mb-2">
            <label htmlFor="tag">Forward To</label>
            <input
              type="text"
              className="form-control"
              id="checker"
              name="checker"
              value="Checker"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="tag">Reference Code</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={MtTitle}
              // onChange={contextchanged}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="tag">Remark</label>
            <input
              type="text"
              className="form-control"
              id="remark"
              name="remark"
              value={addeditor.remark}
              onChange={contextchanged}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClick}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ForwardModal;
