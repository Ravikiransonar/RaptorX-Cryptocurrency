import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './Chart.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ coinId, theme }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [dataType, setDataType] = useState('prices'); // State to track the selected data type
  const [chartType, setChartType] = useState('line'); // State to track the selected chart type
  const [days, setDays] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: days
          },
        });
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [coinId, days]);

  if (!historicalData[dataType]?.length) {
    return <p>Loading data...</p>;
  }

  const chartDataConfig = {
    labels: historicalData[dataType].map((entry) =>
      new Date(entry[0]).toLocaleTimeString()
    ),
    datasets: [
      {
        label: dataType.charAt(0).toUpperCase() + dataType.slice(1), // Capitalize the first letter
        data: historicalData[dataType].map((entry) => entry[1]),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Trends Over Time`,
      },
    },
  };

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : 'line'));
  };

  return (
    <div className={`chart-container ${theme}`}>
      <div className="chart-buttons">
        <button onClick={() => setDataType('prices')}>Prices</button>
        <button onClick={() => setDataType('market_caps')}>Market Caps</button>
        <button onClick={() => setDataType('total_volumes')}>Total Volumes</button>
        <button onClick={toggleChartType}>
          Toggle to {chartType === 'line' ? 'Bar' : 'Line'} Chart
        </button>
      </div>
      <div className="chart-buttons">
        <button onClick={() => setDays('1')}>1d</button>
        <button onClick={() => setDays('7')}>7d</button>
        <button onClick={() => setDays('30')}>1m</button>
        <button onClick={() => setDays('90')}>3m</button>
      </div>
      {chartType === 'line' ? (
        <Line data={chartDataConfig} options={options} />
      ) : (
        <Bar data={chartDataConfig} options={options} />
      )}
    </div>
  );
};

export default Chart;