import React, { useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import MTContext from "../../context/MTContext";
import { toast } from "react-toastify";

const RevertBack = ({ showModal, handleCloseModal, id, title }) => {
  const context = useContext(MTContext);
  const { getMaker, reverteditor, setReverteditor, addMtswift } =
    context;

  useEffect(() => {
    getMaker();
  }, []);

  const contextchanged = (event) => {
    setReverteditor({
      ...reverteditor,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (reverteditor.comment.length === 0) {
      toast.error("Please fill the field");
    } else {
      addMtswift({
        id: id,
        Title: title,
        Assigned_to: "Maker",
        Comments: reverteditor.comment,
        Swift_Msg: reverteditor.contest,
        Status: 2,
      });
      setReverteditor({ contest: "", comment: "" });
      handleCloseModal();
    }
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-lg"
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="ml-auto">MT103 SWIFT MESSAGE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {/* {id} */}
            <div className="form-group mb-2">
            <label htmlFor="tag">Revert Back To</label>
            <input
              type="text"
              className="form-control"
              id="maker"
              name="Maker"
              value="Maker"
            />
          </div>
            <div className="form-group mb-2">
              <label htmlFor="tag">Comment</label>
              <textarea
                type="text"
                className="form-control"
                id="comment"
                name="comment"
                rows={4}
                value={reverteditor.comment}
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
    </div>
  );
};

export default RevertBack;
