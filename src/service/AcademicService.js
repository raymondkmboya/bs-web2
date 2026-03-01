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

    async getStreamsByClassLevel(classLevelId) {
        return this.request('get', `/classlevelstreams/classlevel/${classLevelId}`);
    }

    async getCompass() {
        return this.request('get', '/compass');
    }

    async getSubjects(params = {}) {
        return this.request('GET', '/subjects', null, params);
    }

    async getSubject(id) {
        return this.request('GET', `/subjects/${id}`);
    }

    async getSubjectsByClassLevel(classLevelId) {
        return this.request('GET', `/subjects/classlevel/${classLevelId}`);
    }

    async getSubjectTeachers() {
        return this.request('GET', '/subjects/teachers');
    }

    async createSubject(subjectData) {
        return this.request('POST', '/subjects', subjectData);
    }

    async updateSubject(id, subjectData) {
        return this.request('PUT', `/subjects/${id}`, subjectData);
    }

    async deleteSubject(id) {
        return this.request('DELETE', `/subjects/${id}`);
    }

    // Exam methods
    async getExams(filters = {}) {
        const params = new URLSearchParams();

        if (filters.class_level_id) params.append('class_level_id', filters.class_level_id);
        if (filters.stream_id) params.append('stream_id', filters.stream_id);
        if (filters.status) params.append('status', filters.status);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);

        const queryString = params.toString();
        const url = queryString ? `/exams?${queryString}` : '/exams';

        return this.request('GET', url);
    }

    async getExam(id) {
        return this.request('GET', `/exams/${id}`);
    }

    async createExam(examData) {
        return this.request('POST', '/exams', examData);
    }

    async updateExam(id, examData) {
        return this.request('PUT', `/exams/${id}`, examData);
    }

    async deleteExam(id) {
        return this.request('DELETE', `/exams/${id}`);
    }

    // Helper methods for exam types
    getExamTypes() {
        return [
            { label: 'Midterm Exam', value: 'midterm' },
            { label: 'Final Exam', value: 'final' },
            { label: 'Quiz', value: 'quiz' },
            { label: 'Assignment', value: 'assignment' },
            { label: 'Practical', value: 'practical' }
        ];
    }

    // Helper methods for exam status
    getExamStatuses() {
        return [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
        ];
    }

    // Exam Results methods
    async getExamResults(filters = {}) {
        const params = new URLSearchParams();

        if (filters.exam_id) params.append('exam_id', filters.exam_id);
        if (filters.student_id) params.append('student_id', filters.student_id);
        if (filters.status) params.append('status', filters.status);
        if (filters.class_level_id) params.append('class_level_id', filters.class_level_id);

        const queryString = params.toString();
        const url = queryString ? `/exam-results?${queryString}` : '/exam-results';

        return this.request('GET', url);
    }

    async getExamResultsByExam(examId) {
        return this.request('GET', `/exams/${examId}/results`);
    }

    async createExamResults(resultsData) {
        return this.request('POST', '/exam-results', resultsData);
    }

    async updateExamResult(id, resultData) {
        return this.request('PUT', `/exam-results/${id}`, resultData);
    }

    async deleteExamResult(id) {
        return this.request('DELETE', `/exam-results/${id}`);
    }

    async getExamStatistics(examId) {
        return this.request('GET', `/exams/${examId}/statistics`);
    }

    // Helper methods for exam result status
    getExamResultStatuses() {
        return [
            { label: 'Pass', value: 'pass' },
            { label: 'Fail', value: 'fail' },
            { label: 'Pending', value: 'pending' },
            { label: 'Absent', value: 'absent' }
        ];
    }

    // Helper method to calculate grade from percentage
    calculateGrade(percentage) {
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        if (percentage >= 40) return 'E';
        return 'F';
    }

    // Helper method to get grade color
    getGradeColor(grade) {
        const colors = {
            'A': 'green',
            'B': 'blue',
            'C': 'orange',
            'D': 'orange',
            'E': 'red',
            'F': 'red'
        };
        return colors[grade] || 'gray';
    }

    // Helper method to get status color
    getResultStatusColor(status) {
        const colors = {
            'pass': 'green',
            'fail': 'red',
            'pending': 'orange',
            'absent': 'gray'
        };
        return colors[status] || 'gray';
    }

    // Timetable methods
    async getTimeTable(filters = {}) {
        const params = new URLSearchParams();

        if (filters.class_level_id) params.append('class_level_id', filters.class_level_id);
        if (filters.class_level_stream_id) params.append('class_level_stream_id', filters.class_level_stream_id);
        if (filters.subject_id) params.append('subject_id', filters.subject_id);
        if (filters.teacher_id) params.append('teacher_id', filters.teacher_id);
        if (filters.academic_year) params.append('academic_year', filters.academic_year);
        if (filters.semester) params.append('semester', filters.semester);
        if (filters.status) params.append('status', filters.status);

        const queryString = params.toString();
        const url = queryString ? `/timetable?${queryString}` : '/timetable';

        return this.request('GET', url);
    }

    async getClassTimetable(params) {
        const queryParams = new URLSearchParams();

        if (params.class_level_id) queryParams.append('class_level_id', params.class_level_id);
        if (params.class_level_stream_id) queryParams.append('class_level_stream_id', params.class_level_stream_id);
        if (params.academic_year) queryParams.append('academic_year', params.academic_year);
        if (params.semester) queryParams.append('semester', params.semester);

        const queryString = queryParams.toString();
        const url = queryString ? `/timetable/class?${queryString}` : '/timetable/class';

        return this.request('GET', url);
    }

    async createTimetableEntry(entryData) {
        return this.request('POST', '/timetable', entryData);
    }

    async bulkCreateTimetable(entriesData) {
        return this.request('POST', '/timetable/bulk', entriesData);
    }

    async updateTimetableEntry(id, entryData) {
        return this.request('PUT', `/timetable/${id}`, entryData);
    }

    async deleteTimetableEntry(id) {
        return this.request('DELETE', `/timetable/${id}`);
    }

    async getTimetableStatistics(params = {}) {
        const queryParams = new URLSearchParams();

        if (params.class_level_id) queryParams.append('class_level_id', params.class_level_id);
        if (params.academic_year) queryParams.append('academic_year', params.academic_year);
        if (params.semester) queryParams.append('semester', params.semester);

        const queryString = queryParams.toString();
        const url = queryString ? `/timetable/statistics?${queryString}` : '/timetable/statistics';

        return this.request('GET', url);
    }

    async getTimetableOptions() {
        return this.request('GET', '/timetable/options');
    }

    // Helper methods for timetable
    getDaysOfWeek() {
        return [
            { label: 'Monday', value: 1 },
            { label: 'Tuesday', value: 2 },
            { label: 'Wednesday', value: 3 },
            { label: 'Thursday', value: 4 },
            { label: 'Friday', value: 5 },
            { label: 'Saturday', value: 6 },
            { label: 'Sunday', value: 7 }
        ];
    }

    getTimeSlots() {
        return [
            { label: '7:00 AM', value: '07:00' },
            { label: '8:00 AM', value: '08:00' },
            { label: '9:00 AM', value: '09:00' },
            { label: '10:00 AM', value: '10:00' },
            { label: '11:00 AM', value: '11:00' },
            { label: '12:00 PM', value: '12:00' },
            { label: '1:00 PM', value: '13:00' },
            { label: '2:00 PM', value: '14:00' },
            { label: '3:00 PM', value: '15:00' },
            { label: '4:00 PM', value: '16:00' },
            { label: '5:00 PM', value: '17:00' }
        ];
    }

    getSemesters() {
        return [
            { label: 'First Semester', value: '1' },
            { label: 'Second Semester', value: '2' },
            { label: 'Third Semester', value: '3' }
        ];
    }

    getTimetableStatuses() {
        return [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Cancelled', value: 'cancelled' }
        ];
    }

    // Helper method to get subject color
    getSubjectColor(subjectName) {
        const colors = {
            'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
            'English': 'bg-green-100 text-green-800 border-green-200',
            'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
            'Chemistry': 'bg-orange-100 text-orange-800 border-orange-200',
            'Biology': 'bg-teal-100 text-teal-800 border-teal-200',
            'History': 'bg-brown-100 text-brown-800 border-brown-200',
            'Geography': 'bg-cyan-100 text-cyan-800 border-cyan-200',
            'Kiswahili': 'bg-pink-100 text-pink-800 border-pink-200'
        };
        return colors[subjectName] || 'bg-gray-100 text-gray-800 border-gray-200';
    }

    // Helper method to format time
    formatTime(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Helper method to get day name
    getDayName(dayNumber) {
        const days = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday'
        };
        return days[dayNumber] || 'Unknown';
    }

}

export default new AcademicService();
