<script setup>
import { ref, onMounted, computed } from 'vue';
import AttendanceStats from '@/components/students/AttendanceStats.vue';
import AttendanceTable from '@/components/students/AttendanceTable.vue';
// import AttendanceForm from '@/components/students/AttendanceForm.vue';
// import AttendanceService from '@/services/AttendanceService.js';

// Table data
const attendanceRecords = ref([]);
const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);

onMounted(() => {
    loadAttendanceRecords();
});

async function loadAttendanceRecords() {
    loading.value = true;
    try {
        // Mock data - in real app this would come from API
        attendanceRecords.value = [
            {
                id: 1,
                studentId: 'STU001',
                studentName: 'John Michael Kimario',
                level: 'QT',
                stream: 'Stream A',
                class: 'Class 1A',
                scanTime: '2025-02-15T07:30:15',
                checkInTime: '07:30 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 01',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 2,
                studentId: 'STU002',
                studentName: 'Grace Esther Mwangi',
                level: 'QT',
                stream: 'Stream A',
                class: 'Class 1A',
                scanTime: '2025-02-15T07:32:45',
                checkInTime: '07:32 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 01',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 3,
                studentId: 'STU003',
                studentName: 'Peter James Mollel',
                level: 'QT',
                stream: 'Stream B',
                class: 'Class 1C',
                scanTime: '2025-02-15T07:45:20',
                checkInTime: '07:45 AM',
                status: 'late',
                scanMethod: 'Fingerprint',
                device: 'Scanner 02',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 4,
                studentId: 'STU004',
                studentName: 'Anna Faith Nyambura',
                level: 'CSEE',
                stream: 'Stream A',
                class: 'Class 2A',
                scanTime: '2025-02-15T07:28:30',
                checkInTime: '07:28 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 01',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 5,
                studentId: 'STU005',
                studentName: 'David Michael Kinyua',
                level: 'CSEE',
                stream: 'Stream B',
                class: 'Class 2D',
                scanTime: '2025-02-15T07:50:10',
                checkInTime: '07:50 AM',
                status: 'late',
                scanMethod: 'ID Card',
                device: 'Scanner 03',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 6,
                studentId: 'STU006',
                studentName: 'Sarah Elizabeth Mushi',
                level: 'ASCEE',
                stream: 'Stream A',
                class: 'Class 3A',
                scanTime: '2025-02-15T07:25:55',
                checkInTime: '07:25 AM',
                status: 'present',
                scanMethod: 'Fingerprint',
                device: 'Scanner 02',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 7,
                studentId: 'STU007',
                studentName: 'James Wilson Massawe',
                level: 'ASCEE',
                stream: 'Stream B',
                class: 'Class 3C',
                scanTime: '2025-02-15T07:35:40',
                checkInTime: '07:35 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 01',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 8,
                studentId: 'STU008',
                studentName: 'Lucy Grace Nyerere',
                level: 'English Course',
                stream: 'Stream A',
                class: 'Class 4A',
                scanTime: '2025-02-15T07:40:25',
                checkInTime: '07:40 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 03',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 9,
                studentId: 'STU009',
                studentName: 'Robert John Makonda',
                level: 'ECDE',
                stream: 'Stream B',
                class: 'Class 5D',
                scanTime: '2025-02-15T07:55:15',
                checkInTime: '07:55 AM',
                status: 'late',
                scanMethod: 'Fingerprint',
                device: 'Scanner 02',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 10,
                studentId: 'STU010',
                studentName: 'Mary Anne Kessy',
                level: 'Pre Form One',
                stream: 'Stream A',
                class: 'Class 6A',
                scanTime: '2025-02-15T07:29:50',
                checkInTime: '07:29 AM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 01',
                attendanceType: 'Morning Check-in'
            },
            {
                id: 11,
                studentId: 'STU011',
                studentName: 'Francis Paul Mgaya',
                level: 'QT',
                stream: 'Stream B',
                class: 'Class 1D',
                scanTime: '2025-02-15T13:15:30',
                checkInTime: '01:15 PM',
                status: 'present',
                scanMethod: 'ID Card',
                device: 'Scanner 02',
                attendanceType: 'Afternoon Check-in'
            },
            {
                id: 12,
                studentId: 'STU012',
                studentName: 'Helen Joyce Mwanga',
                level: 'CSEE',
                stream: 'Stream A',
                class: 'Class 2B',
                scanTime: '2025-02-15T13:20:45',
                checkInTime: '01:20 PM',
                status: 'present',
                scanMethod: 'Fingerprint',
                device: 'Scanner 01',
                attendanceType: 'Afternoon Check-in'
            }
        ];
        // attendanceRecords.value = await AttendanceService.getAttendanceRecords();
    } catch (error) {
        console.error('Failed to load attendance records:', error);
    } finally {
        loading.value = false;
    }
}

// Computed statistics
const stats = computed(() => {
    const total = attendanceRecords.value.length;
    const present = attendanceRecords.value.filter(r => r.status === 'present').length;
    const late = attendanceRecords.value.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.value.filter(r => r.status === 'absent').length;

    return { total, present, late, absent };
});

function openAddDialog() {
    showAddDialog.value = true;
}

function closeForm() {
    showAddDialog.value = false;
}

async function submitAttendance(data) {
    try {
        // await AttendanceService.addAttendance(data);
        await loadAttendanceRecords(); // Refresh the table
    } catch (error) {
        console.error('Failed to submit attendance:', error);
    }
}

function handleView(data) {
    console.log('View attendance record:', data);
    // Implement view logic - maybe show details dialog
}

function handleEdit(data) {
    console.log('Edit attendance record:', data);
    // Implement edit logic - maybe open edit dialog
}

function handleDelete(data) {
    if (confirm(`Are you sure you want to delete attendance record for ${data.studentName}?`)) {
        console.log('Delete attendance record:', data);
        // Implement delete logic
        // await AttendanceService.deleteAttendance(data.id);
        // await loadAttendanceRecords();
    }
}
</script>

<template>
    <!-- Attendance Stats Component -->
    <AttendanceStats
        :total="stats.total"
        :present="stats.present"
        :late="stats.late"
        :absent="stats.absent"
    />

    <!-- Table Card - Hidden when form is visible -->
    <div v-if="!showAddDialog" class="card">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h5 class="mb-2">Student Attendance Roster</h5>
                <span class="text-600">Comprehensive view of all scanned attendance records</span>
            </div>
            <Button
                label="Manual Entry"
                icon="pi pi-plus"
                @click="openAddDialog"
                class="p-button-raised"
            />
        </div>

        <!-- Table Component -->
        <AttendanceTable
            :attendanceRecords="attendanceRecords"
            :loading="loading"
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
        />
    </div>

    <!-- Form Component - Shown when Manual Entry is clicked -->
    <!-- <AttendanceForm
        v-model:visible="showAddDialog"
        @submit="submitAttendance"
        @close="closeForm"
    /> -->

    <!-- Info Section -->
    <div class="card">
        <div class="flex align-items-center">
            <i class="pi pi-info-circle text-600 mr-2"></i>
            <span class="text-sm text-600">
                This roster shows all attendance entries captured through scanning systems. Data is updated in real-time as students scan their ID cards, fingerprints, or other biometric methods.
            </span>
        </div>
    </div>
</template>
