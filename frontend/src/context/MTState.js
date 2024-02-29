import React, { useState } from "react";
import MTContext from "./MTContext";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import numberToWords from "number-to-words";

const MTState = (props) => {
  const [toggle, setToggle] = useState(true);
  const staffInitial = [];
  const [allstaff, setAllstaff] = useState(staffInitial);
  const [deleteid, setDeleteid] = useState("");
  const [show, setShow] = useState(false);
  const [staffCount, setstaffCount] = useState();
  const [Headlogs, setHeadlogs] = useState([]);
  const [staff, setstaff] = useState([]);
  const [checker, setChecker] = useState([]);
  const [maker, setMaker] = useState([]);

  const [mtswift, setMtswift] = useState([]);
 
  const [MtLogs, setMtLogs] = useState([]);
  const [SwiftLogs, setSwiftLogs] = useState([]);
  const [open, setOpen] = useState(true);
  const [PagesCount, setPagesCount] = useState(0);
  const [Appurl, setAppurl] = useState();
  const [Invurl, setInvurl] = useState();
  const [Comurl, setComurl] = useState();
  const [invNostro, setinvNostro] = useState("");
  const [Loading, setLoading] = useState();
  const [TranID, setTranID] = useState("");
  const [Disable, setDisable] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [SelectedHead, setSelectedHead] = useState({
    label: "Advance",
    value: "Advance",
  });
  let application = "";
  let performa = "";
  let commercial = "";
  const [appfiles, setappfiles] = useState({ resp: [], id: "" });
  // const [SwiftCode, setSwiftCode] = useState([]);
  const [formData, setFormData] = useState({
    ticket: "",
    ttnum: "",
    icpnum: "",
  });
  const [TTamount, setTTamount] = useState("");
  const [forSwift, setForSwift] = useState({ remark: "" });
  const [swifthtml, setSwifthtml] = useState();
  // const [mtswift, setmtswift] = useState();

  const [addeditor, setAddeditor] = useState({
    id: null,
    contest: " ",
    remark: "",
    assignedto: "",
    status: "",
    swift: null,
  });
  const [reverteditor, setReverteditor] = useState({
    contest: "",
    comment: "",
    assignedto: "",
  });
  const uniqueNumber = uuidv4().split("-")[0].substring(0, 6);
  const [MtTitle, setMtTitle] = useState(uniqueNumber);

  const Logout = () => {
    localStorage.clear();
    window.location.href = "/MT103";
  };

  const Trigger = () => {
    setToggle(!toggle);
  };

  async function updateStaff(StaffId, Name, Role, action) {
    const apiUrl = process.env.REACT_APP_UAT_API_URL + `api/logshead`;
    const authToken = localStorage.getItem("token");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      body: JSON.stringify({ StaffId, Name, Role, Action: action }),
    });

    const json = await response.json();
    return json;
  }

  const addStaff = async (selectedstaff, role) => {
    let success = false;
    for (let i = 0; i < selectedstaff.length; i++) {
      const staffMember = selectedstaff[i];
      const StaffId = staffMember.id;
      const Name = staffMember.name;
      const UserName = staffMember.uname;
      const DepartmentName = staffMember.deptname;
      const Role = role;
      const response = await fetch(
        process.env.REACT_APP_UAT_API_URL + `api/addstaff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
            role: "Admin",
          },
          body: JSON.stringify({
            StaffId,
            Name,
            UserName,
            DepartmentName,
            Role,
          }),
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        success = true;
        let existingStaff = allstaff.find((staff) => staff.StaffId === StaffId);
        if (existingStaff) {
          //for updating
          existingStaff.Name = Name;
          existingStaff.Department_Name = DepartmentName;
          existingStaff.Role = Role;
          existingStaff.Updated_By = json.data.Updated_By;
          let upstaff = await updateStaff(
            StaffId,
            Name,
            Role,
            "Updated By " + json.data.Updated_By
          );
          Headlogs.push(upstaff);
        } else {
          //for creating
          allstaff.push(json);
          let upstaff = await updateStaff(
            StaffId,
            Name,
            Role,
            "Created By " + json.Created_By
          );
          Headlogs.push(upstaff);
        }
      } else {
        toast.error(json.error);
      }
    }
    if (success) {
      setHeadlogs([...Headlogs]);
      setAllstaff([...allstaff]); //same like concat
      toast.success("Added and updated successfully");
    }
  };

  const getHeadLogs = async () => {
    //TODO: API CALL
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/getlogshead`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setHeadlogs(json);
  };

  const deleteStaff = async () => {
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/deletestaff/${deleteid}`,
      {
        //this id is branch id we want to delete
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      const newstaffs = allstaff.filter((abc) => {
        return abc.id !== deleteid;
      });
      setAllstaff(newstaffs);
      toast.success("Deleted successfully");
      setShow(false);
    } else {
      toast.error(json.error);
    }
  };

  //get Assigned Checkers only
  const getChecker = async () => {
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + "api/getchecker",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      const getcheckers = [];
      for (let i = 0; i < json.length; i++) {
        const staffObj = {
          id: json[i].StaffId, //getting from database
          name: json[i].Name,
          uname: json[i].UserName,
          idname: json[i].StaffId + " " + json[i].Name,
        };
        getcheckers.push(staffObj);
      }
      setChecker(getcheckers);
    } else {
      toast.error(json.error);
    }
  };

  //get Assigned Makers only
  const getMaker = async () => {
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + "api/getmaker",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      const getmakers = [];
      for (let i = 0; i < json.length; i++) {
        const staffObj = {
          id: json[i].StaffId,
          name: json[i].Name,
          uname: json[i].UserName,
          idname: json[i].StaffId + " " + json[i].Name,
        };
        getmakers.push(staffObj);
      }
      setMaker(getmakers);
    } else {
      toast.error(json.error);
    }
  };

  const getTradeStaff = async () => {
    const res = await axios.get(
      process.env.REACT_APP_COMMON_API_URL + "api/central/staffs?DepartmentID=8"
    );
    // setstaff(res.data);
    const getstaffs = [];
    for (let i = 0; i < res.data.length; i++) {
      const staffObj = {
        id: res.data[i].StaffId,
        name: res.data[i].fullName,
        deptname: res.data[i].DepartmentName,
        uname: res.data[i].Username,
        idname: res.data[i].StaffId + " " + res.data[i].fullName,
      };
      getstaffs.push(staffObj);
    }
    setstaff(getstaffs);
  };

  const getStaff = async () => {
    //TODO: API CALL
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/getstaff?page=1&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    //console.log(json)
    setstaffCount(json.totalPages);
    setAllstaff(json.content);
  };

  const storeMtlogs = async ({ id, Message, Assigned_to, Status }) => {
    const apiUrl = process.env.REACT_APP_UAT_API_URL + `api/addmtlogs`;
    const authToken = localStorage.getItem("token");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      body: JSON.stringify({ id, Message, Assigned_to, Status }),
    });

    const json = await response.json();
    return json;
    // setHeadlogs(Headlogs.concat(json));
  };

  const storeSwiftlogs = async ({ id, Message, Comment }) => {
    // console.log(id, Message, Comment);
    const apiUrl = process.env.REACT_APP_UAT_API_URL + `api/addswiftlogs`;
    const authToken = localStorage.getItem("token");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      body: JSON.stringify({ id, Message, Comment }),
    });

    const json = await response.json();
    return json;
  };

  const addMtswift = async ({
    id,
    Title,
    Assigned_to,
    Remarks,
    Comments,
    Swift_Msg,
    Status,
    TT_app_url,
    Performa_url,
    Ttref,
    Amount,
    Approved_Swift_Msg,
    Swift_Msg_To_Html,
    is_forwarded_to_swift,
    Swift_remark,
    Comment,
    Ticket,
    Tran_ID,
    Refstatus,
  }) => {
    // console.log(Swift_remark);
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/addmtswift`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id,
          Title,
          Assigned_to,
          Remarks,
          Comments,
          Swift_Msg,
          Status,
          TT_app_url,
          Performa_url,
          Ttref,
          Amount,
          Approved_Swift_Msg,
          Swift_Msg_To_Html,
          is_forwarded_to_swift,
          Swift_remark,
          Ticket,
          Tran_ID,
          Refstatus,
        }),
      }
    );
    const swift = await response.json();
    // console.log(swift);
    if (response.status === 200) {
      // console.log(Status);
      if (Status === 4) {
        storeSwiftlogs({ id, Message: "4", Comment: Swift_remark });
      } else {
        storeMtlogs({
          id: swift.swift.id,
          Message: Remarks || Comments ,
          Assigned_to,
          Status,
        });
        setMtswift(mtswift.concat(swift.swift));
      }
      if (id) {
        //for updating in react(frontend)
        let newswift = JSON.parse(JSON.stringify(mtswift));
        for (let index = 0; index < newswift.length; index++) {
          const element = newswift[index];
          if (element.id === id) {
            newswift[index].Remarks = swift.swift.Remarks;
            newswift[index].Comments = swift.swift.Comments;
            newswift[index].Assigned_to = swift.swift.Assigned_to;
            newswift[index].Status = Status;
            newswift[index].updatedAt = swift.swift.updatedAt;
            newswift[index].Request_By = swift.swift.Request_By;
            newswift[index].Approved_Swift_Msg = swift.swift.Approved_Swift_Msg;
            break;
          }
        }
        setMtswift(newswift);
      }
      toast.success("Sent successfully");
    } else {
      toast.error(swift.error);
    }
  };

  //get all mtswift data from mtswift table according to user
  const getMTswift = async () => {
    //TODO: API CALL
    try {
      const response = await fetch(
        process.env.REACT_APP_UAT_API_URL +
          `api/getmtswift?page=1&limit=${process.env.REACT_APP_MT_PAGE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      // console.log(json.content)
      setMtswift(json.content);
      setPagesCount(json.totalPages);
    } catch {
      console.error("Server Error");
    }
  };

  const fetchMT = async (currentPage) => {
    const res = await fetch(
      process.env.REACT_APP_UAT_API_URL +
        `api/getmtswift?page=${currentPage}&limit=${process.env.REACT_APP_MT_PAGE}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    return data.content;
  };

  //get all mtswift logs from mtswiftlogs table according to title
  const getmtswiftlogs = async (id) => {
    //TODO: API CALL
    const response = await fetch(
      `${
        process.env.REACT_APP_UAT_API_URL
      }api/getmtswiftlogs/${encodeURIComponent(id)}`, //encodeURIComponent is used to properly encode the value in case it contains special characters.
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    // console.log(json);
    setMtLogs(json);
  };

  const verifyToken = async () => {
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/verifytoken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (json.error === "Invalid token") {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const sendmail = async ({ text,to,subject,cc }) => {

    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/sendmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({text,to,subject,cc}),
      }
    );
    // const json = await response.json();
    if (response.status !== 200) {
      toast.error("Something went wrong");
    }
  };

  const fetchStaff = async (currentPage) => {
    const res = await fetch(
      process.env.REACT_APP_UAT_API_URL +
        `api/getstaff?page=${currentPage}&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    return data.content;
  };

  const getswiftcode = async (inputValue, callback) => {
    try {
      const res = await fetch(
        process.env.REACT_APP_UAT_API_URL +
          `api/getswiftcode?swift=${inputValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      const swiftoptions = data.map((staff) => ({
        label: staff.BIC,
        value: staff.BIC,
      }));
      // setSwiftCode(swiftoptions);
      callback(swiftoptions);
    } catch (error) {
      console.error(error);
      callback([]);
    }
  };

  const nostrocode = async (rid) => {
    const res = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/getnostrocode/` + rid,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setinvNostro("");
      const nostro = data[0].Nostro_SWIFT + "," + data[0].BANK_NAME;
      return nostro;
    } else {
      toast.warning("Invalid Nostro");
      setinvNostro("Invalid Nostro");
      setDisable(true);
      const nostro = ",";
      return nostro;
    }
  };

  const sendTrade = async ({
    remarks,
    file_text,
    file_pdf,
    forwarded_by,
    forwarded_branch,
    forwarded_department,
    forwarded_at,
    conclusion,
    forwarded_domain_name,
    outward_tt_requests_id,
    forward_to_swift_status,
    swift_request_id,
    message_type,
    currency_code,
    cbs_reference_no,
    cbs_fcy_amount,
    application_for_fund_transfer_image,
    application_for_fund_transfer_image_name,
  }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      // console.log(file_text);
      const response = await axios.post(
        process.env.REACT_APP_UAT_API_URL + `api/sendtrade`,
        {
          remarks: remarks,
          file_text: file_text,
          file_pdf: file_pdf,
          forwarded_by: forwarded_by,
          forwarded_branch: forwarded_branch,
          forwarded_department: forwarded_department,
          forwarded_at: forwarded_at,
          conclusion: conclusion,
          forwarded_domain_name: forwarded_domain_name,
          outward_tt_requests_id: outward_tt_requests_id,
          forward_to_swift_status: forward_to_swift_status,
          swift_request_id: swift_request_id || "",
          message_type: "103",
          currency_code: currency_code,
          cbs_reference_no: cbs_reference_no,
          cbs_fcy_amount: cbs_fcy_amount,
          application_for_fund_transfer_image:
          application_for_fund_transfer_image,
          application_for_fund_transfer_image_name:
          application_for_fund_transfer_image_name,
        },
        { headers }
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred while sending trade:", error);
      toast.error("Something went wrong");
    }
  };

  const searchMT = async (currentPage, data) => {
    // console.log(currentPage);
    // console.log(data);
    const { status, reference, startdate, enddate, staff } = data ?? {
      status: null,
      reference: null,
      startdate: null,
      enddate: null,
      staff: null,
    };
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const response = await axios.post(
        process.env.REACT_APP_UAT_API_URL +
          `api/searchmt?page=${currentPage}&limit=${process.env.REACT_APP_MT_PAGE}`,
        { status, reference, startdate, enddate, staff },
        { headers }
      );
      // console.log(response);
      if (response.status === 200) {
        setMtswift(response.data.content);
        setPagesCount(response.data.totalPages);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getfile = async (id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const res = await axios.get(
        process.env.REACT_APP_UAT_API_URL + `api/getfile/${id}`,
        { headers }
      );
      return res.data;
      // const url = process.env.REACT_APP_UAT_API_URL + res.data[0].swift_file;
      // window.open(url, '_blank');

      //for downloading files(below code)
      // const response = await fetch(url);
      // console.log(response)
      // const blob = await response.blob();
      // const blobURL = window.URL.createObjectURL(new Blob([blob]));
      // const filename = url.split("/").pop();

      // const aTag = document.createElement("a");
      // aTag.href = blobURL;
      // aTag.setAttribute("download", filename);
      // document.body.appendChild(aTag);
      // aTag.click();
      // aTag.remove();
    } catch (error) {
      console.error(error);
    }
  };

  const getswiftlogs = async (id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const response = await axios.get(
        process.env.REACT_APP_UAT_API_URL + `api/getswiftlogs/${id}`,
        { headers }
      );
      setSwiftLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyrole = async (role) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const response = await axios.get(
        process.env.REACT_APP_UAT_API_URL + `api/${role}`,
        { headers }
      );
      // console.log(response);
    } catch (error) {
      console.error(error);
      localStorage.clear();
      window.location.href = "/MT103";
    }
  };

  const getticketdata = async (ticket, SelectedHead) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_UAT_API_URL + "api/gettradedata/" + ticket,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.data.status === "200") {
        for (let i in response.data.data) {
          if (response.data.data[i].name.includes("Application")) {
            if (response.data.data[i].enadoc_url) {
              application = response.data.data[i].enadoc_url;
              setAppurl(application);
            } else {
              application =
                "https://cladapp.sanimabank.com/files/enadoc/" +
                response.data.data[i].file_path;
              setAppurl(application);
            }
          }
          if (SelectedHead === "Advance") {
            if (response.data.data[i].name.includes("Performa")) {
              if (response.data.data[i].enadoc_url === null) {
                performa =
                  "https://cladapp.sanimabank.com/files/enadoc/" +
                  response.data.data[i].file_path;
                setInvurl(performa);
              } else {
                performa = response.data.data[i].enadoc_url;
                setInvurl(performa);
              }
            }
          }
          if (SelectedHead === "Credit") {
            if (response.data.data[i].name.includes("Commercial")) {
              if (response.data.data[i].enadoc_url === null) {
                commercial =
                  "https://cladapp.sanimabank.com/files/enadoc/" +
                  response.data.data[i].file_path;
                setComurl(commercial);
              } else {
                commercial = response.data.data[i].enadoc_url;
                setComurl(commercial);
              }
            }
          }
        }
        return {
          status: true,
          Appurl: application,
          Invurl: performa,
          Comurl: commercial,
        };
      } else {
        toast.error("Invalid Ticket number");
        setLoading(false);
        return { status: false };
      }
    } catch (error) {
      toast.error("Invalid Ticket number");
      setLoading(false);
    }
  };

  const updateticket = async ({ id, Application, Performa, Ticket_No }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const response = await axios.put(
        process.env.REACT_APP_UAT_API_URL + `api/updateticket/${id}`,
        { id, Application, Performa, Ticket_No },
        { headers }
      );
      if (response.status === 200) {
        let swift = response.data;
        let newswift = JSON.parse(JSON.stringify(mtswift));
        for (let index = 0; index < newswift.length; index++) {
          const element = newswift[index];
          if (element.id === id) {
            newswift[index].Ticket_No = swift.Ticket_No;
            newswift[index].TT_app_url = swift.TT_app_url;
            newswift[index].Performa_url = swift.Performa_url;
            break;
          }
        }
        setMtswift(newswift);
        // toast.success("Updated Successfully");
        return {status: true};
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const uploadfile = async ({
    staff_id,
    branch_id,
    department_id,
    outward_tt_requests_id,
    name,
    conclusion,
    swift_file_name,
    swift_file,
  }) => {
    try {
      const headers = {
        "auth-token": localStorage.getItem("token"),
      };
      const formData = new FormData();
      formData.append("staff_id", staff_id);
      formData.append("branch_id", branch_id);
      formData.append("department_id", department_id);
      formData.append("outward_tt_requests_id", outward_tt_requests_id);
      formData.append("name", name);
      formData.append("conclusion", conclusion);
      formData.append("swift_file_name", swift_file_name);
      formData.append("swift_file", swift_file);

      const response = await axios.post(
        process.env.REACT_APP_UAT_API_URL + `api/uploadfile`,
        formData,
        { headers }
      );
    
      let result = response.data;
      if (response.data.status === true) {
        let newresp = JSON.parse(JSON.stringify(appfiles.resp));
        for (let index = 0; index < newresp.length; index++) {
          const element = newresp[index];
          // console.log(element);
          if (element.outward_request_id === outward_tt_requests_id) {
            //we use index for rendering instanly on client side like if we update the second notes then only the second notes to be updated instantly
            newresp[index].swift_file_name = result.content.swift_file_name;
            newresp[index].swift_file = result.content.swift_file;
            break;
          }
        }
        setappfiles({resp:newresp});
        toast.success("Added Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deletemtswift = async (deleteid) => {
    // console.log(deleteid);
    const response = await fetch(
      process.env.REACT_APP_UAT_API_URL + `api/deletemtswift/${deleteid}`,
      {
        //this id is branch id we want to delete
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      const newmt = mtswift.filter((abc) => {
        return abc.id !== deleteid;
      });
      setMtswift(newmt);
      toast.success("Deleted successfully");
      setShowDelete(false);
    } else {
      toast.error(json.error);
    }
  };

  function convertAmountToWords(amount) {
    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const remaining = amount % 100000;
    const croreString =
      crore > 0 ? numberToWords.toWords(crore) + " Crore" : "";
    const lakhString = lakh > 0 ? numberToWords.toWords(lakh) + " Lakh" : "";
    const remainingString =
      remaining > 0 ? numberToWords.toWords(remaining) : "";

    const decimalPart = Math.round((amount % 1) * 100); // Extract decimal part and round it to 2 decimal places
    const decimalString = numberToWords.toWords(decimalPart);

    let result = "";

    if (croreString !== "") {
      result += croreString;
    }

    if (lakhString !== "") {
      result += (result !== "" ? " " : "") + lakhString;
    }

    if (remainingString !== "") {
      result += (result !== "" ? " " : "") + remainingString;
    }

    if (decimalPart !== 0) {
      result += (result !== "" ? " and " : "") + decimalString;
    }

    return result;
  }


  return (
    <div>
      <MTContext.Provider
        value={{
          Logout,
          Trigger,
          toggle,
          addStaff,
          getStaff,
          allstaff,
          verifyToken,
          deleteStaff,
          setDeleteid,
          setShow,
          show,
          getHeadLogs,
          Headlogs,
          setToggle,
          staff,
          getTradeStaff,
          getChecker,
          checker,
          addeditor,
          setAddeditor,
          addMtswift,
          getMTswift,
          mtswift,
          getMaker,
          maker,
          setReverteditor,
          reverteditor,
          MtTitle,
          setMtTitle,
          getmtswiftlogs,
          MtLogs,
          open,
          setOpen,
          sendmail,
          setMtswift,
          PagesCount,
          fetchMT,
          staffCount,
          fetchStaff,
          setAllstaff,
          searchMT,
          Appurl,
          setAppurl,
          setInvurl,
          Invurl,
          getswiftcode,
          // SwiftCode,
          nostrocode,
          invNostro,
          formData,
          setFormData,
          setComurl,
          Comurl,
          TTamount,
          setTTamount,
          forSwift,
          setForSwift,
          sendTrade,
          swifthtml,
          setSwifthtml,
          Loading,
          setLoading,
          getfile,
          getswiftlogs,
          SwiftLogs,
          TranID,
          setTranID,
          verifyrole,
          Disable,
          setDisable,
          getticketdata,
          updateticket,
          SelectedHead,
          setSelectedHead,
          uploadfile,
          appfiles,
          setappfiles,
          deletemtswift,
          setShowDelete,
          showDelete,
          convertAmountToWords
        }}
      >
        {props.children}
      </MTContext.Provider>
    </div>
  );
};

export default MTState;
