import React, { useContext, useState, useEffect } from "react";
import { useForm, useController } from "react-hook-form";
import Select from "react-select";
import { Button } from "react-bootstrap";
// import LogsModal from "../CheckerDashboard/LogsModal";
import ViewerMt from "./ViewerMt";
import MTContext from "../../context/MTContext";
import ReactPaginate from "react-paginate";
import LogsModal from "../CheckerDashboard/LogsModal";
import ViewApproved from "../CheckerDashboard/ViewApproved";


const ViewTable = () => {
  const context = useContext(MTContext);
  const {
    searchMT,
    setLoading,
    mtswift,
    PagesCount,
    fetchMT,
    setMtswift,
    getMTswift,
    getmtswiftlogs,
    getswiftlogs,
    getfile,
    setappfiles,
    appfiles
  } = context;

  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [Data, setData] = useState();
  const [content, setContent] = useState({
    id: null,
    status: null,
    swift: null,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  // const [showLogsModal, setShowLogsModal] = useState(false);
  const handleCloseViewModal = () => setShowViewModal(false);
  const handleCloseApprovedModal = () => setShowApprovedModal(false);
  // const handleCloseLogsModal = () => setShowLogsModal(false);

  useEffect(() => {
    getMTswift();
  }, []);

  const Status = [
    { value: "3", label: "Approved" },
    { value: "1", label: "Forwarded To Checker" },
    { value: "2", label: "Reverted Back To Maker" },
    { value: "4", label: "Forwarded To Swift" },
    { value: "5", label: "Reverted By Swift" },
    { value: "6", label: "Approved By Swift" },
  ];

  const { register, handleSubmit, control } = useForm();

  const {
    field: { value: statusValue, onChange: statusOnChange, ...restStatusField },
  } = useController({ name: "status", control });

  const submitForm = (data) => {
    setLoading(true);
    setData({ ...data });
    searchMT(1, data);
  };

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (Data) {
      searchMT(currentPage, Data);
    } else {
      const datafromserver = await fetchMT(currentPage);
      setMtswift(datafromserver);
    }
  };

  // const handleOpenLogsModal = (id) => {
  //   setShowLogsModal(true);
  //   getmtswiftlogs(id);
  //   getswiftlogs(id);
  // };
  const handledownload = async(id) => {
    const resp = await getfile(id);
    setappfiles({resp:resp,id:id});
    setShowApprovedModal(true);
  };

  const handleOpenViewModal = (
    id,
    title,
    status,
    swift,
    TT_app_url,
    Performa_url,
    Maker,
    Checker,
    createdAt,
    updatedAt,
    Ttref,
    Amount,
    Approved_Swift_Msg,
    swift_request_id
  ) => {
    getmtswiftlogs(id);
    setShowViewModal(true);
    setContent({
      id,
      title,
      status,
      swift,
      TT_app_url,
      Performa_url,
      Maker,
      Checker,
      createdAt,
      updatedAt,
      Ttref,
      Amount,
      Approved_Swift_Msg,
      swift_request_id,
    });
  };

  return (
    <>
    <ViewApproved
          showModal={showApprovedModal}
          handleCloseModal={handleCloseApprovedModal}
          appfiles={appfiles}
        />
      <div className="card w-100">
        <div className="card-header text-center">
          <strong>Search MT103</strong>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="row p-3">
            <div className="col-sm-4">
              <div className="form-group">
                <label>
                  <i>Reference No</i>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter TT/IFSC num"
                  {...register("reference")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label>
                  <i>Input Date From</i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  {...register("startdate")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label>
                  <i>Input Date To</i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  {...register("enddate")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <Select
                  options={Status}
                  placeholder="Select Status"
                  value={
                    statusValue
                      ? Status.find((x) => x.value === statusValue)
                      : statusValue
                  }
                  onChange={(option) =>
                    statusOnChange(option ? option.value : option)
                  }
                  {...restStatusField}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Enter Staff name to search"
                  {...register("staff")}
                />
              </div>
            </div>
            <div className="col-sm-4" title="search">
              <div className="form-group">
                <div>
                  <Button variant="success" type="submit">
                    <i className="bi bi-search"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="card mt-2">
        <div className="card-header text-center">
          <strong className="text-center">Assigned MT103</strong>
        </div>
        <div className="card-body text-center">
          <ViewerMt
            showModal={showViewModal}
            handleCloseModal={handleCloseViewModal}
            contents={content}
          />
          {/* <LogsModal
          showModal={showLogsModal}
          handleCloseModal={handleCloseLogsModal}
        /> */}
          <div className="table-responsive">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">S.N.</th>
                  <th scope="col">Ref.Code</th>
                  <th scope="col">Tic.No</th>
                  <th scope="col">RequestBy</th>
                  <th scope="col">RequestAt</th>
                  <th scope="col">AssignedTo</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {mtswift.map((all, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <th scope="row">{all.id}</th>
                      <td>{all.Ttref}</td>
                      <td>{all.Ticket_No}</td>
                      <td>{all.Request_By}</td>
                      <td>{new Date(all.updatedAt).toLocaleString()}</td>
                      <td>{all.Assigned_to}</td>
                      <td>{all.Amount}</td>
                      <td>{all.Remarks}</td>
                      {/* <td>
                      <i
                        className="bi bi-view-list cursor-pointer"
                        onClick={() => {
                          handleComment(all.Comments);
                        }}
                      ></i>
                    </td> */}
                      <td>
                        <span
                          className={
                            all.Status === 1
                              ? "badge badge-danger"
                              : all.Status === 3 || all.Status === 6
                              ? "badge badge-success"
                              : all.Status === 2
                              ? "badge badge-info"
                              : all.Status === 4
                              ? "badge badge-primary"
                              : all.Status === 5
                              ? "badge badge-danger"
                              : ""
                          }
                        >
                          {all.Status === 1
                            ? "Forwarded to Checker"
                            : all.Status === 2
                            ? "Reverted to Maker"
                            : all.Status === 3
                            ? "Approved"
                            : all.Status === 4
                            ? "Forwarded To Swift"
                            : all.Status === 5
                            ? "Reverted By Swift"
                            : all.Status === 6
                            ? "Accepted By Swift"
                            : null}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          {all.Status === 6 && (
                            <button
                              className="btn btn-sm btn-success"
                              title="View Approved File"
                              onClick={() => {
                                handledownload(all.id);
                              }}
                            >
                              <i className="bi bi-file-arrow-up-fill"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-primary ms-2"
                            title="view"
                            onClick={() => {
                              handleOpenViewModal(
                                all.id,
                                all.Title,
                                all.Status,
                                all.Swift_Msg,
                                all.TT_app_url,
                                all.Performa_url,
                                all.Request_By,
                                all.Assigned_to,
                                all.createdAt,
                                all.updatedAt,
                                all.Ttref,
                                all.Amount,
                                all.Approved_Swift_Msg,
                                all.swift_request_id
                              );
                            }}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          {/* <button
                          className="btn btn-sm btn-warning ms-2"
                          onClick={() => {
                            handleOpenLogsModal(all.id);
                          }}
                        >
                          Logs
                        </button> */}
                        </div>
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
            pageCount={PagesCount}
            marginPagesDisplayed={2} //number of page to be displayed at the end(before next)
            pageRangeDisplayed={2} //number of pages showing after clicking break item
            onPageChange={handlePageChange}
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
    </>
  );
};

export default ViewTable;
