import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => !!state.token && state.isAuthenticated,
    authToken: (state) => state.token
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true
        
        const response = await axios.post('/auth/login', credentials)
        
        if (response.data.success) {
          const { token, user } = response.data.data
          
          this.token = token
          this.user = user
          this.isAuthenticated = true
          
          // Store token in localStorage
          localStorage.setItem('token', token)
          
          // Set axios default header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          return response.data
        } else {
          throw new Error(response.data.message || 'Login failed')
        }
      } catch (error) {
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        this.loading = true
        
        const response = await axios.post('/auth/register', userData)
        
        if (response.data.success) {
          const { token, user } = response.data.data
          
          this.token = token
          this.user = user
          this.isAuthenticated = true
          
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          return response.data
        } else {
          throw new Error(response.data.message || 'Registration failed')
        }
      } catch (error) {
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const response = await axios.get('/auth/me')
        
        if (response.data.success) {
          this.user = response.data.data
          this.isAuthenticated = true
        } else {
          this.logout()
        }
      } catch (error) {
        this.logout()
        throw error
      }
    },

    async logout() {
      try {
        if (this.token) {
          await axios.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    // Initialize auth state from localStorage
    initAuth() {
      const token = localStorage.getItem('token')
      
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.fetchUser().catch(() => {
          this.logout()
        })
      }
    }
  }
})
