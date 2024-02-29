import React, { useContext, useState, useRef, useEffect } from "react";
import MTContext from "../../context/MTContext";
import { toast } from "react-toastify";
import SwiftMsg from "./SwiftMsg";
import SideNav from "../SideNav";
import axios from "axios";
import Spinner from "../Spinner";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SimpleReactValidator from "simple-react-validator";

const MakerDashboard = () => {
  const context = useContext(MTContext);
  const {
    open,
    // setAppurl,
    // setInvurl,
    getswiftcode,
    nostrocode,
    Appurl,
    Invurl,
    invNostro,
    formData,
    setFormData,
    // setComurl,
    Comurl,
    setLoading,
    Loading,
    setTranID,
    verifyrole,
    setDisable,
    getticketdata,
    setSelectedHead,
    SelectedHead,
  } = context;

  useEffect(() => {
    verifyrole("verifymaker");
  }, []);

  const current = new Date();
  const [swiftMsgGen, setSwiftMsgGen] = useState();
  const colourOptions = [
    { value: "OUR", label: "OUR" },
    { value: "BEN", label: "BEN" },
    { value: "SHA", label: "SHA" },
  ];
  const headOptions = [
    { label: "Advance", value: "Advance" },
    { label: "Credit", value: "Credit" },
  ];
  const [SelectedOpt, setSelectedOpt] = useState([]);

  const [IFSC, setIFSC] = useState("");
  const [IBSwiftcode, setIBSwiftcode] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [IB, setIB] = useState("No");
  let success = false;
  const [eventAmtArray, setEventAmtArray] = useState([]);
  const [TranId, setTranId] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const simpleValidator = useRef(new SimpleReactValidator());


  const [Mtdata, setMtdata] = useState({
    REMITTANCE_ID: "",
    NOSTRO_BANK: "",
    TRANSACTION_DATE: "",
    CURRENCY: "",
    TT_AMOUNT: "",
    APPLICANT_ACCOUNT: "",
    APPLICANT_DETAILS: "",
    BENEFICIARY_ACCOUNT: "",
    B_B_D: "",
    Instrument_Detail: "",
    BENEFICIARY_DETAILS: "",
    PI_DATE: "",
    PI_NO: "",
    COMMODITY_DESCRIPTION: "",
    LICENCE_DATE: "",
    LICENCE_DETAILS: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.toUpperCase() });
  };

  const handleSwiftChange = (value) => {
    setSelectedValue(value);
  };

  const gethormdata = async () => {//advance
    const res = await axios.get(
      process.env.REACT_APP_UAT_API_URL + "api/getmtdatacbs/" + formData.ttnum,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    if (res.data.length === 0) {
      toast.error("Invalid TT number");
    } else {
      let nostro = await nostrocode(res.data[0].REALIZATION_ACCT_ID);
      const currentdate = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
      setMtdata({
        REMITTANCE_ID: res.data[0].REMITTANCE_ID,
        NOSTRO_BANK: nostro.split(",")[0],
        NOSTRO_BANK2: nostro.split(",").slice(1).join(","),
        TRANSACTION_DATE: currentdate,
        CURRENCY: res.data[0].CURRENCY,
        TT_AMOUNT: res.data[0].TT_AMOUNT,
        APPLICANT_ACCOUNT: res.data[0].APPLICANT_ACCOUNT,
        APPLICANT_DETAILS: res.data[0].APPLICANT_DETAILS.split(",")[0],
        APPLICANT_DETAILS2: res.data[0].APPLICANT_DETAILS.split(",")
          .slice(1)
          .join(","),
        BENEFICIARY_ACCOUNT: res.data[0].BENEFICIARY_ACCOUNT,
        main_B_B_D: res.data[0].BENEFICIARY_BANK_DETAILS,
        B_B_D: res.data[0].BENEFICIARY_BANK_DETAILS.split(",")[0],
        B_B_D2: res.data[0].BENEFICIARY_BANK_DETAILS.split(",")
          .slice(1)
          .join(","),
        Instrument_Detail: res.data[0].BENEFICIARY_ACCT_ID,
        BENEFICIARY_DETAILS: res.data[0].BENEFICIARY_DETAILS,
        PI_DATE: res.data[0].PI_DATE,
        PI_NO: res.data[0].PI_NO,
        COMMODITY_DESCRIPTION: res.data[0].COMMODITY_DESCRIPTION,
        LICENCE_DATE: res.data[0].LICENCE_DATE,
        LICENCE_DETAILS: res.data[0].LICENCE_DETAILS,
        PAN_NUM: res.data[0].PAN_NUM,
        PAN_NO: res.data[0].PAN_NUM,
      });
      // setTTamount(res.data[0].CURRENCY+res.data[0].TT_AMOUNT);
      //console.log(res.data[0].CURRENCY+res.data[0].TT_AMOUNT);
      success = true;
    }
  };

  const getmmibdata = async () => {//credit
    const res = await axios.get(
      process.env.REACT_APP_UAT_API_URL + "api/getmmibcbs/" + formData.ttnum,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const resmmib = await axios.get(
      process.env.REACT_APP_UAT_API_URL + "api/getmibamount/" + formData.ttnum,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    setEventAmtArray([]);
    resmmib.data.forEach((item) => {
      setEventAmtArray((prevArray) => [
        ...prevArray,
        { label: item.EVENT_AMT, value: item.TRAN_ID.trim() },
      ]);
      // setNostroForacidArray((prevArray) => [...prevArray, {label:item.NOSTROFORACID, value: item.NOSTROFORACID}]);
      setTranId((prevArray) => [
        ...prevArray,
        {
          tranid: item.TRAN_ID,
          eventamnt: item.EVENT_AMT,
          date: item.VFD_BOD_DATE,
          nostroid: item.NOSTROFORACID,
        },
      ]);
    });
    // console.log(resmmib);
    if (res.data.length === 0) {
      toast.error("Invalid ICP number");
    } else {
      let nostro = await nostrocode(resmmib.data[0].NOSTROFORACID);
      const currentdate = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
      setMtdata({
        REMITTANCE_ID: res.data[0].BILL_ID,
        NOSTRO_BANK: nostro.split(",")[0],
        NOSTRO_BANK2: nostro.split(",").slice(1).join(","),
        TRANSACTION_DATE: currentdate,
        CURRENCY: res.data[0].BILL_CRNCY_CODE,
        TT_AMOUNT: resmmib.data[0].EVENT_AMT,
        APPLICANT_ACCOUNT: res.data[0].OPERATIVEACCOUNT,
        APPLICANT_DETAILS: res.data[0].NAME ? res.data[0].NAME : "",
        APPLICANT_DETAILS2:
          (res.data[0].ADDRESSLINE1 ? res.data[0].ADDRESSLINE1 : "") +
          "," +
          (res.data[0].ADDRESSLINE2 ? res.data[0].ADDRESSLINE2 : "") +
          "," +
          (res.data[0].ADDRESSLINE3 ? res.data[0].ADDRESSLINE3 : "") +
          "," +
          (res.data[0].COUNTRY ? res.data[0].COUNTRY : ""),
        B_B_D: res.data[0].DRAWERBANKNAME ? res.data[0].DRAWERBANKNAME : "",
        B_B_D2:
          (res.data[0].DRAWERBANKADDRESS1
            ? res.data[0].DRAWERBANKADDRESS1
            : "") +
          "," +
          (res.data[0].DRAWERBANKADDRESS2
            ? res.data[0].DRAWERBANKADDRESS2
            : "") +
          "," +
          (res.data[0].DRAWERBANKADDRESS3
            ? res.data[0].DRAWERBANKADDRESS3
            : "") +
          ", " +
          (res.data[0].DRAWERBANKCOUNTRY ? res.data[0].DRAWERBANKCOUNTRY : ""),
        Instrument_Detail: res.data[0].DRAWERBANKPARTY_IDENTIFIER,
        BENEFICIARY_ACCOUNT: res.data[0].DRAWERNAME,
        BENEFICIARY_DETAILS:
          (res.data[0].DRAWERADDRESSLINE1
            ? res.data[0].DRAWERADDRESSLINE1
            : "") +
          "," +
          (res.data[0].DRAWERADDRESSLINE2
            ? res.data[0].DRAWERADDRESSLINE2
            : "") +
          "," +
          (res.data[0].DRAWERADDRESSLINE3
            ? res.data[0].DRAWERADDRESSLINE3
            : "") +
          ", " +
          (res.data[0].DRAWERCOUNTRY ? res.data[0].DRAWERCOUNTRY : ""),
        COMMODITY_DESCRIPTION: res.data[0].COMMODITYDESCRIPTION,
        LICENCE_DATE: res.data[0].LICENCE_DATE,
        LICENCE_DETAILS: res.data[0].LICENCE_DETAIL,
        PAN_NUM: res.data[0].PAN_NUMBER,
        PAN_NO: res.data[0].PAN_NUMBER,
      });
      success = true;
    }
  };

  const checkrefnum = async (refcode) => {
    const response = await axios.get(
      process.env.REACT_APP_UAT_API_URL + `api/getallmtswift/${refcode}`,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    // console.log(response.data);
    return response.data;
  };

  const generateMt = async () => {
    try {
      setSelectedOption([]);
      setLoading(true);
      if (formData.ticket === "") {
        toast.error("Ticket number cannot be empty");
      } else {
        // console.log(SelectedHead.value);
        if (SelectedHead.value === "Advance") {
          let res = await checkrefnum(formData.ttnum);
          // console.log(res.message)
          if (res.message === "Found") {
            toast.error(`TT number with ${formData.ttnum} already created`);
          } else {
            await gethormdata();
          }
        }
        if (SelectedHead.value === "Credit") {
          await getmmibdata();
        }
        const getticket = await getticketdata(
          formData.ticket,
          SelectedHead.value
        );
        // console.log(getticket)
        if (getticket.status === true) {
          if (success === true) {
            setSwiftMsgGen(true);
          }
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const checktran = async (tran) => {
    const response = await axios.get(
      process.env.REACT_APP_UAT_API_URL +
        `api/checktranid?ref=${formData.icpnum}&tran=${tran}`,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    // console.log(response.data);
    return response.data;
  };

  const handleTranChange = async (selectedOption) => {
    TranId.map(async (i) => {
      if (i.tranid.trim() === selectedOption.value) {
        const ctran = await checktran(selectedOption.value.trim());
        if (ctran.message === "Found") {
          toast.error(
            `ICP number with ${formData.icpnum} and amount ${i.eventamnt} already created`
          );
          setDisable(true);
        } else {
          setDisable(false);
        }
        const nostro = await nostrocode(i.nostroid);
        setTranID(i.tranid);
        setMtdata((prevCat) => ({
          ...prevCat,
          TT_AMOUNT: i.eventamnt,
          // TRANSACTION_DATE: i.date,
          NOSTRO_BANK: nostro.split(",")[0],
          NOSTRO_BANK2: nostro.split(",").slice(1).join(",")
        }));
        setSelectedOption(selectedOption);
      }
    });
  };

  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="row">
          {open && <div className="col-4 col-md-2"></div>}

          <div className="col-4 col-md">
            <SideNav role="Maker"/>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-8 ml-auto me-auto">
                      <div className="card w-100 text-center">
                        <div className="card-header">
                          <strong className="text-center">
                            Generate MT103
                          </strong>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-4">
                              <div className="form-group">
                                <Select
                                  name="head"
                                  options={headOptions}
                                  value={SelectedHead}
                                  placeholder="Select Credit/Advance"
                                  onChange={(SelectedHead) =>
                                    setSelectedHead(SelectedHead)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <div className="form-group">
                                <input
                                  name="ticket"
                                  className="form-control"
                                  placeholder="Enter Ticket number"
                                  onChange={handleChange}
                                  value={formData.ticket}
                                />
                              </div>
                            </div>

                            <div className="col-sm-4">
                              <div className="form-group">
                                <input
                                  name="ttnum"
                                  className="form-control"
                                  placeholder="Enter TT/ICP number"
                                  onChange={handleChange}
                                  value={formData.ttnum}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div>
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={
                                  formData.ticket.length < 2 ||
                                  (formData.ttnum.length < 4 &&
                                    formData.icpnum.length < 4)
                                }
                                onClick={generateMt}
                              >
                                Generate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {swiftMsgGen && (
                        <div className="card mt-2">
                          <div className="card-body">
                            <div className="row">
                              {SelectedHead.value === "Credit" && (
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    <Select
                                      name="icpamount"
                                      options={eventAmtArray}
                                      onChange={(selectedOption) =>
                                        handleTranChange(selectedOption)
                                      }
                                      value={selectedOption}
                                      placeholder="Select Realize Amount"
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="col-sm-6">
                                <div className="form-group d-flex align-items-center">
                                  <p className="mt-1">
                                    Is there any Intermediatory Bank?
                                  </p>
                                  <label htmlFor="medium" className="ml-2">
                                    <input
                                      type="radio"
                                      name="Yes"
                                      value="Yes"
                                      id="Yes"
                                      checked={IB === "Yes"}
                                      onChange={(e) => {
                                        setIB(e.target.value);
                                      }}
                                    />
                                    Yes
                                  </label>
                                  <label htmlFor="no" className="ml-2">
                                    <input
                                      type="radio"
                                      name="No"
                                      value="No"
                                      id="No"
                                      checked={IB === "No"}
                                      onChange={(e) => {
                                        setIB(e.target.value);
                                      }}
                                    />
                                    No
                                  </label>
                                </div>
                                {/* {eventAmtArray[0]} */}
                              </div>
                              {IB === "Yes" && (
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    <AsyncSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={getswiftcode}
                                      onChange={(event) =>
                                        setIBSwiftcode(event)
                                      }
                                      placeholder="Select Swift Code"
                                    />
                                  </div>
                                </div>
                              )}
                              {Mtdata.CURRENCY === "INR" && (
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    <input
                                      name="IFSC"
                                      className="form-control"
                                      placeholder="Enter IFSC CODE"
                                      maxLength={11}
                                      value={IFSC}
                                      onChange={(e) => {
                                        setIFSC(e.target.value.toUpperCase());
                                      }}
                                      onFocus={(event) =>
                                        simpleValidator.current.showMessageFor(
                                          event.target.name
                                        )
                                      }
                                    />
                                    <i className="text-danger">
                                      {simpleValidator.current.message(
                                        "IFSC",
                                        IFSC,
                                        "min:11"
                                      )}
                                    </i>
                                  </div>
                                </div>
                              )}

                              {Mtdata.CURRENCY !== "INR" && (
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    <AsyncSelect
                                      cacheOptions
                                      defaultOptions
                                      loadOptions={getswiftcode}
                                      onChange={handleSwiftChange}
                                      placeholder="Select Swift Code"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <Select
                                    name="colors"
                                    options={colourOptions}
                                    value={SelectedOpt}
                                    placeholder="Select OUR/BEN/SHA"
                                    onChange={(SelectedOpt) =>
                                      setSelectedOpt(SelectedOpt)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {Loading && <Spinner />}

                    {swiftMsgGen && (
                      <>
                        <div className="col-sm-8 ml-auto me-auto mt-3 mb-5">
                          <SwiftMsg
                            Mtdata={Mtdata}
                            optvalue={SelectedOpt}
                            realizevalue={selectedOption}
                            IFSC={IFSC}
                            swiftcode={selectedValue}
                            Appurl={Appurl}
                            Invurl={Invurl}
                            IBS={IBSwiftcode}
                            IB={IB}
                            invNostro={invNostro}
                            Comurl={Comurl}
                            setMtdata={setMtdata}
                            // SelectedHead={SelectedHead}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakerDashboard;
