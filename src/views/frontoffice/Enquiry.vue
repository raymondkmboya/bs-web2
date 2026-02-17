<script setup>
import { ref, onMounted } from 'vue';
import EnquiryStats from '@/components/frontoffice/EnquiryStats.vue';
import EnquiryTable from '@/components/frontoffice/EnquiryTable.vue';
import EnquiryForm from '@/components/frontoffice/EnquiryForm.vue';
import RegistrationService from '@/services/RegistrationService.js';

// Table data
const enquiries = ref([]);
const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);

onMounted(() => {
    loadEnquiries();
});

async function loadEnquiries() {
    loading.value = true;
    try {
        enquiries.value = await RegistrationService.getEnquiries();
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
        await RegistrationService.addEnquiry(data);
        await loadEnquiries(); // Refresh the table
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
    // Implement follow up logic
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

        <!-- Table Component -->
        <EnquiryTable
            :enquiries="enquiries"
            :loading="loading"
            @view="handleView"
            @edit="handleEdit"
            @followUp="handleFollowUp"
        />
    </div>

    <!-- Form Component - Shown when Add Enquiry is clicked -->
    <EnquiryForm
        v-model:visible="showAddDialog"
        @submit="submitEnquiry"
        @close="closeForm"
    />
</template>
