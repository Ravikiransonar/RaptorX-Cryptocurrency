import React from "react"
import Dashboard from "./pages/dashboard/DashBoard";
import CoinDetails from "./pages/coindetails/CoinDetails";
import { DataProvider } from "./context/DataContext"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css';


function App() {
  return (
    <ThemeProvider>
      <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/coins" element={<CoinDetails />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
    </ThemeProvider>
    
  );
}

export default App


