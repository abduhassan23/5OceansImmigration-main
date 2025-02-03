import axios from 'axios';

const API_BASE_URL = 'https://5soundwaves.tech';  

export const generatePDF = async (firebaseUID) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/generate-pdf`, { firebaseUID }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.download_url;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};
