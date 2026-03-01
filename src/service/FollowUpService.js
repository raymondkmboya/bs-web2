import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/students`;

class FollowUpService {
    // Helper to handle requests and errors
    async _request(method, url, data = null) {
        try {
            const response = await axios({
                method,
                url: `${API_URL}${url}`,
                data,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error(`FollowUp API Error (${url}):`, error.response?.data || error.message);
            throw error;
        }
    }

    async getStudentFollowUps(studentId) {
        return this._request('get', `/${studentId}/follow-ups`);
    }

    async createFollowUp(followUpData) {
        return this._request('post', `/follow-ups`, followUpData);
    }

    async getStudentsNeedingFollowUp() {
        return this._request('get', `/students-needing-follow-up`);
    }

    async getFollowUpStats() {
        return this._request('get', `/follow-up-stats`);
    }
}

export default new FollowUpService();
