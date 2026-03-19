import React from "react";

function ResourceCard({ resource, onSelect }) {
    return (
        <div className="resource-card">
            <h3>{resource.icon} {resource.name}</h3>

            <p>{resource.description}</p>

            <span className={resource.availabilityStatus ? "available" : "unavailable"}>
                {resource.availabilityStatus ? "Available" : "Unavailable"}
            </span>

            <button
                disabled={!resource.availabilityStatus}
                onClick={() => onSelect(resource)}
            >
                Reserve
            </button>
        </div>
    );
}

export default ResourceCard;