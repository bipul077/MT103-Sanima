import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Protected from './components/Protected';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MTState from "./context/MTState";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import MakerDashboard from "./components/MakerDashboard/MakerDashboard";
import CheckerDashboard from "./components/CheckerDashboard/CheckerDashboard";
import CkEditor from "./components/MakerDashboard/Editor/CkEditor";
import MtAssigned from "./components/MakerDashboard/MtAssigned";
import SideNav from "./components/SideNav";
import ViewDashboard from "./components/ViewDashboard/ViewDashboard";
import AdminLogin from "./AdminLogin";


function App() {
  return (
    <>
      <MTState>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/admindashboard" element={<Protected Component={AdminDashboard} />} />
            <Route exact path="/makerdashboard" element={<Protected Component={MakerDashboard} />} />
            <Route exact path="/checkerdashboard" element={<Protected Component={CheckerDashboard} />} />
            <Route exact path="/viewdashboard" element={<Protected Component={ViewDashboard} />} />
            <Route exact path="/ckeditor" element={<Protected Component={CkEditor} />} />
            <Route exact path="/mtassign" element={<Protected Component={MtAssigned} />} />
            <Route exact path="/sidenav" element={<Protected Component={SideNav} />} />
            <Route exact path="/admin" element={<AdminLogin/>} />
          </Routes>
        </Router>
      </MTState>
      <ToastContainer/>
    </>
  );
}

export default App;
