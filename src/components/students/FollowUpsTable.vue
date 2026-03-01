<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    registrationFollowups: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'followUp', 'scheduleNext']);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    student_name: { value: null, matchMode: 'contains' },
    medium_used: { value: null, matchMode: 'equals' },
    status: { value: null, matchMode: 'equals' },
    follow_up_date: { value: null, matchMode: 'contains' },
    next_follow_up_date: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Interested', value: 'interested' },
    { label: 'Not Interested', value: 'not_interested' },
    { label: 'Enrolled', value: 'enrolled' },
    { label: 'Stop Follow-up', value: 'stop_follow_up' }
];

const mediumOptions = [
    { label: 'Phone Call', value: 'phone' },
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'In Person', value: 'in_person' },
    { label: 'Social Media', value: 'social_media' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        student_name: { value: null, matchMode: 'contains' },
        medium_used: { value: null, matchMode: 'equals' },
        status: { value: null, matchMode: 'equals' },
        follow_up_date: { value: null, matchMode: 'contains' },
        next_follow_up_date: { value: null, matchMode: 'contains' }
    };
}

function getSeverity(status) {
    switch (status) {
        case 'enrolled':
            return 'success';
        case 'contacted':
            return 'info';
        case 'pending':
            return 'warning';
        case 'not_interested':
            return 'danger';
        case 'interested':
            return 'success';
        case 'stop_follow_up':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function handleView(data) {
    emit('view', data);
}

function handleNextFollowUp(data) {
    emit('followUp', data);
}

function handleScheduleNext(data) {
    emit('scheduleNext', data);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
    <DataTable
        :value="registrationFollowups"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['student.first_name', 'student.last_name', 'medium_used', 'status', 'follow_up_date', 'next_follow_up_date']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Follow-ups List</h5>
                <div class="flex gap-2">
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
        <template #empty> No follow-ups found. </template>
        <template #loading> Loading follow-ups data. Please wait. </template>

        <Column field="student.first_name" header="Student Name" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                {{ data.student?.first_name }} {{ data.student?.last_name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by student name"
                />
            </template>
        </Column>

        <Column field="student.phone" header="Phone" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                {{ data.student?.phone }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by phone"
                />
            </template>
        </Column>

        <Column field="follow_up_date" header="Follow-up Date" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                {{ formatDate(data.follow_up_date) }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by date (YYYY-MM-DD)"
                />
            </template>
        </Column>

        <Column field="medium_used" header="Contact Method" :sortable="true" filterMatchMode="equals">
            <template #body="{ data }">
                <Tag :value="data.medium_used.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.medium_used)" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="mediumOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Method"
                    class="p-column-filter"
                    showClear
                />
            </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" filterMatchMode="equals">
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
                <Tag :value="data.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.status)" />
            </template>
        </Column>

        <Column field="next_follow_up_date" header="Next Follow-up" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                <span v-if="data.next_follow_up_date" class="text-blue-600 font-medium">
                    {{ formatDate(data.next_follow_up_date) }}
                </span>
                <span v-else class="text-gray-500">Not scheduled</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by date (YYYY-MM-DD)"
                />
            </template>
        </Column>

        <Column header="Actions" style="min-width: 200px">
            <template #body="{ data }">
                <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'View Details'"
                    @click="handleView(data)"
                />
                <Button
                    icon="pi pi-phone"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Follow Up Again'"
                    @click="handleNextFollowUp(data)"
                />
                <Button
                    icon="pi pi-calendar-plus"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Schedule Next'"
                    @click="handleScheduleNext(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
