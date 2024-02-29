import React, { useEffect, useContext } from "react";
import MTContext from "../../context/MTContext";
import { Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const Tradestaff = () => {
  const context = useContext(MTContext);
  const {
    allstaff,
    getStaff,
    deleteStaff,
    setDeleteid,
    setShow,
    show,
    staffCount,
    fetchStaff,
    setAllstaff,
  } = context;

  useEffect(() => {
    getStaff();
  }, []);

  const handleClickDelete = (id) => {
    setDeleteid(id);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handlePageStaffChange = async (data) => {
    let currentPage = data.selected + 1;
    const datafromserver = await fetchStaff(currentPage);
    setAllstaff(datafromserver);
  };

  return (
    <div className="card text-center">
      <Modal show={show} onHide={handleClose} style={{ zIndex: 10000 }}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={deleteStaff}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">StaffId</th>
                <th scope="col">Full Name</th>
                <th scope="col">Department</th>
                <th scope="col">Role</th>
                <th scope="col">CreatedBy</th>
                <th scope="col">UpdatedBy</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {allstaff.map((all, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <th scope="row">{all.id}</th>
                    <td>{all.StaffId}</td>
                    <td>{all.Name}</td>
                    <td>{all.Department_Name}</td>
                    <td>{all.Role}</td>
                    <td>{all.Created_By}</td>
                    <td>{all.Updated_By}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          handleClickDelete(all.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={staffCount} //numer of pages to be shown in pagination
          marginPagesDisplayed={2} //number of page to be displayed at the end(before next)
          pageRangeDisplayed={2} //number of pages showing after clicking break item
          onPageChange={handlePageStaffChange}
          containerClassName={"pagination justify-content-center"} //bootstrap class
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default Tradestaff;
