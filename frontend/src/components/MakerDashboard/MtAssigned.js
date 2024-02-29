import React, { useContext, useEffect, useState } from "react";
import MTContext from "../../context/MTContext";
import ViewModal from "./ViewModal";
import CommentModal from "./CommentModal";
import LogsModal from "../CheckerDashboard/LogsModal";
import SideNav from "../SideNav";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { useForm, useController } from "react-hook-form";
import { Button } from "react-bootstrap";
import Spinner from "../Spinner";
import DeleteModal from "../DeleteModal";
import ViewApproved from "../CheckerDashboard/ViewApproved";

const MtAssigned = () => {
  const context = useContext(MTContext);
  const parser = new DOMParser();
  const {
    getMTswift,
    mtswift,
    setMtTitle,
    getmtswiftlogs,
    open,
    PagesCount,
    setMtswift,
    fetchMT,
    searchMT,
    Loading,
    setLoading,
    checker,
    getswiftlogs,
    verifyrole,
    showDelete,
    setShowDelete,
    getfile,
    setappfiles,
    appfiles
  } = context;
  const [showViewModal, setShowViewModal] = useState(false);

  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [Data, setData] = useState();
  const [mtdeleteid, setmtdeleteid] = useState();
  const [content, setContent] = useState({
    id: null,
    status: null,
    title: "",
    remark: "",
    assignedto: "",
    contest: "",
    TT_app: "",
    Performa: "",
    Refstatus: { label: "", value: "" },
  });
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const handleCloseApprovedModal = () => setShowApprovedModal(false);
  const [comment, setComment] = useState();
  // const [argdept, setargdept] = useState([]);

  useEffect(() => {
    verifyrole("verifymaker");
  }, []);

  const Status = [
    { value: "3", label: "Approved" },
    { value: "1", label: "Forwarded To Checker" },
    { value: "2", label: "Reverted Back To Maker" },
    { value: "4", label: "Forwarded To Swift" },
    { value: "5", label: "Reverted By Swift" },
    { value: "6", label: "Approved By Swift" },
  ];

  const {
    register,
    handleSubmit,
    // formState: { errors },
    control,
  } = useForm();

  const {
    field: { value: statusValue, onChange: statusOnChange, ...restStatusField },
  } = useController({ name: "status", control });

  useEffect(() => {
    getMTswift();
  }, []);

  const submitForm = (data) => {
    setLoading(true);
    setData({ ...data });
    searchMT(1, data);
  };

  const handleOpenViewModal = (
    id,
    status,
    title,
    remark,
    assignedto,
    contest,
    TT_app,
    Performa,
    Maker,
    Checker,
    createdAt,
    updatedAt,
    Ticket_No,
    Refstatus,
    Approved_Swift_Msg,
    is_reverted
  ) => {
    getmtswiftlogs(id);
    getswiftlogs(id);
    setShowViewModal(true);
    // const doc = parser.parseFromString(contest, 'text/html');
    // // console.log(doc)
    // const mtswiftHtmlElement = doc.getElementById('SwiftHtml') ? doc.getElementById('SwiftHtml').outerHTML : "";
    // console.log(Refstatus);
    setContent({
      id,
      status,
      remark,
      assignedto,
      contest,
      // revcontest:mtswiftHtmlElement,
      TT_app,
      Performa,
      Maker,
      Checker,
      createdAt,
      updatedAt,
      Ticket_No,
      Refstatus: { label: Refstatus, value: Refstatus },
      Approved_Swift_Msg,
      is_reverted
    });
    setMtTitle(title);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const handleOpenCommentModal = () => setShowCommentModal(true);
  const handleCloseCommentModal = () => setShowCommentModal(false);

  const handleOpenLogsModal = (id) => {
    setShowLogsModal(true);
    getmtswiftlogs(id);
    getswiftlogs(id);
  };
  const handleCloseLogsModal = () => setShowLogsModal(false);

  const handleComment = (com) => {
    handleOpenCommentModal();
    setComment(com);
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
  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleClickDelete = (id) => {
    setmtdeleteid(id);
    setShowDelete(true);
  };

  const handledownload = async(id) => {
    const resp = await getfile(id);
    setappfiles({resp:resp,id:id});
    setShowApprovedModal(true);
  };

  return (
    <div>
      <DeleteModal
        show={showDelete}
        handleClose={handleCloseDelete}
        id={mtdeleteid}
      />
      <ViewModal
        showModal={showViewModal}
        handleCloseModal={handleCloseViewModal}
        contents={content}
      />
      <CommentModal
        showModal={showCommentModal}
        handleCloseModal={handleCloseCommentModal}
        comments={comment}
      />
      <LogsModal
        showModal={showLogsModal}
        handleCloseModal={handleCloseLogsModal}
      />
      <ViewApproved
          showModal={showApprovedModal}
          handleCloseModal={handleCloseApprovedModal}
          appfiles={appfiles}
        />
      {Loading && <Spinner />}
      <div className="container-fluid min-vh-100">
        <div className="row">
          {open && <div className="col-4 col-md-2"></div>}
          <div className="col-4 col-md">
            <SideNav role="Maker" />
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header text-center">
                      <strong>Search MT103</strong>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(submitForm)}>
                        <div className="row">
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
                                    ? Status.find(
                                        (x) => x.value === statusValue
                                      )
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
                  </div>
                </div>
                <div className="col-sm-12 mt-3 mb-3">
                  <div className="card text-center">
                    <div className="card-header">
                      <strong className="text-center">Assigned MT103 </strong>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">S.N.</th>
                              <th scope="col">Ref.Code</th>
                              <th scope="col">Ticket_No</th>
                              <th scope="col">RequestBy</th>
                              <th scope="col">AssignedTo</th>
                              <th scope="col">RequestAt</th>
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
                                  <th scope="row">{index+1}</th>
                                  <td>{all.Ttref}</td>
                                  <td>{all.Ticket_No}</td>
                                  <td>{all.Request_By}</td>
                                  <td>{all.Assigned_to}</td>
                                  <td>
                                    {new Date(all.updatedAt).toLocaleString()}
                                  </td>
                                  <td>{all.Amount.replace(/\./g, ",")}</td>
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
                                        all.Status === 2
                                          ? "badge badge-danger"
                                          : all.Status === 3 || all.Status === 6
                                          ? "badge badge-success"
                                          : all.Status === 1
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
                                        ? "Approved By Swift"
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
                                        title="View"
                                        className="btn btn-sm btn-primary ms-2"
                                        onClick={() => {
                                          handleOpenViewModal(
                                            all.id,
                                            all.Status,
                                            all.Title,
                                            all.Remarks,
                                            all.Request_By,
                                            all.Swift_Msg,
                                            all.TT_app_url,
                                            all.Performa_url,
                                            all.Request_By,
                                            all.Assigned_to,
                                            all.createdAt,
                                            all.updatedAt,
                                            all.Ticket_No,
                                            all.Refstatus,
                                            all.Approved_Swift_Msg,
                                            all.is_reverted
                                          );
                                        }}
                                      >
                                        <i className="bi bi-eye-fill"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-warning ms-2"
                                        onClick={() => {
                                          handleOpenLogsModal(all.id);
                                        }}
                                      >
                                        Logs
                                      </button>
                                      <button
                                        title="Delete"
                                        className="btn btn-sm btn-danger ms-2"   
                                        disabled={[4,5,6].includes(all.Status)}
                                        onClick={() => {
                                          handleClickDelete(all.id);
                                        }}
                                      >
                                        <i className="bi bi-trash3-fill"></i>
                                      </button>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MtAssigned;
