import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm,useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MTContext from "../../context/MTContext";
import Select from "react-select";
import {toast} from 'react-toastify';

 
const ViewTicket = ({
  showModal,
  handleCloseModal,
  contents,
  handleCloseViewModal,
}) => {
  const context = useContext(MTContext);
  const { getticketdata, updateticket } = context;
  const schema = yup.object().shape({
    reticket: yup.string().required(),
    refstatus: yup.string().required()
  });

  const Status = [
    { value: "Advance", label: "Advance" },
    { value: "Credit", label: "Credit" }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { field: { value: refValue, onChange: refonChange, ...restStatusField } } = useController({ name: 'refstatus', control });

  const submitForm = async (data) => {
    // console.log(data.reticket);
    // console.log(data.refstatus);
    const getticket = await getticketdata(data.reticket,data.refstatus);
    if (getticket.status === true) {
      let Application = getticket.Appurl;
      let Performa = getticket.Invurl ? getticket.Invurl : getticket.Comurl;
      const upticket = await updateticket({
        id: contents.id,
        Application,
        Performa,
        Ticket_No: data.reticket,
      });
      if(upticket.status === true){
        toast.success("Updated Sucessfully");
      }
      handleCloseModal();
      handleCloseViewModal();
    }
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Re-Generate Ticket Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(submitForm)}>
          <div className="form-group mb-2">
              <label htmlFor="tag">Select Advance/Credit</label>
              <Select
                options={Status}
                placeholder="Select Advance/Credit"
                defaultValue={contents.Refstatus}
                value={
                  refValue
                    ? Status.find((x) => x.value === refValue)
                    : refValue
                }
                onChange={(option) =>
                  refonChange(option ? option.value : option)
                }
                {...restStatusField}//gets the field from above useController defined
              />
               <i className="text-danger">{errors.refstatus?.message}</i>
            </div>
            <div className="form-group mb-2">
              <label htmlFor="tag">Add Ticket Number </label>
              <input
                type="text"
                className="form-control"
                defaultValue={contents.Ticket_No}
                {...register("reticket")}
              />
              <i className="text-danger">{errors.reticket?.message}</i>
            </div>   
            <Button variant="success" className="float-right" type="submit">
              Re-Generate
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewTicket;
