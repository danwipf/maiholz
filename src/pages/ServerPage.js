import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

function ServerPage() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    const [serverOnline, setServerOnline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastAction, setLastAction] = useState(null);
    const [modalAction, setModalAction] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetchWithTimeout(`http://${settings.duckdns}/status.json`, 1000);
                const data = await res.json();
                setServerOnline(data.status === "online");
            } catch (e) {
                console.warn("Status-Check fehlgeschlagen:", e.message);
                setServerOnline(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, [settings]);

    function fetchWithTimeout(url, timeout = 1000) {
        return Promise.race([
            fetch(url, { cache: "no-store" }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]);
    }

    const triggerShelly = (label, toggleAfter, reset = false) => {
        setLoading(true);
        setLastAction(`Aktion: ${label}`);

        const baseUrl = `http://${settings.duckdns}:${settings.shellyServerPort}`;
        const sendImageRequest = (url) => {
            const img = new Image();
            img.src = url;
        };

        sendImageRequest(`${baseUrl}/rpc/Switch.Set?id=0&on=true&toggle_after=${toggleAfter}`);

        if (reset) {
            setTimeout(() => {
                sendImageRequest(`${baseUrl}/rpc/Switch.Set?id=0&on=true&toggle_after=1`);
                setLoading(false);
            }, 7000);
        } else {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    if (!settings) {
        return <p>⚠️ Keine Einstellungen geladen.</p>;
    }

    return (
        <div style={{ padding: "1rem", fontFamily: "Montserrat, sans-serif", maxWidth: 600, margin: "0 auto" }}>
            <h1>🖥️ Server Steuerung</h1>

            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                Status:{" "}
                {serverOnline === null
                    ? "⏳ Lade..."
                    : serverOnline
                        ? <span style={{ color: "green" }}>🟢 Online</span>
                        : <span style={{ color: "red" }}>🔴 Offline</span>}
            </p>

            {serverOnline !== null && (
                <div style={{ marginTop: "1rem" }}>
                    {serverOnline ? (
                        <>
                            <button onClick={() => setModalAction({ label: "Stop", toggle: 6 })} className="action-button red">
                                ◼ Stop
                            </button>
                            <button onClick={() => setModalAction({ label: "Reset", toggle: 6, reset: false })} className="action-button yellow">
                                ↺ Reset
                            </button>
                        </>
                    ) : (
                        <>
                            <p>🕒 Startzeit ca. 20–30 Sekunden</p>
                            <button onClick={() => setModalAction({ label: "Start", toggle: 1 })} className="action-button green">
                                ▶ Start
                            </button>
                            <button onClick={() => setModalAction({ label: "Reset", toggle: 6, reset: false })} className="action-button yellow">
                                ️↺ Reset
                            </button>
                        </>
                    )}
                </div>
            )}

            {modalAction && (
                <ConfirmModal
                    title={`❓ ${modalAction.label} wirklich ausführen?`}
                    onConfirm={() => {
                        setModalAction(null);
                        triggerShelly(modalAction.label, modalAction.toggle, modalAction.reset);
                    }}
                    onCancel={() => setModalAction(null)}
                />
            )}

            <p style={{ marginTop: "1.5rem", fontStyle: "italic" }}>
                {loading ? "⏳ Wird ausgeführt..." : lastAction}
            </p>
        </div>
    );
}

export default ServerPage;
