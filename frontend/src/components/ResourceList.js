import React from "react";
import ResourceCard from "./ResourceCard";

function ResourceList(props) {

  const resources = props.resources;

  const resourceElements = resources.map(function(resource) {
    return React.createElement(ResourceCard, {
      key: resource.id,
      resource: resource
    });
  });

  return React.createElement(
    "div",
    null,
    resourceElements
  );
}

export default ResourceList;