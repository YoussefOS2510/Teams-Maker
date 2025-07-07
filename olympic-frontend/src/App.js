import React, { useState } from 'react';
import GoogleSheetsData from './components/GoogleSheetsData';
import './App.css';

function App() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [showGoogleSheets, setShowGoogleSheets] = useState(false);

  return (
    <div className="olympic-bg">
      <header className="olympic-header-strip">
        <img
          src="/Olympic_rings_without_rims.png"
          alt="Olympics Logo"
          className="olympics-logo-header"
        />
        <div className="olympic-header-content">
          <h1 className="olympic-title">Olympic Team Dashboard</h1>
          <span className="olympic-tagline">Track your teams in Olympic style</span>
        </div>
      </header>
      <main className="olympic-main-content">
        <section className="olympic-gallery-section">
          <h2 className="section-title">Teams</h2>
          <div className="olympic-gallery olympic-gallery-rows">
            {[0, 1].map(row =>
              <div className="gallery-row" key={row}>
                {[1, 2, 3, 4].map(col => {
                  const num = row * 4 + col;
                  return (
                    <div className={`gallery-item olympic-card olympic-color-${num % 5}`} key={num}>
                      <img
                        src={`/img${num}.png`}
                        alt={`Team ${num}`}
                        className="gallery-img-square"
                      />
                      <div className="gallery-label">Team {num}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <section className="sheets-card olympic-accent">
          <h2 className="section-title">Connect Your Google Sheet</h2>
          <div className="url-input-container">
            <input
              type="text"
              placeholder="Paste your Google Sheets URL here..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="url-input"
            />
            <button
              onClick={() => setShowGoogleSheets(true)}
              className="connect-btn"
              disabled={!sheetUrl.trim()}
            >
              Connect Sheet
            </button>
          </div>
          {showGoogleSheets && (
            <GoogleSheetsData sheetUrl={sheetUrl} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;