import React from 'react';

function XMLImport({ onUpdate }) {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, 'text/xml');
  
        const get = (tag) => xml.getElementsByTagName(tag)[0]?.textContent || '';
  
        const updated = {
          deviceIDSauna: get('deviceIDSauna'),
          deviceIDHotPot: get('deviceIDHotPot'),
          token: get('token'),
          baseURL: get('baseURL'),
          timestampoffset: get('timestampoffset')
        };
  
        // Speichern im localStorage
        for (const [key, value] of Object.entries(updated)) {
          localStorage.setItem(key, value);
        }
  
        // States in SettingsPage aktualisieren
        onUpdate(updated);
  
        alert('Einstellungen wurden erfolgreich importiert.');
      };
  
      reader.readAsText(file);
    };
  
    return (
      <div style={{ marginTop: '1rem' }}>
        <label>
          <strong>Importiere XML-Einstellungen:</strong>{' '}
          <input type="file" accept=".xml" onChange={handleFileChange} />
        </label>
      </div>
    );
  }
  
  export default XMLImport;
  