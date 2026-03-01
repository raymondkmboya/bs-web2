<script setup>
import { ref, onMounted } from 'vue';
import RegistrationStats from '@/components/students/RegistrationStats.vue';
import RegistrationTable from '@/components/students/RegistrationTable.vue';
import RegistrationForm from '@/components/students/RegistrationForm.vue';
import AdmissionForm from '@/components/students/AdmissionForm.vue';
import StudentService from '@/service/StudentService';
import FollowUpFormModal from '@/components/students/FollowUpFormModal.vue';
import FollowUpsTable from '@/components/students/FollowUpsTable.vue';

// Table data
const registrations = ref([]);
const registrationFollowups = ref([]);

const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);
const registrationFormRef = ref(null);

// Admission form dialog
const showAdmissionDialog = ref(false);
const selectedStudent = ref(null);
const selectedFollowUp = ref(null);
const isViewMode = ref(false);

const showFollowUpForm = ref(false);


onMounted(() => {
    loadRegistrations();
    loadRegistrationFollowups();
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

async function loadRegistrationFollowups() {
    loading.value = true;
    try {
        registrationFollowups.value = await StudentService.getRegistrationFollowups();
        console.log('Registration followups:', registrationFollowups.value);
    } catch (error) {
        console.error('Failed to load registration followups:', error);
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

    // Check if it's follow-up data or registration data
    if (data.student) {
        // Follow-up data - show in modal
        selectedFollowUp.value = data;
        isViewMode.value = true;
        showFollowUpForm.value = true;
    } else {
        // Registration data - show in alert for now
        alert('Registration Details:\n' +
              'Student: ' + (data.first_name + ' ' + data.last_name || 'N/A') + '\n' +
              'Email: ' + (data.email || 'N/A') + '\n' +
              'Phone: ' + (data.phone || 'N/A') + '\n' +
              'Status: ' + (data.status || 'N/A')
        );
    }
}

function handleEdit(data) {
    console.log('Edit:', data);
    // Implement edit logic
}

function handleAdmit(data) {
    selectedStudent.value = data;
    showAdmissionDialog.value = true;
}

function closeAdmissionForm() {
    showAdmissionDialog.value = false;
    selectedStudent.value = null;
}

function handleFollowUp(studentData) {
    selectedStudent.value = studentData;
    console.log(selectedStudent.value)
    showFollowUpForm.value = true;
}

function handleNextFollowUp(studentData) {
    selectedStudent.value = studentData;
    console.log(selectedStudent.value)
    showFollowUpForm.value = true;
}

function closeFollowUpForm() {
    loadRegistrationFollowups()
    showFollowUpForm.value = false;
    selectedFollowUp.value = null;
    isViewMode.value = false;
}

async function saveAdmission(admissionData) {
    try {
        // API call to save admission
        await StudentService.admitStudent(selectedStudent.value.id, admissionData);
        await loadRegistrations(); // Refresh the table
        closeAdmissionForm();
        // Show success message
        console.log('Student admitted successfully!');
    } catch (error) {
        console.error('Failed to admit student:', error);
    }
}
</script>

<template>
    <!-- Stats Blocks Component -->
    <RegistrationStats />
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Student Registrations & Follow Ups</h5>
            <span class="text-600">Manage student registrations, follow-ups, and admissions</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Registrations Tab -->
            <TabPanel header="Registrations">
                <!-- Table Card - Hidden when any form is visible -->
                <div v-if="!showAddDialog && !showAdmissionDialog" class="card">
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
                        @admit="handleAdmit"
                    />

                </div>
            </TabPanel>
            <!-- Follow Ups Tab -->
            <TabPanel header="Follow Ups">
                <!-- Table Card - Hidden when any form is visible -->
                <div v-if="!showAddDialog && !showAdmissionDialog" class="card">
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
                    <FollowUpsTable
                        :registrationFollowups="registrationFollowups"
                        :loading="loading"
                        @view="handleView"
                        @edit="handleEdit"
                        @followUp="handleNextFollowUp"
                        @admit="handleAdmit"
                    />
                </div>
            </TabPanel>
        </TabView>

        <!-- Form Component - Shown when Add Registration is clicked -->
        <RegistrationForm
            ref="registrationFormRef"
            v-model:visible="showAddDialog"
            @submit="submitRegistration"
            @close="closeForm"
        />

        <!-- Admission Form Component -->
        <AdmissionForm
            v-if="showAdmissionDialog"
            :studentData="selectedStudent"
            @close="closeAdmissionForm"
            @save="saveAdmission"
        />

        <!-- Follow up Form Modal -->
        <FollowUpFormModal
            v-model:visible="showFollowUpForm"
            :student="selectedStudent"
            :viewMode="isViewMode"
            :followUpData="selectedFollowUp"
            @submit="submitFollowUp"
            @close="closeFollowUpForm"
        />

    </div>

</template>
