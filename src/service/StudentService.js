import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/students`;

class StudentService {
    // Helper to handle requests and errors
    async request(method, url, data = null, config = {}) {
        try {
            const response = await axios({
                method,
                url: `${API_URL}${url}`,
                data,
                ...config, // Spreads the config (including headers) we passed from admitStudent
                headers: {
                    // Keep Authorization as a default
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    // Merge other headers, allowing admitStudent to override Content-Type
                    ...config.headers
                }
            });

            // Return the nested data from your backend response
            return response.data.data;
        } catch (error) {
            console.error(`API Error (${url}):`, error.response?.data || error.message);
            throw error;
        }
    }

    // Student Registration Methods
    async getRegistrations() {
        return this.request('get', '/register');
    }

    async getRegistrationStats() {
        // Simulate API call
        return this.request('get', '/registration-stats');
    }

    async getAdmissionStats() {
        // Simulate API call
        return this.request('get', '/admission-stats');
    }

    async getRegistrationFollowups() {
        return this.request('get', '/followups');
    }

    async getAdmissions() {
        return this.request('get', '/admit');
    }

    async getEnrollments() {
        return this.request('get', '/enroll');
    }

    async registerStudent(studentData) {
        return this.request('post', '/register', studentData);
    }

    async admitStudent(id, data) {
        // Check if data is FormData (file upload) or regular JSON
        const isFormData = data instanceof FormData;

        const config = {
            headers: {
                // Don't set Content-Type for FormData - let browser set it with boundary
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            }
        };

        if (isFormData) {
            // For FormData, let axios handle the content-type automatically
            return this.request('post', `/${id}/admit`, data, config);
        } else {
            // For regular JSON data
            return this.request('post', `/${id}/admit`, data, config);
        }
    }

    async enrollStudent(id, enrollmentData) {
        return this.request('post', `/${id}/enroll`, enrollmentData);
    }

    async getStudent(id) {
        return this.request('get', `/${id}`);
    }

    async updateStudent(id, studentData) {
        return this.request('put', `/${id}`, studentData);
    }

    async deleteStudent(id) {
        return this.request('delete', `/${id}`);
    }

    // Get all students (with filters)
    async getStudents(filters = {}) {
        let url = '/';
        const params = new URLSearchParams();

        if (filters.level) params.append('level', filters.level);
        if (filters.stream) params.append('stream', filters.stream);
        if (filters.class) params.append('class', filters.class);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.per_page) params.append('per_page', filters.per_page);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        return this.request('get', url);
    }

    // Get students by level and stream
    async getStudentsByLevelAndStream(level, stream) {
        return this.request('get', `/by-level-stream?level=${level}&stream=${stream}`);
    }
}

export default new StudentService();
