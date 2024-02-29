import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useForm } from "react-hook-form";
import MTContext from "../../context/MTContext";
import { decodeToken } from "react-jwt";

const ViewApproved = ({ showModal, handleCloseModal, appfiles }) => {
  const context = useContext(MTContext);
  const { uploadfile } = context;
  let token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset 
  } = useForm();

  const submitForm = (formData) => {
    uploadfile({
      staff_id: decodedToken.data.recordset[0].StaffId,
      branch_id: decodedToken.data.recordset[0].Branch,
      department_id: decodedToken.data.recordset[0].DeptId,
      outward_tt_requests_id: appfiles.id,
      name: decodedToken.data.recordset[0].Username,
      conclusion: "From Swift",
      swift_file_name: formData.swift_file_name,
      swift_file: formData.picture[0]
    });
    reset();
    handleCloseModal();
  };

  const handleView = (file) => {
    const url = process.env.REACT_APP_UAT_API_URL + file;
    window.open(url, "_blank");
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Approved File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs>
            <TabList>
              <Tab>Files</Tab>
              <Tab>Upload Approved File</Tab>
            </TabList>
            <TabPanel>
              <table className="table text-center">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">S.N</th>
                    <th scope="col">File Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appfiles.resp.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{all.swift_file_name}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              handleView(all.swift_file);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group">
                  <input
                    {...register("swift_file_name", {
                      required: "File name is required",
                    })}
                    className="form-control"
                    placeholder="Enter File name"
                  />
                  {errors.swift_file_name && (
                    <i className="text-danger">
                      {errors.swift_file_name.message}
                    </i>
                  )}
                </div>
                <div className="form-group">
                  <input
                    {...register("picture", {
                      required: "Approved File is required",
                    })}
                    type="file"
                    id="picture"
                    className="form-control"
                  />
                  {errors.picture && (
                    <i className="text-danger">{errors.picture.message}</i>
                  )}
                </div>
                <button
                  className="btn btn-sm btn-primary float-right"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </TabPanel>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success">
            Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewApproved;
