import React,{useContext} from "react";
import MTContext from "../context/MTContext";
import { Button, Modal } from "react-bootstrap";

const DeleteModal = ({ id, show, handleClose }) => {
  const context = useContext(MTContext);
  const { deletemtswift } = context;
  return (
    <div>
      <Modal show={show} onHide={handleClose} style={{ zIndex: 10000 }}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={()=>deletemtswift(id)}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteModal;
