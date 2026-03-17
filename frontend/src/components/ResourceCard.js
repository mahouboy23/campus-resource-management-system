import React from "react";

function ResourceCard(props) {
  const resource = props.resource;

  return React.createElement(
    "div",
    {
      style: {
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px",
        borderRadius: "8px"
      }
    },

    React.createElement("h3", null, resource.name),
    React.createElement("p", null, "Type: " + resource.type),
    React.createElement("p", null, "Location: " + resource.location),
    React.createElement("p", null, "Capacity: " + resource.capacity),

    React.createElement(
      "p",
      null,
      "Status: " + (resource.available ? "Available" : "Reserved")
    ),

    React.createElement(
      "button",
      { disabled: !resource.available },
      "Reserve"
    )
  );
}

export default ResourceCard;