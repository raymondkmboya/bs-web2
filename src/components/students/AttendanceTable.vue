<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    attendanceRecords: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'edit', 'delete']);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    studentName: { value: null, matchMode: 'contains' },
    studentId: { value: null, matchMode: 'contains' },
    level: { value: null, matchMode: 'equals' },
    stream: { value: null, matchMode: 'equals' },
    class: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    scanMethod: { value: null, matchMode: 'equals' },
    scanTime: { value: null, matchMode: 'contains' }
});

// Filter options
const levelOptions = [
    { label: 'QT', value: 'QT' },
    { label: 'CSEE', value: 'CSEE' },
    { label: 'ASCEE', value: 'ASCEE' },
    { label: 'English Course', value: 'English Course' },
    { label: 'ECDE', value: 'ECDE' },
    { label: 'Pre Form One', value: 'Pre Form One' }
];

const streamOptions = [
    { label: 'Stream A', value: 'Stream A' },
    { label: 'Stream B', value: 'Stream B' }
];

const statusOptions = [
    { label: 'Present', value: 'present' },
    { label: 'Late', value: 'late' },
    { label: 'Absent', value: 'absent' },
    { label: 'Half Day', value: 'half-day' },
    { label: 'Excused', value: 'excused' }
];

const scanMethodOptions = [
    { label: 'ID Card', value: 'ID Card' },
    { label: 'Fingerprint', value: 'Fingerprint' },
    { label: 'Face Recognition', value: 'Face Recognition' },
    { label: 'QR Code', value: 'QR Code' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        studentName: { value: null, matchMode: 'contains' },
        studentId: { value: null, matchMode: 'contains' },
        level: { value: null, matchMode: 'equals' },
        stream: { value: null, matchMode: 'equals' },
        class: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        scanMethod: { value: null, matchMode: 'equals' },
        scanTime: { value: null, matchMode: 'contains' }
    };
}

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

function getScanMethodIcon(method) {
    const iconMap = {
        'ID Card': 'pi-id-card',
        'Fingerprint': 'pi-fingerprint',
        'Face Recognition': 'pi-eye',
        'QR Code': 'pi-qrcode'
    };
    return iconMap[method] || 'pi-clock';
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

function handleView(data) {
    emit('view', data);
}

function handleEdit(data) {
    emit('edit', data);
}

function handleDelete(data) {
    emit('delete', data);
}

function exportToCSV() {
    const headers = ['Student ID', 'Name', 'Level', 'Stream', 'Class', 'Scan Time', 'Status', 'Method', 'Device'];
    const csvContent = [
        headers.join(','),
        ...props.attendanceRecords.map(record => [
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
    a.download = `attendance_roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}
</script>

<template>
    <DataTable
        :value="attendanceRecords"
        :paginator="true"
        :rows="20"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['studentName', 'studentId', 'level', 'stream', 'class', 'status', 'scanMethod', 'scanTime']"
        showGridlines
        responsiveLayout="scroll"
        scrollHeight="400px"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[10, 20, 50]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Attendance Records ({{ attendanceRecords.length }})</h5>
                <div class="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-download"
                        label="Export CSV"
                        outlined
                        @click="exportToCSV"
                    />
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear"
                        outlined
                        @click="clearFilter"
                    />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Keyword Search"
                        />
                    </IconField>
                </div>
            </div>
        </template>
        <template #empty> No attendance records found. </template>
        <template #loading> Loading attendance data. Please wait. </template>

        <Column field="studentId" header="Student ID" :sortable="true" filterMatchMode="contains" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <InputText 
                    type="text" 
                    v-model="filterModel.value" 
                    @keydown.enter="filterCallback()" 
                    class="p-column-filter" 
                    placeholder="Search by ID"
                />
            </template>
            <template #body="{ data }">
                <span class="font-mono text-sm">{{ data.studentId }}</span>
            </template>
        </Column>

        <Column field="studentName" header="Student Name" :sortable="true" filterMatchMode="contains" style="min-width: 200px">
            <template #filter="{ filterModel, filterCallback }">
                <InputText 
                    type="text" 
                    v-model="filterModel.value" 
                    @keydown.enter="filterCallback()" 
                    class="p-column-filter" 
                    placeholder="Search by name"
                />
            </template>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2 text-600"></i>
                    <span class="font-medium">{{ data.studentName }}</span>
                </div>
            </template>
        </Column>

        <Column field="level" header="Level" :sortable="true" filterMatchMode="equals" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="levelOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Level"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.level" severity="info" />
            </template>
        </Column>

        <Column field="stream" header="Stream" :sortable="true" filterMatchMode="equals" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="streamOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Stream"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.stream" severity="secondary" />
            </template>
        </Column>

        <Column field="class" header="Class" :sortable="true" filterMatchMode="contains" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <InputText 
                    type="text" 
                    v-model="filterModel.value" 
                    @keydown.enter="filterCallback()" 
                    class="p-column-filter" 
                    placeholder="Search by class"
                />
            </template>
            <template #body="{ data }">
                <span class="font-medium">{{ data.class }}</span>
            </template>
        </Column>

        <Column field="scanTime" header="Scan Time" :sortable="true" filterMatchMode="contains" style="min-width: 150px">
            <template #filter="{ filterModel, filterCallback }">
                <InputText 
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by time"
                />
            </template>
            <template #body="{ data }">
                <div class="flex flex-column">
                    <span class="font-medium">{{ data.checkInTime }}</span>
                    <span class="text-xs text-600">{{ formatDateTime(data.scanTime).split(',')[0] }}</span>
                </div>
            </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" filterMatchMode="equals" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="statusOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Status"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag 
                    :value="data.status.toUpperCase()" 
                    :severity="getStatusSeverity(data.status)"
                />
            </template>
        </Column>

        <Column field="scanMethod" header="Method" :sortable="true" filterMatchMode="equals" style="min-width: 120px">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="scanMethodOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Method"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i :class="['pi mr-2', getScanMethodIcon(data.scanMethod)]"></i>
                    <span class="text-sm">{{ data.scanMethod }}</span>
                </div>
            </template>
        </Column>

        <Column field="device" header="Device" :sortable="true" filterMatchMode="contains" style="min-width: 100px">
            <template #filter="{ filterModel, filterCallback }">
                <InputText 
                    type="text" 
                    v-model="filterModel.value" 
                    @keydown.enter="filterCallback()" 
                    class="p-column-filter" 
                    placeholder="Search by device"
                />
            </template>
            <template #body="{ data }">
                <span class="text-sm">{{ data.device }}</span>
            </template>
        </Column>

        <Column header="Actions" style="min-width: 120px" :exportable="false">
            <template #body="{ data }">
                <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'View Details'"
                    @click="handleView(data)"
                />
                <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'Edit Record'"
                    @click="handleEdit(data)"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-plain p-button-danger"
                    v-tooltip="'Delete Record'"
                    @click="handleDelete(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
