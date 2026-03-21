import React from "react";
import "../styles/modal.css";

function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">

                <h2>{title}</h2>
                <p>{message}</p>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onCancel}>
                        {cancelText || "Cancel"}
                    </button>

                    <button className="btn-primary" onClick={onConfirm}>
                        {confirmText || "Confirm"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ConfirmModal;