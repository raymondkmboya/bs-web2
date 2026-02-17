<script setup>
import { ref, onMounted } from 'vue';
import AdmissionStats from '@/components/students/AdmissionStats.vue';
import AdmissionTable from '@/components/students/AdmissionTable.vue';
import RegistrationService from '@/services/RegistrationService.js';

// Table data
const admissions = ref([]);
const loading = ref(false);

onMounted(() => {
    loadAdmissions();
});

async function loadAdmissions() {
    loading.value = true;
    try {
        admissions.value = await RegistrationService.getAdmissions();
    } catch (error) {
        console.error('Failed to load admissions:', error);
    } finally {
        loading.value = false;
    }
}

function handleView(data) {
    console.log('View:', data);
    // Implement view logic
}

function handleEnroll(data) {
    console.log('Enroll:', data);
    // Implement enrollment logic
}

function handleReject(data) {
    console.log('Reject:', data);
    // Implement rejection logic
}
</script>

<template>
    <!-- Admission Stats Component -->
    <AdmissionStats />

    <!-- Table Card -->
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Student Admissions</div>
        </div>

        <!-- Table Component -->
        <AdmissionTable
            :admissions="admissions"
            :loading="loading"
            @view="handleView"
            @enroll="handleEnroll"
            @reject="handleReject"
        />
    </div>
</template>
