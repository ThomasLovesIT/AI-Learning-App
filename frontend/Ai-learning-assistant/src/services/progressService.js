import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPath.js'

const getDashboard = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.DASHBOARD)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch  dashboard data' }
    }
}

const progressService = {
    getDashboard
}

export default progressService