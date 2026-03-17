import React, { useState, useEffect } from "react";
import ResourceList from "../components/ResourceList";

function Resources() {

  const [resources, setResources] = useState([]);

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

  return React.createElement(
    "div",
    { style: { padding: "20px" } },

    React.createElement("h1", null, "Campus Resources"),

    React.createElement(ResourceList, { resources: resources })
  );
}

export default Resources;
 {/* Sidebar */}
            <div className="sidebar">

                <div className="logo">
                    <span>Campus Resource Management System</span>
                </div>

                <nav>
                    <a className="active">Dashboard</a>
                    <a href="/resources">Resources</a>
                    <a href="/bookings">My Bookings</a>
                    <a className="logout" onClick={handleLogout}>Log Out</a>
                </nav>

            </div>