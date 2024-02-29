const express = require("express");
var db = require("../models");
var Tradestaff = db.tradestaff;
var Logshead = db.logshead;
var MTSwift = db.mtswift;
var MTLogs = db.mtlogs;
var NostroCode = db.nostroswift;
var SwiftCodes = db.swiftcode;
var SwiftLogs = db.swiftlogs;
var Fileupload = db.fileupload;

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../models");

const { Op } = require("sequelize");
const axios = require("axios");
const { body, validationResult } = require("express-validator");

const addstaffvalidation = [
  body("StaffId", "Enter a valid StaffId").isLength({ min: 1 }),
  body("Name", "Enter a valid name").isLength({ min: 2 }),
  body("UserName", "Enter a valid Username").isLength({ min: 3 }),
  body("DepartmentName", "Enter a valid Department").isLength({ min: 3 }),
  body("Role", "Enter a valid role").isLength({ min: 5 }),
];

const addlogsheadValidation = [
  body("StaffId", "Enter a valid StaffId").isLength({ min: 1 }),
  body("Name", "Enter a valid Name").isLength({ min: 2 }),
  body("Role", "Enter a valid Role").isLength({ min: 5 }),
  body("Action", "Enter a valid Action").isLength({ min: 5 }),
];

const addmtlogsValidation = [
  body("id", "Enter a valid id").isLength({ min: 1 }),
  body("Status", "Enter a valid Status").isLength({ min: 1 }),
];

const addswiftlogsValidation = [
  body("id", "Enter a valid id").isLength({ min: 1 }),
  body("Message", "Enter a valid Message").isLength({ min: 1 }),
];

const swiftrevertValidation = [
  body("outward_tt_request_id", "Enter a valid outward request id").isLength({
    min: 1,
  }),
  body("swift_request_id", "Enter a valid swift request id").isLength({
    min: 1,
  }),
  body("Message", "Enter a valid message").isLength({ min: 0 }),
  body("Comment", "Enter a valid comment").isLength({ min: 0 }),
  body("staff_id", "Enter a valid staffid").isLength({ min: 1 }),
  body("username", "Enter valid username").isLength({ min: 2 }),
  body("branch_id", "Enter a valid branch").isLength({ min: 1 }),
  // body("branch_name", "Enter a valid branch name").isLength({ min: 2 }),
  body("department_id", "Enter a valid department id").isLength({ min: 1 }),
  body("department_name", "Enter a valid department name").isLength({ min: 2 }),
];

var addstaff = [
  addstaffvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { StaffId, Name, UserName, DepartmentName, Role } = req.body;
      const [staff, created] = await Tradestaff.findOrCreate({
        where: { StaffId },
        defaults: {
          Name,
          UserName,
          Department_Name: DepartmentName,
          Role,
          Created_By: req.user.Username,
        },
      });
      if (!created) {
        //if not created or for updated
        staff.Name = Name;
        staff.UserName = UserName;
        staff.Department_Name = DepartmentName;
        staff.Role = Role;
        staff.Updated_By = req.user.Username;
        await staff.save();
        res.status(200).json({ data: staff, message: "Updated" });
      } else {
        res.status(200).json(staff); //if created
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
];

var addlogshead = [
  addlogsheadValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { StaffId, Name, Role, Action } = req.body;
      let info = {
        StaffId: StaffId,
        Name: Name,
        Role: Role,
        Action: Action,
      };
      const content = await Logshead.create(info);
      res.status(200).send(content);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
];

var getlogshead = async (req, res) => {
  try {
    const content = await Logshead.findAll({});
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//get Assigned Checker only
var getChecker = async (req, res) => {
  try {
    const content = await Tradestaff.findAll({
      where: {
        Role: "Checker",
      },
    });
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//get Assigned Makers only
var getMaker = async (req, res) => {
  try {
    const content = await Tradestaff.findAll({
      where: {
        Role: "Maker",
      },
    });
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

var getstaff = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 30; // Number of items per page

  try {
    const totalCount = await Tradestaff.count({});

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const content = await Tradestaff.findAll({
      order: [["id", "DESC"]],
      limit, // Number of items to retrieve per page
      offset,
    });

    res.json({ content, totalPages });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

var deletestaff = async (req, res) => {
  var data = await Tradestaff.destroy({
    where: {
      id: req.params.id,
    },
    force: true, //for hard delete
  });
  res.status(200).json({ data: data });
};

//mtswift
var addmtswift = async (req, res) => {
  try {
    const {
      id,
      Title,
      Assigned_to,
      Remarks,
      Swift_Msg,
      Status,
      Comments,
      TT_app_url,
      Performa_url,
      Ttref,
      Amount,
      Approved_Swift_Msg,
      Swift_Msg_To_Html,
      is_forwarded_to_swift,
      Swift_remark,
      is_reverted,
      swift_request_id,
      Ticket,
      Tran_ID,
      Refstatus,
    } = req.body;
    if (!id) {
      // Check if id is null or undefined
      const newRecord = await MTSwift.create({
        Title,
        Request_By: req.user.Username,
        Request_By_Id: req.user.StaffId,
        Assigned_to,
        Remarks,
        Comments,
        Swift_Msg,
        Status: Status,
        TT_app_url,
        Performa_url,
        Ttref,
        Amount,
        Swift_Msg_To_Html,
        is_forwarded_to_swift,
        Swift_remark,
        is_reverted,
        swift_request_id,
        Ticket_No: Ticket,
        Tran_ID,
        Refstatus,
      });
      res.status(200).json({ swift: newRecord }); //creates new record
    } else {
      let swift = await MTSwift.findOne({ where: { id } });
      // console.log(swift);
      if (swift) {
        // Record already exists, update it
        if (Status === 3) {
          //for approved only we dont include Request_By,Assigned_to because we want Request_By to have previous value
          swift.Status = Status;
          swift.Approved_Swift_Msg = Approved_Swift_Msg;
          await swift.save();
          res.status(200).json({ swift: swift, message: "Updated" });
        } else if (Status === 4) {
          swift.Status = Status;
          swift.is_forwarded_to_swift = is_forwarded_to_swift;
          swift.Swift_remark = Swift_remark;
          await swift.save();
          res.status(200).json({ swift: swift, message: "Updated" });
        } else {
          swift.Request_By = req.user.Username;
          swift.Request_By_Id = req.user.StaffId;
          swift.Assigned_to = Assigned_to;
          swift.Comments = Comments || swift.Comments;
          swift.Remarks = Remarks || swift.Remarks;
          swift.Swift_Msg = Swift_Msg;
          swift.Status = Status;
          await swift.save();
          res.status(200).json({ swift: swift, message: "Updated" });
        }
      } else {
        // if the record was not created and not updated, return 404 Not Found
        res.status(404).json({ message: "Record not found" });
      }
      // console.log(swift);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

var deletemtswift = async (req, res) => {
  var data = await MTSwift.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ data: data });
};

const getmtswift = async (req, res) => {

  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page

  try {
    const totalCount = await MTSwift.count({ });

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    const offset = (page - 1) * limit; // Calculate offset for pagination//supppose if we are in page 3 then the offset will be 20 you should start displaying items starting from the 21st item in the original list.

    const content = await MTSwift.findAll({
      order: [["id", "DESC"]],
      limit, // Number of items to retrieve per page
      offset, // Offset for pagination
    });

    res.json({
      currentPage: page,
      totalPages,
      totalCount,
      content,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//add mtlogs
var addmtlogs = [
  addmtlogsValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id, Assigned_to, Message, Status } = req.body;
      let info = {
        outward_request_id: id,
        Request_By: req.user.Username,
        Assigned_to: Assigned_to,
        Status: Status,
        Message: Message,
      };
      const content = await MTLogs.create(info);
      res.status(200).send(content);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
];

var addswiftlogs = [
  addswiftlogsValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id, Message, Comment } = req.body;
      let info = {
        outward_request_id: id,
        Message: Message,
        Comment: Comment,
        staff_id: req.user.StaffId,
        username: req.user.Username,
        branch_id: req.user.Branch,
        branch_name: req.user.BranchName,
        department_id: req.user.DeptId,
        department_name: req.user.DeptName,
      };
      const content = await SwiftLogs.create(info);
      res.status(200).send(content);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
];

const getmtswiftlogs = async (req, res) => {
  try {
    const data = await MTLogs.findAll({
      include: [
        {
          model: MTSwift,
          as: "SwiftMsg",
        },
      ],
      where: { outward_request_id: req.params.id },
    });
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

var getmtdatacb = async (req, res) => {
  try {
    const formData = {
      grant_type: process.env.REACT_APP_GRANT_TYPE,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      client_id: process.env.REACT_APP_CLIENT_ID,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const tokenresponse = await axios.post(
      process.env.REACT_APP_LOCAL_0AUTH_URL,
      formData,
      config
    );

    const accessToken = tokenresponse.data.access_token;

    const response = await axios.request({
      method: "GET",
      url:
        process.env.REACT_APP_LOCAL_WEB_API_URL +
        `api/v1/general/findDataByQuery/findDataMT103`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: { paramOne: req.params.rid },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

var getmmibcbs = async (req, res) => {
  try {
    const formData = {
      grant_type: process.env.REACT_APP_GRANT_TYPE,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      client_id: process.env.REACT_APP_CLIENT_ID,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const tokenresponse = await axios.post(
      process.env.REACT_APP_LOCAL_0AUTH_URL,
      formData,
      config
    );

    const accessToken = tokenresponse.data.access_token;

    const response = await axios.request({
      method: "GET",
      url:
        process.env.REACT_APP_LOCAL_WEB_API_URL +
        `api/v1/general/findDataByQuery/findMmib103MT`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: { paramOne: req.params.rid },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const gettradedata = async (req, res) => {
  try {
    const ticketnumber = req.params.tickid;
    const trade = await axios.post(
      "https://cladapp.sanimabank.com/api/get-document-list-by-ticket-number/" +
        ticketnumber
    );
    res.status(200).json(trade.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getcodeswift = async (req, res) => {
  const search = req.query.swift;

  let options = {};

  if (search) {
    options.where = {
      BIC: {
        [Op.like]: `%${search}%`,
      },
    };
  }

  try {
    const content = await SwiftCodes.findAll(options);
    res.json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const searchMT = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page
  const { reference, startdate, enddate, status, staff } = req.body;
  try {
    // Apply initial filtering based on Assigned_to and Request_By fields
    let content = await MTSwift.findAll({
      // where: {
      //   [Op.or]: [
      //     // { Assigned_to: req.user.Username },
      //     { Request_By: req.user.Username },
      //   ],
      // },
      order: [["id", "DESC"]],
    });

    // Apply additional filters using the OR operator
    if (reference || status || staff || (startdate && enddate)) {
      const options = {
        where: {
          [Op.or]: [],
        },
      };

      if (reference) {
        options.where[Op.or].push({ Ttref: { [Op.like]: `%${reference}%` } });
      }

      if (status) {
        options.where[Op.or].push({ Status: { [Op.like]: `%${status}%` } });
      }

      if (staff) {
        options.where[Op.or].push({ Request_By: { [Op.like]: `%${staff}%` } });
        // options.where[Op.or].push({ Assigned_to: { [Op.like]: `%${staff}%` } });
      }

      if (startdate && enddate) {
        // Convert startdate and enddate to JavaScript Date objects
        const startDateObj = new Date(startdate);
        const endDateObj = new Date(enddate);
        // console.log(startDateObj)
        options.where[Op.or].push({
          updatedAt: { [Op.between]: [startDateObj, endDateObj] },
        });
      }
      // Apply additional filters to the existing "content" data
      totalCount = await MTSwift.count({  where: options.where});

      const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
      const offset = (page - 1) * limit;

      content = await MTSwift.findAll({
        where: options.where,
        order: [["id", "DESC"]],
        limit,
        offset,
      });
      res.status(200).json({ totalPages, content });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getmibamount = async (req, res) => {
  try {
    const formData = {
      grant_type: process.env.REACT_APP_GRANT_TYPE,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      client_id: process.env.REACT_APP_CLIENT_ID,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const tokenresponse = await axios.post(
      process.env.REACT_APP_LOCAL_0AUTH_URL,
      formData,
      config
    );

    const accessToken = tokenresponse.data.access_token;

    const response = await axios.request({
      method: "GET",
      url:
        process.env.REACT_APP_LOCAL_WEB_API_URL +
        `api/v1/general/findDataByQuery/findMmibTransaction103MT`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: { paramOne: req.params.rid },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const getnostrocode = async (req, res) => {
  try {
    const reaid = req.params.rid;
    const content = await NostroCode.findAll({
      where: {
        ACCOUNT_NO: reaid,
      },
    });
    if (content.length > 0) {
      res.status(200).json(content);
    } else {
      res.status(400).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const revertswift = [
  //only used by santosh dai
  swiftrevertValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        outward_tt_request_id,
        swift_request_id,
        remarks,
        Comment,
        staff_id,
        username,
        branch_id,
        branch_name,
        department_id,
        department_name,
        Message,
      } = req.body;
      const record = await MTSwift.findOne({
        where: { id: outward_tt_request_id },
      });
      if (record) {
        record.is_reverted = 1;
        record.Status = 5;
        record.swift_request_id = swift_request_id;

        await record.save();
        let info = {
          outward_request_id: outward_tt_request_id,
          Message: "5",
          Comment: remarks,
          staff_id: staff_id,
          username: username,
          branch_id: branch_id,
          branch_name: branch_name,
          department_id: department_id,
          department_name: department_name,
        };
        const content = await SwiftLogs.create(info);
        return res.status(200).json({
          status: true,
          message: "MTSwift record updated successfully.",
          content: content,
        });
      } else {
        console.log("Record not found");
        return res.status(200).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
];

const filestorage = multer.diskStorage({
  destination: (req, file, db) => {
    db(null, "Files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //path.extname(file.originalname) gives the extension of file like jpg
  },
});

const upload = [
  multer({
    storage: filestorage,
    limits: { fileSize: "5000000" }, //5000000 = 5mb
    fileFilter: (req, file, cb) => {
      //cb means call back function
      const fileTypes = /jpeg|jpg|png|PNG|gif|jfif|pdf|doc|docx/;
      const mimeTypes = fileTypes.test(file.mimetype); //for testing the image with jpeg,jpg etc
      const extname = fileTypes.test(path.extname(file.originalname)); //gets the filetypes of the images uploded from user,gives the original name of the image file

      if (mimeTypes && extname) {
        return cb(null, true);
      }
      cb("Give proper files format to upload");
    },
  }).single("swift_file"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    next();
  },
];

const addfile = async (req, res) => {
  try {
    const record = await MTSwift.findOne({
      where: { id: req.body.outward_tt_requests_id },
    });
    if (record) {
      let message = "6";
      record.Status = 6;
      await record.save();
      const [content, created] = await Fileupload.findOrCreate({
        where: { outward_request_id: req.body.outward_tt_requests_id },
        defaults: {
          swift_file: req.file.path,
          staff_id: req.body.staff_id,
          branch_id: req.body.branch_id,
          department_id: req.body.department_id,
          name: req.body.name,
          conclusion: req.body.conclusion,
          swift_file_name: req.body.swift_file_name,
        },
      });
      if(!created){
        content.swift_file = req.file.path;
        content.staff_id = req.body.staff_id;
        content.branch_id = req.body.branch_id;
        content.department_i = req.body.department_id;
        content.name = req.body.name;
        content.conclusion = req.body.conclusion;
        content.swift_file_name = req.body.swift_file_name;
        message = "7"
        await content.save();
      }
      let data = {
        outward_request_id: req.body.outward_tt_requests_id,
        Message: message,
        staff_id: req.body.staff_id,
        username: req.body.name,
        branch_id: req.body.branch_id,
        department_id: req.body.department_id,
      };
      const datas = await SwiftLogs.create(data);
      // const content = await Fileupload.create(info);
      res.status(200).send({ success:true,content, datas });
    } else {
      // console.log("Record not found");
      return res.status(200).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const sendTrade = async (req, res) => {
  try {
    const {
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
    } = req.body;
    // console.log(application_for_fund_transfer_image);
    const resp = await axios.get(application_for_fund_transfer_image, {
      responseType: "arraybuffer",
    });
    console.log(resp.data)
    const buffer = Buffer.from(resp.data);
    const formData = new FormData();
    formData.append("remarks", remarks);
    formData.append("file_text", file_text);
    formData.append("file_pdf", file_pdf);
    formData.append("conclusion", conclusion);
    formData.append("forwarded_by", forwarded_by);
    formData.append("forwarded_department", forwarded_department);
    formData.append("forwarded_at", forwarded_at);
    formData.append("forwarded_domain_name", forwarded_domain_name);
    formData.append("outward_tt_requests_id", outward_tt_requests_id);
    formData.append("forward_to_swift_status", forward_to_swift_status);
    formData.append("swift_request_id", swift_request_id);
    formData.append("message_type", "103");
    formData.append("currency_code", currency_code);
    formData.append("cbs_reference_no", cbs_reference_no);
    formData.append("cbs_fcy_amount", cbs_fcy_amount);
    formData.append("application_for_fund_transfer_image", cbs_fcy_amount);
    formData.append(
      "application_for_fund_transfer_image",
      new Blob([resp.data]),
      // buffer,
      "Application.pdf"
    );
    // console.log(`${cbs_reference_no}_${outward_tt_requests_id}_Application.pdf`);
    // formData.append("application_for_fund_transfer_image", application_for_fund_transfer_image);
    formData.append(
      "application_for_fund_transfer_image_name",
      "Application.pdf"
    );
    const response = await axios.post(
      process.env.REACT_APP_SWIFT_API+"api/payment-department-data",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response.data);
    if (response.data.status === true) {
      res.status(200).json(response.data);
    } else {
      res.status(400).json(response.data);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

const getfile = async (req, res) => {
  try {
    const content = await Fileupload.findAll({
      where: {
        outward_request_id: req.params.id,
      },
    });
    res.status(200).json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getswiftlogs = async (req, res) => {
  try {
    const data = await SwiftLogs.findAll({
      include: [
        {
          model: MTSwift,
          as: "SwiftMsg",
        },
      ],
      where: { outward_request_id: req.params.id },
    });
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getallmtswift = async (req, res) => {
  try {
    const data = await MTSwift.findAll({
      where: { Ttref: req.params.id },
    });
    if (data && data.length > 0) {
      res.status(200).json({ message: "Found" });
    } else {
      res.status(200).json({ message: "NotFound" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const checktranid = async (req, res) => {
  try {
    const data = await MTSwift.findAll({
      where: { Ttref: req.query.ref, Tran_ID: req.query.tran },
    });
    if (data && data.length > 0) {
      res.status(200).json({ message: "Found" });
    } else {
      res.status(200).json({ message: "NotFound" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const verifyrole = async (req, res) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateticket = async (req, res) => {
  const { Application, Performa, Ticket_No,Status } = req.body;
  try {
    const data = await MTSwift.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.TT_app_url = Application;
      data.Performa_url = Performa;
      data.Ticket_No = Ticket_No;
      data.Status = Status;
      data.updatedAt = new Date();
      await data.save();
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const sendmail  = async(req,res)=>{
  const {text,to,subject,cc} = req.body;
  try {
    const mail = await axios.post(
      process.env.REACT_APP_SEND_MAIL,
      {body:text,to,subject,cc},
    );
    res.status(200).json({data:mail.data,message:"Email sent"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  addstaff,
  getstaff,
  deletestaff,
  addlogshead,
  getlogshead,
  getChecker,
  addmtswift,
  getmtswift,
  getMaker,
  addmtlogs,
  getmtswiftlogs,
  getmtdatacb,
  gettradedata,
  getnostrocode,
  getcodeswift,
  getmmibcbs,
  getmibamount,
  searchMT,
  addswiftlogs,
  revertswift,
  upload,
  addfile,
  sendTrade,
  getfile,
  getswiftlogs,
  getallmtswift,
  verifyrole,
  checktranid,
  updateticket,
  deletemtswift,
  sendmail
};
