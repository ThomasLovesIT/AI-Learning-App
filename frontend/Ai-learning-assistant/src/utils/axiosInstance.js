import axios from 'axios'
import {BASE_URL} from './apiPath.js'
/**
 * CUSTOM AXIOS INSTANCE
 * 
 * Purpose:
 * Creates a pre-configured HTTP client for the entire application.
 * It handles:
 * 1. Base URL settings (so we don't type it every time)
 * 2. Automatic Token Injection (attaching the JWT to headers)
 * 3. Global Error Handling (timeouts, server errors)
 */
const axiosInstance = axios.create ({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }    
});

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        console.log({message:accessToken})
        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
       return response
    },
    (error) =>{
      if(error.response){
        if(error.response.status === 500) {
            console.error("server error, Please try again later")
        }
      }else if (error.code === "ECONNABORTED") {
        console.error("Request timeout")
      }
      return Promise.reject(error)
    }
)

export default axiosInstance