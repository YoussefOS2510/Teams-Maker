import React, { useState, useEffect } from 'react';

// Helper to extract sheet ID from URL or return as-is if already an ID
function extractSheetId(urlOrId) {
  if (!urlOrId) return '';
  const match = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : urlOrId;
}

const API_KEY = 'AIzaSyDikFRwZNuVTMS4k4Mc9R3KxWqF0sXG0ms'; // <-- PUT YOUR API KEY HERE
const RANGE = 'Main!A1:H'; // Main sheet, columns A-H

const olympicColors = [
  '#0081C8', // Blue
  '#FFD100', // Yellow
  '#000',    // Black
  '#009F3D', // Green
  '#EF3340'  // Red
];

const GoogleSheetsData = ({ sheetUrl }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    
    fetchTeams(true);
    const interval = setInterval(() => fetchTeams(false), 20000); // 20 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [sheetUrl]);

  const fetchTeams = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const SHEET_ID = extractSheetId(sheetUrl);
      if (!SHEET_ID) throw new Error('Invalid Google Sheet URL or ID.');
      const url = `https://sheets.googleapis.com/v4/spreadsheets/1Ji3h_aUL0X9w2jIUWqCQOlVyTEd9rQR4-sdtEww7prY/values/${RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.values || data.values.length === 0) {
        setTeams([]);
        setLastUpdated(new Date());
        if (isInitial) setLoading(false);
        setInitialLoad(false);
        return;
      }
      // Pad all rows to 8 columns
      const allRows = data.values.map(row => {
        const padded = [...row];
        while (padded.length < 8) padded.push('');
        return padded.slice(0, 8);
      });
      // allRows[0] = headers, allRows[1..] = data
      const teamList = allRows[0].map((header, colIdx) => ({
        name: header,
        members: allRows.slice(1).map(row => row[colIdx]).filter(cell => cell && cell.trim() !== '')
      }));
      setTeams(teamList);
      setLastUpdated(new Date());
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      if (isInitial) setLoading(false);
      setInitialLoad(false);
    }
  };

  return (
    <div className="gsheet-card gsheet-card-compact">
      {loading && initialLoad ? (
        <div className="loading">
          <p>Loading teams from Google Sheets...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => fetchTeams(false)} className="refresh-btn">
            Refresh Now
          </button>
        </div>
      ) : teams.length === 0 ? (
        <div className="no-data">
          <p>No teams found in the Google Sheet.</p>
          <p>Make sure your sheet is published to the web and contains data.</p>
        </div>
      ) : (
        <>
          <div className="gsheet-header gsheet-header-compact">
            <span className="gsheet-title">Teams & Members</span>
            <div className="gsheet-controls">
              {lastUpdated && (
                <span className="gsheet-update-time">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button onClick={() => fetchTeams(false)} className="refresh-btn">
                Refresh
              </button>
            </div>
          </div>
          <div className="gsheet-teams-grid gsheet-teams-grid-compact">
            {teams.map((team, idx) => (
              <div
                className="gsheet-team-card gsheet-team-card-compact"
                key={idx}
                style={{ borderLeft: `5px solid ${olympicColors[idx % olympicColors.length]}` }}
              >
                <div className="gsheet-team-header gsheet-team-header-compact">
                  {team.name || `Team ${idx + 1}`}
                </div>
                <ul className="gsheet-team-members gsheet-team-members-compact">
                  {team.members.length === 0 ? (
                    <li className="gsheet-no-members">No members</li>
                  ) : (
                    team.members.map((member, mIdx) => (
                      <li key={mIdx}>{member}</li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleSheetsData; 