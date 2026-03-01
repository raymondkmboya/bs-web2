import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/payments`;

class PaymentService {
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

    /**
     * Generate system receipt
     */
    async generateReceipt(transactionId) {
        return await this.request('GET', `/receipt/${transactionId}`);
    }

    /**
     * Approve transaction
     */
    async approveTransaction(transactionId) {
        return await this.request('PUT', `/transactions/${transactionId}/approve`);
    }

    /**
     * Reject transaction
     */
    async rejectTransaction(transactionId, rejectionReason) {
        return await this.request('PUT', `/transactions/${transactionId}/reject`, {
            rejection_reason: rejectionReason
        });
    }

    /**
     * Generate student statement
     */
    async generateStudentStatement(studentId) {
        return this.request('GET', `/student/statement/${studentId}`);
    }

    // Student Registration Methods
    async getStudentPayment(studentId) {
        return this.request('get', `/student/${studentId}`);
    }

    // Student Registration Methods
    async getStudentTransaction(studentId) {
        return this.request('get', `/transactions/student/${studentId}`);
    }

    async getStudentPayments() {
        return this.request('get', '');
    }

    async getStudentTransactions() {
        return this.request('get', '/transactions');
    }

    async getPaymentStats() {
        return this.request('get', '/payment-stats');
    }

    // Add Transaction
    async addTransaction(transactionData) {
        // Check if data is FormData (file upload) or regular JSON
        const isFormData = transactionData instanceof FormData;

        const config = {
            headers: {
                // Don't set Content-Type for FormData - let browser set it with boundary
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            }
        };

        if (isFormData) {
            // For FormData, let axios handle the content-type automatically
            return this.request('post', '/transactions', transactionData, config);
        } else {
            // For regular JSON data
            return this.request('post', '/transactions', transactionData, config);
        }
    }

    async getClassLevelFeeStructure(classLevelId) {
        return this.request('get', `/fee-structure/class-level/${classLevelId}`);
    }

    async generateIncomeStatement(params) {
        // For bank statements, we need to handle direct view response
        const response = await fetch(`${API_BASE_URL}/payments/income-statement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error('Failed to generate income statement');
        }

        // Return the HTML content directly for bank printing
        return await response.text();
    }

    // Fee Groups Management
    async getFeeGroups() {
        return this.request('get', '/fee-groups');
    }

    async createFeeGroup(groupData) {
        return this.request('post', '/fee-groups', groupData);
    }

    async getFeeGroup(id) {
        return this.request('get', `/fees/groups/${id}`);
    }

    async updateFeeGroup(id, groupData) {
        return this.request('put', `/fees/groups/${id}`, groupData);
    }

    async deleteFeeGroup(id) {
        return this.request('delete', `/fees/groups/${id}`);
    }

    async getFeeStructures() {
        return this.request('get', '/fee-structures');
    }
}

export default new PaymentService();
