import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResourceList from "../components/ResourceList";

function Resources() {

  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(function() {

    const data = [
      {
        id: 1,
        name: "Computer Lab A",
        type: "Laboratory",
        location: "Building 2",
        capacity: 30,
        available: true
      },
      {
        id: 2,
        name: "Conference Room",
        type: "Meeting Room",
        location: "Administration Block",
        capacity: 15,
        available: false
      },
      {
        id: 3,
        name: "Projector",
        type: "Equipment",
        location: "Media Center",
        capacity: 1,
        available: true
      }
    ];

    setResources(data);

  }, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">

        <div className="logo">
          <span>Campus Resource Management System</span>
        </div>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link className="active" to="/resources">Resources</Link>
          <Link to="/bookings">My Bookings</Link>
          <a className="logout" onClick={handleLogout}>Log Out</a>
        </nav>

      </div>

      {/* Main Content */}
      <div className="main" style={{ padding: "20px" }}>

        <h1>Campus Resources</h1>

        <ResourceList resources={resources} />

      </div>

    </div>
  );
}

export default Resources;