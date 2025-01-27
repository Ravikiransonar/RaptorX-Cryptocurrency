import React, { createContext, useEffect, useState } from "react";
import { fetchData } from "../Services/apiService";
import config from "../config.json";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const pollData = async () => {
      try {
        const data = await fetchData();
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };

    pollData();
    const intervalId = setInterval(pollData, config.apiPollingInterval);

    return () => clearInterval(intervalId);
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};


