import axios from 'axios';
import config from '../config';

export const fetchData =  async() => {
    try {

        if (config.dummyData) {
            return config.dummyData;
        }

        const response =  await axios.get(config.apiUrl);
        return response.data;
    } catch(error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
