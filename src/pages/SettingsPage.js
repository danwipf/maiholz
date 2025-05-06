import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import XMLImport from '../components/XMLImport';
import '../index.css';



function SettingsPage() {
  const [deviceIDSauna, setdeviceIDSauna] = useState(localStorage.getItem('deviceIDSauna') || '');
  const [deviceIDHotPot, setdeviceHotPot] = useState(localStorage.getItem('deviceIDHotPot') || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [baseUrl, setBaseURL] = useState(localStorage.getItem('baseURL') || '');
  const [timestampoffset, settimestampoffset] = useState(localStorage.getItem('timestampoffset') || "");

  const [duration, setDuration] = useState(localStorage.getItem('duration') || '20');
  const [startTime, setStartTime] = useState(localStorage.getItem('startTime') || '');


  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('deviceIDSauna', 'd8bfc01a555e');
    localStorage.setItem('deviceIDHotPot', 'Nicht Installiert');
    localStorage.setItem('token', token);
    localStorage.setItem('baseURL', baseUrl);
    localStorage.setItem('timestampoffset', 7200)

    setdeviceIDSauna('d8bfc01a555e');
    setdeviceHotPot('Nicht Installiert');
    settimestampoffset(7200);

    navigate('/dashboard');
  };


  return (

    <div className="settings-container">
      <form className="settings-box" onSubmit={handleLogin}>
        <h1>Setting</h1>
        <h3>Shelly DeviceID</h3>
        <h2>Sauna: {localStorage.getItem('deviceIDSauna')}</h2>
        <h2>HotPot: {localStorage.getItem('deviceIDHotPot')}</h2>

        <h3>Token</h3>
        <input
          type="text"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <h3>BaseURL</h3>
        <input
          type="text"
          placeholder="BaseURL"
          value={baseUrl}
          onChange={(e) => setBaseURL(e.target.value)}
          required
        />
        <h3>Time Stamp Offset</h3>
        <input
          type="text"
          placeholder="Time Stamp Offset"
          value={timestampoffset}
          onChange={(e) => settimestampoffset(e.target.value)}
          required
        />

        <XMLImport
          onUpdate={({ deviceIDSauna, deviceIDHotPot, token, baseURL, timestampoffset }) => {
            setdeviceIDSauna(deviceIDSauna);
            setdeviceHotPot(deviceIDHotPot);
            setToken(token);
            setBaseURL(baseURL);
            settimestampoffset(timestampoffset);
          }}
        />

        <button type="submit">Speichern</button>
      </form>

    </div>
  );
}

export default SettingsPage;
