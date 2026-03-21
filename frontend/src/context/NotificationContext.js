import React, { createContext, useState, useCallback, useRef } from "react";
import "../styles/notifications.css";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const showConfirm = useCallback(({ title = "Confirm", message = "Are you sure?", confirmText = "Yes", cancelText = "Cancel" }) => {
    return new Promise((resolve) => {
      setConfirm({ title, message, confirmText, cancelText, resolve });
    });
  }, []);

  const handleConfirm = (result) => {
    if (confirm && confirm.resolve) confirm.resolve(result);
    setConfirm(null);
  };

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast container */}
      <div className="nr-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`nr-toast nr-toast-${t.type}`} onClick={() => removeToast(t.id)}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="nr-modal-backdrop">
          <div className="nr-modal">
            <h3>{confirm.title}</h3>
            <p>{confirm.message}</p>
            <div className="nr-modal-actions">
              <button className="btn-secondary" onClick={() => handleConfirm(false)}>{confirm.cancelText}</button>
              <button className="main-button" onClick={() => handleConfirm(true)}>{confirm.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
