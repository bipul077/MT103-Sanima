import React from "react";
import { Button, Modal } from "react-bootstrap";

const CommentModal = ({ showModal, handleCloseModal, comments }) => {
  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group mb-2">
              <label htmlFor="tag">Comment</label>
              <textarea
                type="text"
                className="form-control"
                id="comment"
                name="comment"
                rows={4}
                value={comments}
              />
            </div>
          </form>
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

export default CommentModal;
