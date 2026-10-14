import axios from 'axios'

// Centralised Axios instance. Set VITE_API_BASE_URL in .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true
})

// Attach Bearer token if user is logged in
api.interceptors.request.use(config => {
  try {
    const user = JSON.parse(localStorage.getItem('cc_user'))
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch (err) {
    // Ignore JSON parse errors
  }
  return config
})

export default api

