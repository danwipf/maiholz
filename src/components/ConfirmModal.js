import React from "react";

function ConfirmModal({ title, onConfirm, onCancel }) {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                minWidth: "300px",
                fontFamily: "Montserrat, sans-serif",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
            }}>
                <h3 style={{ marginBottom: "1rem" }}>{title}</h3>
                <button onClick={onConfirm} style={{ marginRight: "1rem" }}>✅ Ja</button>
                <button onClick={onCancel}>❌ Abbrechen</button>
            </div>
        </div>
    );
}

export default ConfirmModal;
