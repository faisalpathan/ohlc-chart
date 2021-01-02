import axios from 'axios';
import { BASE_API_PATH_REST } from '../constants'

export const fetchHistoricalData = async () => {
    try {
        const response = await axios.get(`${BASE_API_PATH_REST}/historical`)
        if (response.status === 200 && response.data) {
            return response.data
        }
        return []
    } catch (error) {
        console.error(error)
        return []
    }
}