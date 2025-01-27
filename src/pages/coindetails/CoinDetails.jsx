import React from 'react';
import { useLocation } from 'react-router-dom';
import Chart from '../../components/chart/Chart';
import { useTheme } from '../../context/ThemeContext';
import './CoinDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const CoinDetails = () => {
  const location = useLocation();
  const { state } = location;
  const { row } = state || {};
  const { theme, toggleTheme } = useTheme();

  if (!row) {
    return <p>No data available.</p>;
  }

  const { id, name, symbol, current_price, market_cap, total_volume } = row;

  return (
    <div className={`coin-details-container ${theme}`}>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </button>
      <div className="coin-details-content">
        <div className="coin-stats">
          <h1>{name} ({symbol.toUpperCase()})</h1>
          <p><strong>Current Price:</strong> ${current_price}</p>
          <p><strong>Market Cap:</strong> ${market_cap}</p>
          <p><strong>Total Volume:</strong> ${total_volume}</p>
        </div>
        <div className="coin-chart">
          <Chart coinId={id} theme={theme} /> {/* Pass the coinId to the PriceChart component */}
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;