<script setup>
import { ref, onMounted } from 'vue';
import EnquiryStats from '@/components/frontoffice/EnquiryStats.vue';
import EnquiryTable from '@/components/frontoffice/EnquiryTable.vue';
import EnquiryForm from '@/components/frontoffice/EnquiryForm.vue';
import EnquiryFollowUpFormModal from '@/components/students/EnquiryFollowUpFormModal.vue';
import FrontOfficeService from '@/service/FrontOfficeService.js';

// Table data
const enquiries = ref([]);
const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);
const showFollowUpDialog = ref(false);
const selectedEnquiry = ref(null);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    full_name: { value: null, matchMode: 'contains' },
    email: { value: null, matchMode: 'contains' },
    phone: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    source: { value: null, matchMode: 'equals' },
    enquiryDate: { value: null, matchMode: 'contains' }
});

const globalFilterFields = ['full_name', 'email', 'phone', 'status', 'enquiryDate', 'source'];

onMounted(() => {
    loadEnquiries();
});

async function loadEnquiries() {
    loading.value = true;
    try {
        const response = await FrontOfficeService.getEnquiries();
        enquiries.value = response.data || response; // Handle different response formats
        console.log('Loaded enquiries:', enquiries.value);
    } catch (error) {
        console.error('Failed to load enquiries:', error);
    } finally {
        loading.value = false;
    }
}

function openAddDialog() {
    showAddDialog.value = true;
}

function closeForm() {
    showAddDialog.value = false;
}

async function submitEnquiry(data) {
    try {
        const response = await FrontOfficeService.addEnquiry(data);
        console.log('Enquiry created:', response);
        await loadEnquiries(); // Refresh table
        closeForm(); // Close dialog
    } catch (error) {
        console.error('Failed to submit enquiry:', error);
    }
}

function handleView(data) {
    console.log('View:', data);
    // Implement view logic
}

function handleEdit(data) {
    console.log('Edit:', data);
    // Implement edit logic
}

function handleFollowUp(data) {
    console.log('Follow Up:', data);
    selectedEnquiry.value = data;
    showFollowUpDialog.value = true;
}

async function submitFollowUp(data) {
    try {
        console.log('Follow up submitted:', data);
        await loadEnquiries(); // Refresh enquiries table
        closeFollowUpDialog(); // Close dialog
    } catch (error) {
        console.error('Failed to submit follow up:', error);
    }
}

function closeFollowUpDialog() {
    showFollowUpDialog.value = false;
    selectedEnquiry.value = null;
}

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        email: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        source: { value: null, matchMode: 'equals' },
        enquiryDate: { value: null, matchMode: 'contains' }
    };
}

// Function to load follow ups for a specific enquiry
async function loadEnquiryFollowUps(enquiryId) {
    try {
        const response = await FrontOfficeService.getEnquiryFollowUpsById(enquiryId);
        return response.data || response; // Handle different response formats
    } catch (error) {
        console.error('Failed to load enquiry follow ups:', error);
        return [];
    }
}
</script>

<template>
    <!-- Enquiry Stats Component -->
    <EnquiryStats />

    <!-- Table Card - Hidden when form is visible -->
    <div v-if="!showAddDialog" class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Student Enquiries</div>
            <Button
                label="Add Enquiry"
                icon="pi pi-plus"
                @click="openAddDialog"
                class="p-button-raised"
            />
        </div>

        <!-- Table Component with Row Expansion -->
        <EnquiryTable
            :enquiries="enquiries"
            :loading="loading"
            :filters="filters"
            :global-filter-fields="globalFilterFields"
            :globalFilterFields="globalFilterFields"
            @view="handleView"
            @edit="handleEdit"
            @followUp="handleFollowUp"
            @clear-filter="clearFilter"
        />
    </div>

    <!-- Form Component - Shown when Add Enquiry is clicked -->
    <EnquiryForm
        v-model:visible="showAddDialog"
        @submit="submitEnquiry"
        @close="closeForm"
    />

    <!-- Follow Up Modal -->
    <EnquiryFollowUpFormModal
        v-model:visible="showFollowUpDialog"
        :enquiry="selectedEnquiry"
        @submit="submitFollowUp"
        @cancel="closeFollowUpDialog"
    />
</template>
