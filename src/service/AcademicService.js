import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const BASE_URL = `${API_BASE_URL}/academics`; // Use centralized API config

class AcademicService {

    // Helper to handle requests and errors
    async request(method, url, data = null) {
        try {
            const response = await axios({
                method,
                url: `${BASE_URL}${url}`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if needed:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error(`API Error (${url}):`, error.response?.data || error.message);
            throw error;
        }
    }

    // Rooms API
    async getClassRooms() {
        // Fetches real room data for the British School dashboard
        return this.request('get', '/classrooms');
    }

    // Add new room
    async addClassRoom(roomData) {
        // Persists a new classroom or lab to the database
        return this.request('post', '/classrooms', roomData);
    }

    // Update existing room
    async updateClassRoom(id, roomData) {
        return this.request('put', `/classrooms/${id}`, roomData);
    }

    // Delete room
    async deleteClassRoom(id) {
        return this.request('delete', `/classrooms/${id}`);
    }

    // Fee Groups (For your Fee Tree Table)
    async getFeeGroups() {
        // Fetches hierarchical fee groups like Tuition or CSEE
        return this.request('get', '/fee-groups');
    }

    async getClassLevels() {
        return this.request('get', '/classlevels');
    }

    async getClassLevelStreams() {
        return this.request('get', '/classlevelstreams');
    }

    async getCompass() {
        return this.request('get', '/compass');
    }

}

export default new AcademicService();
