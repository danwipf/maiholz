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
                const res = await fetchWithTimeout(`https://${settings.duckdns}/status.json`, 1000);
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

    const triggerShelly = async (label, toggleAfter, reset = false) => {
        setLoading(true);
        setLastAction(`Aktion: ${label}`);

        const cloudUrl = "https://shelly-171-eu.shelly.cloud/device/rpc";
        const sendCloudRequest = async (delay = 0) => {
            const body = {
                id: settings.shellyServerID,
                auth_key: settings.shellyCloudKey,
                method: "Switch.Set",
                params: { id: 0, on: true, toggle_after: toggleAfter }
            };
            await new Promise(r => setTimeout(r, delay));
            await fetch(cloudUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        };

        try {
            await sendCloudRequest();

            if (reset) {
                await sendCloudRequest(7000); // reset erneut nach 7 Sek senden
            }

            setTimeout(() => setLoading(false), reset ? 8000 : 1000);
        } catch (err) {
            console.error("Fehler beim Cloud-Request:", err);
            setLoading(false);
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
                                ↺ Reset
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