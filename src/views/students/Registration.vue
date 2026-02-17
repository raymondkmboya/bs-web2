<script setup>
import { ref, onMounted } from 'vue';
import RegistrationStats from '@/components/students/RegistrationStats.vue';
import RegistrationTable from '@/components/students/RegistrationTable.vue';
import RegistrationForm from '@/components/students/RegistrationForm.vue';
import StudentService from '@/service/StudentService';

// Table data
const registrations = ref([]);
const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);
const registrationFormRef = ref(null);

onMounted(() => {
    loadRegistrations();
});

async function loadRegistrations() {
    loading.value = true;
    try {
        registrations.value = await StudentService.getRegistrations();
    } catch (error) {
        console.error('Failed to load registrations:', error);
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

async function submitRegistration(data) {
    try {
        await StudentService.registerStudent(data);
        await loadRegistrations(); // Refresh the table

        // Call success handler on RegistrationForm component
        if (registrationFormRef.value) {
            registrationFormRef.value.handleSuccess('Student registered successfully!');
        }
    } catch (error) {
        console.error('Failed to submit registration:', error);

        // Call error handler on RegistrationForm component
        if (registrationFormRef.value) {
            registrationFormRef.value.handleError(error);
        }
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
    <!-- Stats Blocks Component -->
    <RegistrationStats />

    <!-- Table Card - Hidden when form is visible -->
    <div v-if="!showAddDialog" class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Student Registration</div>
            <Button
                label="Add Registration"
                icon="pi pi-plus"
                @click="openAddDialog"
                class="p-button-raised"
            />
        </div>

        <!-- Table Component -->
        <RegistrationTable
            :registrations="registrations"
            :loading="loading"
            @view="handleView"
            @edit="handleEdit"
            @followUp="handleFollowUp"
        />
    </div>

    <!-- Form Component - Shown when Add Registration is clicked -->
    <RegistrationForm
        ref="registrationFormRef"
        v-model:visible="showAddDialog"
        @submit="submitRegistration"
        @close="closeForm"
    />
</template>
