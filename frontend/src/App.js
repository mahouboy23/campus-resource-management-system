import React from "react";
import "./App.css";

function App() {
  return React.createElement(
    "div",
    { className: "app-container" },

    React.createElement(
      "div",
      { className: "card" },

      React.createElement(
        "h1",
        { className: "title" },
        "Campus Resource Management"
      ),

      React.createElement(
        "p",
        { className: "subtitle" },
        "Manage labs, rooms and equipment بسهولة"
      ),

      React.createElement(
        "button",
        { className: "main-button" },
        "View Resources"
      )
    )
  );
}

export default App;