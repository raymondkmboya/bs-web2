<script setup>
import { ref, onMounted, computed } from 'vue';

const loading = ref(false);
const attendanceRecords = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedLevel = ref(null);
const selectedStream = ref(null);
const searchTerm = ref('');

const levels = [
    { label: 'All Levels', value: null },
    { label: 'QT', value: 'QT' },
    { label: 'CSEE', value: 'CSEE' },
    { label: 'ASCEE', value: 'ASCEE' },
    { label: 'English Course', value: 'English Course' },
    { label: 'ECDE', value: 'ECDE' },
    { label: 'Pre Form One', value: 'Pre Form One' }
];

const streams = [
    { label: 'All Streams', value: null },
    { label: 'Stream A', value: 'Stream A' },
    { label: 'Stream B', value: 'Stream B' }
];

// Mock data for scanned attendance records
onMounted(() => {
    loadAttendanceRecords();
});

async function loadAttendanceRecords() {
    try {
        loading.value = true;
        
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
    } catch (error) {
        console.error('Failed to load attendance records:', error);
    } finally {
        loading.value = false;
    }
}

// Computed filtered records
const filteredRecords = computed(() => {
    let filtered = attendanceRecords.value;
    
    // Filter by date
    if (selectedDate.value) {
        filtered = filtered.filter(record => 
            record.scanTime.startsWith(selectedDate.value)
        );
    }
    
    // Filter by level
    if (selectedLevel.value) {
        filtered = filtered.filter(record => record.level === selectedLevel.value);
    }
    
    // Filter by stream
    if (selectedStream.value) {
        filtered = filtered.filter(record => record.stream === selectedStream.value);
    }
    
    // Filter by search term
    if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(record => 
            record.studentName.toLowerCase().includes(search) ||
            record.studentId.toLowerCase().includes(search) ||
            record.class.toLowerCase().includes(search)
        );
    }
    
    return filtered;
});

// Statistics
const stats = computed(() => {
    const total = filteredRecords.value.length;
    const present = filteredRecords.value.filter(r => r.status === 'present').length;
    const late = filteredRecords.value.filter(r => r.status === 'late').length;
    const absent = filteredRecords.value.filter(r => r.status === 'absent').length;
    
    return { total, present, late, absent };
});

function getStatusSeverity(status) {
    const statusMap = {
        'present': 'success',
        'absent': 'danger',
        'late': 'warning',
        'half-day': 'info',
        'excused': 'secondary'
    };
    return statusMap[status] || 'info';
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-TZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getScanMethodIcon(method) {
    const iconMap = {
        'ID Card': 'pi-id-card',
        'Fingerprint': 'pi-fingerprint',
        'Face Recognition': 'pi-eye',
        'QR Code': 'pi-qrcode'
    };
    return iconMap[method] || 'pi-clock';
}

function exportToCSV() {
    // CSV export functionality
    const headers = ['Student ID', 'Name', 'Level', 'Stream', 'Class', 'Scan Time', 'Status', 'Method', 'Device'];
    const csvContent = [
        headers.join(','),
        ...filteredRecords.value.map(record => [
            record.studentId,
            record.studentName,
            record.level,
            record.stream,
            record.class,
            formatDateTime(record.scanTime),
            record.status,
            record.scanMethod,
            record.device
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_roster_${selectedDate.value}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function clearFilters() {
    selectedDate.value = new Date().toISOString().split('T')[0];
    selectedLevel.value = null;
    selectedStream.value = null;
    searchTerm.value = '';
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <div>
                        <h5 class="mb-2">Student Attendance Roster</h5>
                        <span class="text-600">Comprehensive view of all scanned attendance records</span>
                    </div>
                    <div class="flex gap-2">
                        <Button 
                            label="Export CSV" 
                            icon="pi pi-download" 
                            @click="exportToCSV"
                            class="p-button-outlined"
                        />
                        <Button 
                            label="Clear Filters" 
                            icon="pi pi-filter-slash" 
                            @click="clearFilters"
                            class="p-button-outlined"
                        />
                    </div>
                </div>

                <!-- Statistics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                    <div class="card text-center">
                        <div class="text-4xl font-bold text-blue-500">{{ stats.total }}</div>
                        <div class="text-600">Total Scans</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-4xl font-bold text-green-500">{{ stats.present }}</div>
                        <div class="text-600">Present</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-4xl font-bold text-orange-500">{{ stats.late }}</div>
                        <div class="text-600">Late</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-4xl font-bold text-red-500">{{ stats.absent }}</div>
                        <div class="text-600">Absent</div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                    <div class="flex flex-column">
                        <label for="date-filter" class="mb-2">Date</label>
                        <Calendar 
                            id="date-filter" 
                            v-model="selectedDate" 
                            dateFormat="yy-mm-dd"
                            :showIcon="true"
                        />
                    </div>
                    <div class="flex flex-column">
                        <label for="level-filter" class="mb-2">Level</label>
                        <Dropdown 
                            id="level-filter" 
                            v-model="selectedLevel" 
                            :options="levels" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select Level"
                        />
                    </div>
                    <div class="flex flex-column">
                        <label for="stream-filter" class="mb-2">Stream</label>
                        <Dropdown 
                            id="stream-filter" 
                            v-model="selectedStream" 
                            :options="streams" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select Stream"
                        />
                    </div>
                    <div class="flex flex-column">
                        <label for="search" class="mb-2">Search</label>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText 
                                id="search" 
                                v-model="searchTerm" 
                                placeholder="Student name, ID, or class..."
                            />
                        </span>
                    </div>
                </div>

                <!-- Attendance Table -->
                <DataTable 
                    :value="filteredRecords" 
                    :paginator="true" 
                    :rows="20" 
                    dataKey="id"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    showGridlines
                    scrollHeight="400px"
                >
                    <template #header>
                        <div class="flex justify-content-between align-items-center">
                            <span class="font-semibold">Attendance Records ({{ filteredRecords.length }})</span>
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-info-circle text-600"></i>
                                <span class="text-sm text-600">Real-time scanned attendance data</span>
                            </div>
                        </div>
                    </template>

                    <Column field="studentId" header="Student ID" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <span class="font-mono text-sm">{{ data.studentId }}</span>
                        </template>
                    </Column>

                    <Column field="studentName" header="Student Name" sortable style="min-width: 200px">
                        <template #body="{ data }">
                            <div class="flex align-items-center">
                                <i class="pi pi-user mr-2 text-600"></i>
                                <span class="font-medium">{{ data.studentName }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="level" header="Level" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <Tag :value="data.level" severity="info" />
                        </template>
                    </Column>

                    <Column field="stream" header="Stream" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <Tag :value="data.stream" severity="secondary" />
                        </template>
                    </Column>

                    <Column field="class" header="Class" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.class }}</span>
                        </template>
                    </Column>

                    <Column field="scanTime" header="Scan Time" sortable style="min-width: 150px">
                        <template #body="{ data }">
                            <div class="flex flex-column">
                                <span class="font-medium">{{ data.checkInTime }}</span>
                                <span class="text-xs text-600">{{ formatDateTime(data.scanTime).split(',')[0] }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="status" header="Status" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <Tag 
                                :value="data.status.toUpperCase()" 
                                :severity="getStatusSeverity(data.status)"
                            />
                        </template>
                    </Column>

                    <Column field="scanMethod" header="Method" sortable style="min-width: 120px">
                        <template #body="{ data }">
                            <div class="flex align-items-center">
                                <i :class="['pi mr-2', getScanMethodIcon(data.scanMethod)]"></i>
                                <span class="text-sm">{{ data.scanMethod }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="device" header="Device" sortable style="min-width: 100px">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.device }}</span>
                        </template>
                    </Column>

                    <Column field="attendanceType" header="Type" sortable style="min-width: 140px">
                        <template #body="{ data }">
                            <Tag :value="data.attendanceType" severity="info" />
                        </template>
                    </Column>
                </DataTable>

                <!-- Footer Info -->
                <div class="mt-4 pt-4 border-t border-surface">
                    <div class="text-sm text-muted-color">
                        <i class="pi pi-info-circle mr-2"></i>
                        This roster shows all attendance entries captured through scanning systems. Data is updated in real-time as students scan their ID cards, fingerprints, or other biometric methods.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 768px) {
    .grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
