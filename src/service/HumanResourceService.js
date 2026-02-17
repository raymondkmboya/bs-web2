import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class HumanResourceService {
    async request(method, url, data = null) {
        try {
            const response = await axios({
                method,
                url: `${BASE_URL}${url}`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error(`API Error (${url}):`, error.response?.data || error.message);
            throw error;
        }
    }

    // Get all staff members
    async getStaffMembers() {
        return this.request('GET', '/hr/staff');
    }

    // Get active staff members only
    async getActiveStaffMembers() {
        return this.request('GET', '/hr/staff/active');
    }

    // Get teachers only
    async getTeachers() {
        return this.request('GET', '/hr/staff/teachers');
    }

    // Get administrative staff only
    async getAdministrativeStaff() {
        return this.request('GET', '/hr/staff/administrative');
    }

    // Get staff by department
    async getStaffByDepartment(department) {
        return this.request('GET', `/hr/staff/department/${department}`);
    }

    // Get specific staff member
    async getStaffMember(id) {
        return this.request('GET', `/hr/staff/${id}`);
    }

    // Create new staff member
    async createStaffMember(staffData) {
        return this.request('POST', '/hr/staff', staffData);
    }

    // Update staff member
    async updateStaffMember(id, staffData) {
        return this.request('PUT', `/hr/staff/${id}`, staffData);
    }

    // Delete staff member
    async deleteStaffMember(id) {
        return this.request('DELETE', `/hr/staff/${id}`);
    }

    // Get staff statistics
    async getStaffStatistics() {
        return this.request('GET', '/hr/staff/statistics');
    }

    // ==================== DEPARTMENT MANAGEMENT ====================

    // Get all departments
    async getDepartments() {
        return this.request('GET', '/hr/departments');
    }

    // Get active departments only
    async getActiveDepartments() {
        return this.request('GET', '/hr/departments/active');
    }

    // Get specific department
    async getDepartment(id) {
        return this.request('GET', `/hr/departments/${id}`);
    }

    // Create new department
    async createDepartment(departmentData) {
        return this.request('POST', '/hr/departments', departmentData);
    }

    // Update department
    async updateDepartment(id, departmentData) {
        return this.request('PUT', `/hr/departments/${id}`, departmentData);
    }

    // Delete department
    async deleteDepartment(id) {
        return this.request('DELETE', `/hr/departments/${id}`);
    }

    // Get department statistics
    async getDepartmentStatistics() {
        return this.request('GET', '/hr/departments/statistics');
    }
}

export default new HumanResourceService();
