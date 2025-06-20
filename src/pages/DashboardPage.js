import React, { useState } from "react";
import "../css/DashboardPage.css";

function DashboardPage() {
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem("settings");
        return saved ? JSON.parse(saved) : null;
    });

    const latestVersion = "200620252038";
    const versionDate = config?.version ?? null;
    const outdated = versionDate !== null && versionDate < latestVersion;

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                const requiredKeys = [
                    "duckdns",
                    "serverPort",
                    "jellyfinPort",
                    "shellySaunaPort",
                    "shellyLampePort",
                    "shellyHotpotPort",
                    "shellyServerPort",
                    "version"
                ];

                const isValid = requiredKeys.every((key) => key in json);
                if (!isValid) {
                    alert("Fehlende Felder in der JSON-Datei.");
                    return;
                }

                localStorage.setItem("settings", JSON.stringify(json));
                setConfig(json);
            } catch (err) {
                alert("Ungültige JSON-Datei!");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="dashboard-container">

            <main className="main-content">
                <h1>Dashboard</h1>

                {!config || outdated ? (
                    <>
                        <p>Bitte JSON-Konfigurationsdatei hochladen:</p>
                        <input type="file" accept="application/json" onChange={handleUpload} />
                    </>

                ) : null}

                {outdated && (
                    <p className="warning">⚠️ Deine Konfiguration ist veraltet!</p>
                )}
                {!outdated && (
                    <p className="warning">✅️ Deine Konfiguration ist aktuell!</p>
                )}

                {config &&  !outdated && (
                    <section className="config-section">
                        <h2>Geladene Einstellungen</h2>

                        <table className="settings-table">
                            <thead>
                            <tr>
                                <th>Kategorie</th>
                                <th>Schlüssel</th>
                                <th>Wert</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td>General</td><td>DuckDNS</td><td>{config.duckdns}</td></tr>

                            <tr><td>Server</td><td>Server Port</td><td>{config.serverPort}</td></tr>
                            <tr><td>Server</td><td>Jellyfin Port</td><td>{config.jellyfinPort}</td></tr>

                            <tr><td>Shelly</td><td>Sauna Port</td><td>{config.shellySaunaPort}</td></tr>
                            <tr><td>Shelly</td><td>Lampe Port</td><td>{config.shellyLampePort}</td></tr>
                            <tr><td>Shelly</td><td>Hotpot Port</td><td>{config.shellyHotpotPort}</td></tr>
                            <tr><td>Shelly</td><td>Server Port</td><td>{config.shellyServerPort}</td></tr>

                            <tr><td>Shelly</td><td>Sauna ID</td><td>{config.shellySaunaID}</td></tr>
                            <tr><td>Shelly</td><td>Lampe ID</td><td>{config.shellyLampeID}</td></tr>
                            <tr><td>Shelly</td><td>Hotpot ID</td><td>{config.shellyHotpotID}</td></tr>
                            <tr><td>Shelly</td><td>Server ID</td><td>{config.shellyServerID}</td></tr>

                            <tr><td>Shelly</td><td>Server ID</td><td>{config.shellyCloudKey}</td></tr>

                            <tr><td>Version Control</td><td>Version</td><td>{config.version}</td></tr>
                            </tbody>
                        </table>
                    </section>

                )}
            </main>
        </div>
    );
}

export default DashboardPage;
