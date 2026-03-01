import { defineStore } from 'pinia'
import axios from 'axios'
// const API_BASE_URL = 'http://192.168.0.38:8080/api'
// Configure axios defaults
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}`;

axios.defaults.baseURL = API_URL

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
          this.isAuthenticated = response.data.success // Set this properly!
        } else {
          this.isAuthenticated = false
          // Don't auto-logout on auth failure - let user handle it
          console.error('Auth failed:', response.data.message)
        }
      } catch (error) {
        // Only logout on 401 Unauthorized
        if (error.response?.status === 401) {
          this.logout()
        } else {
          console.error('Auth error:', error)
        }
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
