import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import MTContext from "../../context/MTContext";

const SwiftMsg = ({
  Mtdata,
  optvalue,
  IFSC,
  swiftcode,
  Appurl,
  Invurl,
  IBS,
  IB,
  invNostro,
  Comurl,
  realizevalue,
  setMtdata,
}) => {
  const navigate = useNavigate();
  const context = useContext(MTContext);
  const { setTTamount, Disable, SelectedHead, convertAmountToWords } = context;

  const dateextract = (date) => {
    const dateString = date;
    const dateObj = new Date(dateString);

    const year = dateObj.getFullYear().toString().substr(-2);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getUTCDate().toString().padStart(2, "0");

    const formattedDate = year + month + day;
    return formattedDate;
  };

  function formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Months are zero-based
      const year = date.getUTCFullYear();

      return `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`; //padStart and these are same thing
    } else {
      return null;
    }
  }

  const handleCopy = (containerId) => {
    setTTamount(Mtdata.CURRENCY + Mtdata.TT_AMOUNT);
    const container = document.getElementById(containerId);
    // const containerhtml = document.getElementById(SwiftHtml);
    const html = container.innerHTML;
    // const swifthtml = containerhtml.innerHTML;
    const text = html.replace(/<p.*?>/gi, "").replace(/<\/p>/gi, "\n");
    // const swifttext = swifthtml.replace(/<p.*?>/gi, "").replace(/<\/p>/gi, "\n");
    navigate("/ckeditor", { state: { text } });
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-center align-items-center mr-5">
            <strong>TT application</strong>
            <a target="_blank" href={`${Appurl}`}>
              <i className="bi bi-file-earmark-pdf-fill fs-3"></i>
            </a>
            {SelectedHead.value === "Advance" ? (
              <>
                <strong className="ml-3">Performa Invoice</strong>
                <a target="blank" href={`${Invurl}`}>
                  <i className="bi bi-file-earmark-pdf-fill fs-3"></i>
                </a>
              </>
            ) : (
              <>
                <strong className="ml-3">Commercial Invoice</strong>
                <a target="blank" href={`${Comurl}`}>
                  <i className="bi bi-file-earmark-pdf-fill fs-3"></i>
                </a>
              </>
            )}

            <i className="ml-3 text-danger">{invNostro}</i>
          </div>
        </div>
        <div className="card-body p-3 col-sm-12" id="MTSwift">
          <div id="SwiftHtml">
            <div id="word_file">
              <div className="pos">
                <span id="_16.4">
                  <strong>SENDER INSTITUTION</strong>
                  <span> :</span>
                  <span id="sender">SNMANPKAXXX</span>
                </span>
              </div>
              <div className="pos">
                <span id="sender2">SANIMA BANK LIMITED KATHMANDU NEPAL</span>
              </div>
              <div className="pos">
                <span>
                  <strong>RECEIVER INSTITUTION</strong>
                  <span> :</span>
                  <span></span>
                  <span id="receiver">
                    {SelectedHead.value === "Credit" && realizevalue.value && (
                      <>
                        {Mtdata.NOSTRO_BANK ? (
                          Mtdata.NOSTRO_BANK
                        ) : (
                          <span className="text-danger">null</span>
                        )}
                      </>
                    )}
                    {SelectedHead.value === "Advance" && (
                      <>
                        {Mtdata.NOSTRO_BANK ? (
                          Mtdata.NOSTRO_BANK
                        ) : (
                          <span className="text-danger">null</span>
                        )}
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="pos">
                <span id="receiver2">
                  {SelectedHead.value === "Credit" && realizevalue.value && (
                    <>
                      {Mtdata.NOSTRO_BANK2 ? (
                        Mtdata.NOSTRO_BANK2
                      ) : (
                        <span className="text-danger">null</span>
                      )}
                    </>
                  )}
                  {SelectedHead.value === "Advance" && (
                    <>
                      {Mtdata.NOSTRO_BANK2 ? (
                        Mtdata.NOSTRO_BANK2
                      ) : (
                        <span className="text-danger">null</span>
                      )}
                    </>
                  )}
                </span>
              </div>
              <br />
              <div className="pos">
                <span>
                  SWIFT MESSAGE TYPE:
                  <span>
                    <strong> MT 103</strong>
                  </span>
                </span>
              </div>
              <br />
              <div className="pos" id="remid">
                <span contentEditable="false">:20:</span>
                <span>{Mtdata.REMITTANCE_ID}</span>
              </div>
              <div className="pos" id="BOC">
                <span contentEditable="false">:23B:CRED</span>
              </div>
              <div id="curamnt">
                <div>
                  <span contentEditable="false">
                    :32A:
                    {Mtdata.TRANSACTION_DATE
                      ? dateextract(Mtdata.TRANSACTION_DATE)
                      : "."}
                    <span
                      contentEditable="false"
                      suppressContentEditableWarning={true}
                    >
                      {SelectedHead.value === "Credit" &&
                        realizevalue.value && (
                          <>
                            {Mtdata.CURRENCY}
                            {JSON.stringify(Mtdata.TT_AMOUNT).includes(".")
                              ? JSON.stringify(Mtdata.TT_AMOUNT).replace(
                                  /\./g,
                                  ","
                                )
                              : JSON.stringify(Mtdata.TT_AMOUNT) + ",00"}
                          </>
                        )}
                      {SelectedHead.value === "Advance" && (
                        <>
                          {Mtdata.CURRENCY}
                          {JSON.stringify(Mtdata.TT_AMOUNT).includes(".")
                            ? JSON.stringify(Mtdata.TT_AMOUNT).replace(
                                /\./g,
                                ","
                              )
                            : JSON.stringify(Mtdata.TT_AMOUNT) + ",00"}
                        </>
                      )}
                    </span>
                  </span>
                </div>
                {optvalue.value === "BEN" && (
                  <div className="pos">
                    <span
                      suppressContentEditableWarning={true}
                      contentEditable="false"
                    >
                      :33B:{Mtdata.CURRENCY}
                      <span id="ttamount" contentEditable="false">
                        {JSON.stringify(Mtdata.TT_AMOUNT).replace(/\./g, ",")}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div id="appac">
                <div className="pos">
                  <span contentEditable="false">:50K:/</span>
                  <span>{Mtdata.APPLICANT_ACCOUNT}</span>
                </div>
                <div className="pos" id="appac2">
                  {/* {Mtdata.APPLICANT_DETAILS} */}
                  <span>
                    {Mtdata.APPLICANT_DETAILS ? (
                      Mtdata.APPLICANT_DETAILS
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
                <div className="pos" id="appac3">
                  <span>
                    {Mtdata.APPLICANT_DETAILS2 ? (
                      Mtdata.APPLICANT_DETAILS2
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="pos">
                <span id="pan">
                  <span contentEditable="false">PAN NO.</span>
                  {Mtdata.PAN_NO}
                </span>
              </div>

              <div id="party">
                {IB === "Yes" && (
                  <div contentEditable="false" className="pos">
                    <span suppressContentEditableWarning={true} id="fiftysixA">
                      :56A:/{IBS.value}
                    </span>
                  </div>
                )}

                {Mtdata.CURRENCY === "INR" ? (
                  <div contentEditable="false" className="pos">
                    <span suppressContentEditableWarning={true}>
                      <span id="five">:57D:/</span>
                      <span id="fiveseven">{IFSC}</span>
                    </span>
                  </div>
                ) : (
                  <div contentEditable="false" className="pos">
                    <span>
                      <span id="five">:57A:/</span>
                      <span id="fiveseven">{swiftcode.value}</span>
                    </span>
                  </div>
                )}

                <div className="pos" id="BBD">
                  <span>
                    {Mtdata.B_B_D ? (
                      Mtdata.B_B_D
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
                <div className="pos" id="BBD2">
                  <span>
                    {Mtdata.B_B_D ? (
                      Mtdata.B_B_D2
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
              </div>

              <div id="Instrument">
                <div className="pos">
                  {SelectedHead.value === "Advance" ? (
                    <>
                      <span contentEditable="false">:59:/</span>
                      <span>
                        {Mtdata.Instrument_Detail ? (
                          Mtdata.Instrument_Detail
                        ) : (
                          <span className="text-danger">null</span>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <span contentEditable="false">:59:/</span>
                      <span>
                        {Mtdata.Instrument_Detail ? (
                          Mtdata.Instrument_Detail
                        ) : (
                          <span className="text-danger">null</span>
                        )}
                      </span>
                    </>
                  )}
                </div>

                <div className="pos" id="benac">
                  <span>
                    {Mtdata.BENEFICIARY_ACCOUNT ? (
                      Mtdata.BENEFICIARY_ACCOUNT
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
                <div className="pos" id="benac2">
                  <span>
                    {Mtdata.BENEFICIARY_DETAILS ? (
                      Mtdata.BENEFICIARY_DETAILS
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="pos" id="cod">
                <span contentEditable="false">:70:</span>
                <span>
                  PAYMENT {SelectedHead.value === "Advance" ? "FOR" : "AGAINST"}{" "}
                  IMPORT OF{" "}
                  {Mtdata.COMMODITY_DESCRIPTION ? (
                    Mtdata.COMMODITY_DESCRIPTION
                  ) : (
                    <span className="text-danger">null</span>
                  )}{" "}
                  AS PER
                </span>
              </div>
              <div className="pos" id="cod2">
                <span className="d-flex">
                  <span>
                    <span contentEditable="false">
                      {SelectedHead.value === "Advance"
                        ? "PI NO"
                        : "INVOICE NO"}
                      -
                    </span>
                    {Mtdata.LICENCE_DETAILS ? (
                      Mtdata.LICENCE_DETAILS
                    ) : (
                      <span className="text-danger">null</span>
                    )}
                  </span>
                  <span className="ml-4">
                    {" "}
                    <span contentEditable="false">DATED -</span>
                    {formatDate(Mtdata.LICENCE_DATE)}{" "}
                  </span>
                </span>
                {Mtdata.BENEFICIARY_DETAILS.trim()
                  .split(" ")
                  .slice(-1)
                  .toString() === "EMIRATES" && (
                  <div className="pos">
                    <span>PURPOSE CODE:TCP</span>
                  </div>
                )}
              </div>

              <div id="DOC">
                <div className="pos" id="sevenoneA">
                  <span>
                    <span contentEditable="false">:71A:</span>
                    <span>{optvalue.value}</span>
                  </span>
                </div>
                {optvalue.value === "BEN" && (
                  <div className="pos" id="sevenoneF">
                    <span suppressContentEditableWarning={true}>
                      <span contentEditable="false">:71F:</span>
                      {Mtdata.CURRENCY}0,00
                    </span>
                  </div>
                )}
                {Mtdata.PAN_NUM === "500040647" &&
                  Mtdata.main_B_B_D.trim().split(" ").pop() === "CHINA" &&
                  optvalue.value === "OUR" && (
                    <div
                      className="pos"
                      id="sevenoneftwo"
                      contentEditable="false"
                    >
                      <span id="fextra">
                        <span contentEditable="false">:F72:</span>/REC/GTYOUR
                      </span>
                    </div>
                  )}

                {Mtdata.CURRENCY === "CNY" &&
                  Mtdata.NOSTRO_BANK.split(",")[0] === "SCBLCNSX" && (
                    <div
                      className="pos"
                      id="sevenoneftwos"
                      contentEditable="false"
                    >
                      <span>
                        <span contentEditable="false">:F72:</span>/REC/CGODDR/
                      </span>
                    </div>
                  )}
                {Mtdata.CURRENCY === "KWD" && (
                  <div
                    className="pos"
                    id="sevenoneftwoss"
                    contentEditable="false"
                  >
                    <span>
                      <span contentEditable="false">:F72:</span>/PLEASE DEBIT
                      OUR ACCOUT //MAINTAINED IN USD FOR EQUIVALENT KWD.
                    </span>
                  </div>
                )}
              </div>

              <br />
              <div className="pos d-flex">
                <small>
                  <strong>DATE</strong>
                  <small>
                    -{" "}
                    <span id="date">
                      {Mtdata.TRANSACTION_DATE
                        ? formatDate(Mtdata.TRANSACTION_DATE)
                        : "null"}
                    </span>
                  </small>
                </small>
                <small className="ml-5">
                  <strong>CURRENCY CODE</strong>
                  <small id="currency">:{Mtdata.CURRENCY}</small>
                </small>
              </div>
              <br />
              <div className="pos" contentEditable="false">
                <small>
                  <strong>AMOUNT IN WORD/ FIGURE: </strong>
                  <small suppressContentEditableWarning={true}>
                    {Mtdata.CURRENCY} {Mtdata.TT_AMOUNT} /{" "}
                    <span
                      style={{ textTransform: "uppercase" }}
                      id="ttamountwords"
                    >
                      {Mtdata.TT_AMOUNT
                        ? convertAmountToWords(Mtdata.TT_AMOUNT)
                        : "null"}{" "}
                      only
                    </span>
                  </small>
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer float-end">
          <div className="float-end">
            <button
              className="btn btn-primary ms-2"
              onClick={() => handleCopy("MTSwift")}
              disabled={
                !optvalue.value ||
                (Mtdata.CURRENCY === "INR"
                  ? IFSC.length !== 11
                  : !swiftcode.value) ||
                (IB === "Yes" && !IBS.value) ||
                Disable ||
                (SelectedHead.value === "Credit" && !realizevalue.value)
              }
            >
              Review & Forward
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwiftMsg;
