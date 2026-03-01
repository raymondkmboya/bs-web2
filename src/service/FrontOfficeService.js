import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/frontoffice`;

export class FrontOfficeService {
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

    // Enquiry Management
    async getEnquiries() {
        return this.request('get', '/enquiries');
    }

    async addEnquiry(enquiryData) {
        return this.request('post', '/enquiries', enquiryData);
    }

    async getEnquiry(id) {
        return this.request('get', `/enquiries/${id}`);
    }

    async updateEnquiry(id, enquiryData) {
        return this.request('put', `/enquiries/${id}`, enquiryData);
    }

    async deleteEnquiry(id) {
        return this.request('delete', `/enquiries/${id}`);
    }

    async getEnquiryStats() {
        return this.request('get', '/enquiries/statistics');
    }

    // School Enquiry Follow Up Management

    async getEnquiryFollowUps() {
        return this.request('get', `/enquiries/follow-ups`);
    }

    async getEnquiryFollowUpsById(enquiryId) {
        return this.request('get', `/enquiries/${enquiryId}/follow-ups`);
    }

    async addEnquiryFollowUp(followUpData) {
        return this.request('post', '/enquiry-follow-ups', followUpData);
    }

    async updateEnquiryFollowUp(id, followUpData) {
        return this.request('put', `/enquiry-follow-ups/${id}`, followUpData);
    }

    async deleteEnquiryFollowUp(id) {
        return this.request('delete', `/enquiry-follow-ups/${id}`);
    }

    async getEnquiryFollowUpStats() {
        return this.request('get', '/enquiry-follow-ups/statistics');
    }

    // Adverts
    async getAdverts() {
        return this.request('get', '/adverts');
    }

    async storeAdvert(data) {
        return this.request('post', '/adverts', data);
    }

    async getAdvert(id) {
        return this.request('get', `/adverts/${id}`);
    }

    async updateAdvert(id, data) {
        return this.request('put', `/adverts/${id}`, data);
    }

    async deleteAdvert(id) {
        return this.request('delete', `/adverts/${id}`);
    }

    async getAdvertStats() {
        return this.request('get', '/adverts/statistics');
    }

    // Fee Groups Management
    async getFeeGroups() {
        return this.request('get', '/fees/groups');
    }

    async createFeeGroup(groupData) {
        return this.request('post', '/fees/groups', groupData);
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

}

export default new FrontOfficeService();
