<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Stats Cards -->
        <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex items-center justify-between">
                <div>
                    <h6 class="text-gray-600 text-sm">Total Registered</h6>
                    <p class="text-2xl font-bold text-gray-800">{{ stats.total_registered || 0 }}</p>
                </div>
                <i class="pi pi-users text-2xl text-blue-500"></i>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex items-center justify-between">
                <div>
                    <h6 class="text-gray-600 text-sm">Pending Follow-ups</h6>
                    <p class="text-2xl font-bold text-orange-600">{{ stats.pending_follow_ups || 0 }}</p>
                </div>
                <i class="pi pi-clock text-2xl text-orange-500"></i>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex items-center justify-between">
                <div>
                    <h6 class="text-gray-600 text-sm">Due Today</h6>
                    <p class="text-2xl font-bold text-red-600">{{ stats.due_today || 0 }}</p>
                </div>
                <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex items-center justify-between">
                <div>
                    <h6 class="text-gray-600 text-sm">Conversion Rate</h6>
                    <p class="text-2xl font-bold text-green-600">{{ stats.conversion_rate || 0 }}%</p>
                </div>
                <i class="pi pi-chart-line text-2xl text-green-500"></i>
            </div>
        </div>
    </div>

    <!-- Students Needing Follow-up -->
    <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
            <div class="flex justify-between items-center">
                <h5 class="text-lg font-semibold text-gray-800">Students Needing Follow-up</h5>
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    @click="loadStudents"
                    :loading="loading"
                    class="p-button-outlined"
                />
            </div>
        </div>

        <DataTable
            :value="students"
            :loading="loading"
            :paginator="true"
            :rows="10"
            class="p-datatable-sm"
            responsiveLayout="scroll"
        >
            <Column field="first_name" header="Name" sortable>
                <template #body="{ data }">
                    {{ data.first_name }} {{ data.last_name }}
                </template>
            </Column>

            <Column field="phone" header="Contact" sortable>
                <template #body="{ data }">
                    <div>
                        <div>{{ data.phone }}</div>
                        <div class="text-sm text-gray-600">{{ data.email || 'N/A' }}</div>
                    </div>
                </template>
            </Column>

            <Column field="registration_date" header="Registered" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.registration_date) }}
                </template>
            </Column>

            <Column field="latestFollowUp" header="Last Follow-up" sortable>
                <template #body="{ data }">
                    <div v-if="data.latest_follow_up">
                        <div class="text-sm">{{ formatDate(data.latest_follow_up.follow_up_date) }}</div>
                        <Tag :value="data.latest_follow_up.status" :severity="getStatusSeverity(data.latest_follow_up.status)" />
                    </div>
                    <span v-else class="text-gray-500">No follow-ups</span>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 150px">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-phone"
                        class="p-button-rounded p-button-text p-button-plain"
                        v-tooltip="'Follow Up'"
                        @click="handleFollowUp(data)"
                    />
                    <Button
                        icon="pi pi-eye"
                        class="p-button-rounded p-button-text p-button-plain"
                        v-tooltip="'View Details'"
                        @click="handleView(data)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Follow-up Modal -->
    <!-- <FollowUpModal
        v-model:visible="showFollowUpModal"
        :student="selectedStudent"
        @submit="handleFollowUpSubmit"
        @cancel="handleFollowUpCancel"
    /> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
// import FollowUpModal from '@/components/students/FollowUpModal.vue';
// import FollowUpService from '../../service/FollowUpService';

const emit = defineEmits(['followUp', 'view']);

const loading = ref(false);
const students = ref([]);
const stats = ref({});
const showFollowUpModal = ref(false);
const selectedStudent = ref(null);

onMounted(() => {
    loadStats();
    loadStudents();
});

// async function loadStats() {
//     try {
//         const response = await FollowUpService.getFollowUpStats();
//         stats.value = response.data || {};
//     } catch (error) {
//         console.error('Failed to load stats:', error);
//     }
// }

// async function loadStudents() {
//     loading.value = true;
//     try {
//         const response = await FollowUpService.getStudentsNeedingFollowUp();
//         students.value = response.data || [];
//     } catch (error) {
//         console.error('Failed to load students:', error);
//     } finally {
//         loading.value = false;
//     }
// }

function handleFollowUp(student) {
    selectedStudent.value = student;
    showFollowUpModal.value = true;
}

function handleView(student) {
    emit('view', student);
}

function handleFollowUpSubmit() {
    // Refresh data after successful follow-up
    // loadStats();
    loadStudents();
    showFollowUpModal.value = false;
    selectedStudent.value = null;
}

function handleFollowUpCancel() {
    showFollowUpModal.value = false;
    selectedStudent.value = null;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

function getStatusSeverity(status) {
    const severityMap = {
        'pending': 'warning',
        'contacted': 'info',
        'interested': 'success',
        'not_interested': 'danger',
        'enrolled': 'success',
        'stop_follow_up': 'secondary'
    };
    return severityMap[status] || 'info';
}
</script>
