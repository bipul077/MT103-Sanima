import React, { useEffect, useState, useContext } from "react";
import Multiselect from "multiselect-react-dropdown";
import MTContext from "../../context/MTContext";
import { toast } from "react-toastify";

const Assignroles = () => {
  const context = useContext(MTContext);
  const { addStaff,getTradeStaff,staff } = context;
  const [selectedstaff, setSelectedstaff] = useState([]);
  const [role, setRole] = useState("");

  const handleAssign = (e) => {
    e.preventDefault();
    if (selectedstaff.length===0 || role==="") {
      toast.error("Please select a staff member/role"); // show alert message
    }
    else{
        addStaff(selectedstaff, role);
        setSelectedstaff([]);
        setRole('');
    }
  };

  useEffect(() => {
    getTradeStaff();
  }, []);
  return (
    <div>
      <div className="container mb-3">
        <div className="card w-100 text-center">
          <div className="card-header">
            <strong>Assign Staff Role</strong>
          </div>
          <form> 
            <div className="card-body">
              <Multiselect
                placeholder="SELECT STAFF"
                className="w-100 mb-2"
                isObject={true} // set this to true since we're using an array of objects as the options
                onRemove={(event) => {
                  setSelectedstaff(event);
                }}
                onSelect={(event) => {
                  setSelectedstaff(event);
                }}
                options={staff} 
                displayValue="idname"
                showCheckbox
                disabled
                selectedValues={selectedstaff}
              />
              <div className="mb-2">
                <select
                  className="w-100 p-2"
                  id="selbranch"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  <option value="" disabled>
                    Select Roles
                  </option>
                  <option value="Maker">Maker</option>
                  <option value="Checker">Checker</option>
                </select>
              </div>

              <button
                type="submit"
                className="ml-1 btn btn-primary btn-sm"
                onClick={handleAssign}
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Assignroles;
