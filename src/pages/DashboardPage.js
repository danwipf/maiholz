// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import '../index.css';

function DashboardPage() {
  const deviceIdSauna = localStorage.getItem('deviceIDSauna');
  const authKey = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseURL');
  const timestampoffset = Number(localStorage.getItem('timestampoffset') || 0);

  // Einstellungen
  const [duration, setDuration] = useState(
    Number(localStorage.getItem('duration') || 20)
  ); // in Minuten
  const [startTime, setStartTime] = useState(
    localStorage.getItem('startTime') || ''
  );

  // Countdown & Status
  const [remainingTime, setRemainingTime] = useState(null);

  // Manuelles Ein-/Ausschalten
  const toggleSauna = async () => {
    try {
      await fetch(`${baseUrl}/device/relay/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          id: deviceIdSauna,
          auth_key: authKey,
          channel: 0,
          turn: 'toggle',
        }),
      });
    } catch (error) {
      alert('Netzwerkfehler: ' + error.message);
    }
  };

  // Manuelles Starten mit Timer (wenn man direkt starten möchte)
  const startSauna = async () => {
    try {
      await fetch(`${baseUrl}/device/relay/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          id: deviceIdSauna,
          auth_key: authKey,
          channel: 0,
          turn: 'on',
          timer: duration * 60, // in Sekunden
        }),
      });
    } catch (error) {
      console.error('Fehler beim Starten:', error);
    }
  };

  // 1) Dauer ändern und in localStorage schreiben
  const handleDurationChange = (e) => {
    const mins = Number(e.target.value);
    setDuration(mins);
    localStorage.setItem('duration', mins.toString());
  };

  // 2) Startzeit ändern und in localStorage schreiben
  const handleStartTimeChange = (e) => {
    const dt = e.target.value;
    setStartTime(dt);
    localStorage.setItem('startTime', dt);
  };

  // Automatische Aktivierung zur geplanten Zeit
  useEffect(() => {
    if (!startTime) return;
    const scheduleInterval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      // Wenn der Unterschied <1s ist, auslösen
      if (Math.abs(now - start) < 1000) {
        startSauna();
        clearInterval(scheduleInterval);
      }
    }, 1000);
    return () => clearInterval(scheduleInterval);
  }, [startTime, duration]);

  // Restlaufzeit vom Shelly ermitteln
  useEffect(() => {
    let timerInterval;

    const fetchTime = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/device/status?id=${deviceIdSauna}&auth_key=${authKey}`
        );
        const json = await res.json();

        const shellyTime = json.data.device_status.unixtime;
        const timerStarted = json.data.device_status.relays[0].timer_started;
        const timerDur = json.data.device_status.relays[0].timer_duration;

        const clientTime = Math.floor(Date.now() / 1000);
        const timeOffset = clientTime - shellyTime;

        // verbleibende Zeit berechnen (inkl. user-defined offset)
        const remaining =
          timerStarted + timerDur -
          (shellyTime + timeOffset) -
          timestampoffset;

        setRemainingTime(Math.max(0, remaining));
      } catch (err) {
        console.error('Timer-Fehler:', err);
        setRemainingTime('Fehler');
      }
    };

    fetchTime();
    timerInterval = setInterval(fetchTime, 1000);
    return () => clearInterval(timerInterval);
  }, [baseUrl, deviceIdSauna, authKey, timestampoffset]);

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1>Dashboard</h1>

        {/* Manuelles Toggle */}
        <button onClick={toggleSauna}>
          Sauna ein-/ausschalten
        </button>

        {/* Manueller Start mit Timer */}
        <button
          onClick={startSauna}
        >
          Jetzt starten ({duration} min)
        </button>

        {/* Einstellung: Dauer */}
        <div style={{ marginTop: '1rem' }}>
          <label>
            <strong>Laufdauer:</strong>{' '}
            <select
              value={duration}
              onChange={handleDurationChange}
            >
              {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 110, 125, 240].map((min) => (
                <option key={min} value={min}>
                  {min} Min.
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Einstellung: Geplante Startzeit */}
        <div style={{ marginTop: '0.5rem' }}>
          <label>
            <strong>Geplante Startzeit:</strong>{' '}
            <input
              type="datetime-local"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </label>
        </div>

        {/* Restlaufzeit-Anzeige */}
        <div style={{ marginTop: '1.5rem' }}>
          <strong>Verbleibende Zeit:</strong>{' '}
          {typeof remainingTime === 'number'
            ? `${remainingTime} Sek.`
            : remainingTime}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
