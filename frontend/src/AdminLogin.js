import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AdminLogin = () => {
    const navigate = useNavigate();
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const Head = JSON.parse(process.env.REACT_APP_HEAD)
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            process.env.REACT_APP_COMMON_API_URL + "api/central/login",
            {
              username: username,
              password: password,
            }
          );
          if (response.data.success === true) {
            localStorage.setItem("token", response.data.token);
            const staffid = parseInt(response.data.StaffId);
           
            if (Head.includes(staffid)) {
              navigate("/admindashboard");
            }         
            else {
              toast.error("Not authorized!! Please contact to Head");
            }
          } else {
            toast.error("Invalid credentials");
          }
        } catch (error) {
          console.error(error);
        }
      };

  return (
    <div>
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="text-center mb-2">
          <h3 className="text-white">
            Generate Automated MT 103 Swift Message (Admin)
          </h3>
        </div>
        <div className="card col-sm-8 col-md-6 col-lg-4 border rounded p-4">
          <div className="text-center mb-4">
            <img
              className="img-fluid"
              src="./static/images/sanimabank.jpg"
              alt="Sanimabank Logo"
              width="300"
            />
            <br />
            <span className="text-center">
              Sign in to your account using domain credentials
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
