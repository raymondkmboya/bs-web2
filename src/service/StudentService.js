import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/students';

class StudentService {
    // Helper to handle requests and errors
    async request(method, url, data = null) {
        try {
            const response = await axios({
                method,
                url: `${API_URL}${url}`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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

    async getAdmitted() {
        return this.request('get', '/admit');
    }

    async getEnrolled() {
        return this.request('get', '/enroll');
    }

    async registerStudent(studentData) {
        return this.request('post', '/register', studentData);
    }

    async admitStudent(id, admissionData) {
        return this.request('post', `/${id}/admit`, admissionData);
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
