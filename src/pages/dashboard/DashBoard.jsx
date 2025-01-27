import React from 'react'
import Table from '../../components/table/Table'
import { useTheme } from '../../context/ThemeContext'
import './DashBoard.css';
import Card from '../../components/card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

function Dashboard() {
  const {theme, toggleTheme} = useTheme();

  return (
    <div className={`dashboard-container ${theme}`}>
      <h1 className="dashboard-title">RaptorX - Cryptocurrency</h1>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </button>
      <Card />
      <Table/>
    </div>
  )
}

export default Dashboard