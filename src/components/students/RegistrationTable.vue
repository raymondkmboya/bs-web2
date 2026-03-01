<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    registrations: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'edit', 'followUp', 'admit']);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    phone: { value: null, matchMode: 'contains' },
    gender: { value: null, matchMode: 'equals' },
    status: { value: null, matchMode: 'equals' },
    registration_date: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'Registered', value: 'registered' },
    { label: 'Followed Up', value: 'followed_up' },
    { label: 'Not Followed Up', value: 'not_followed_up' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
];

const classOptions = [
    { label: 'Form 1', value: 'Form 1' },
    { label: 'Form 2', value: 'Form 2' },
    { label: 'Form 3', value: 'Form 3' },
    { label: 'Form 4', value: 'Form 4' },
    { label: 'Form 5', value: 'Form 5' },
    { label: 'Form 6', value: 'Form 6' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        gender: { value: null, matchMode: 'equals' },
        status: { value: null, matchMode: 'equals' },
        registration_date: { value: null, matchMode: 'contains' }
    };
}

function getSeverity(status) {
    switch (status) {
        case 'approved':
            return 'success';
        case 'followed_up':
            return 'info';
        case 'not_followed_up':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return 'secondary';
    }
}

function handleView(data) {
    emit('view', data);
}

function handleEdit(data) {
    emit('edit', data);
}

function handleFollowUp(data) {
    emit('followUp', data);
}

function handlePrintRegistration(data) {
    // Open the backend registration form URL using environment variable
    const apiUrl = `${import.meta.env.VITE_API_URL}/students/${data.id}/print-registration-form`;

    window.open(apiUrl, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
}

function handleAdmit(data) {
    emit('admit', data);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
    <DataTable
        :value="registrations"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['first_name', 'middle_name', 'last_name', 'phone', 'gender', 'status', 'registration_date', 'parent.parent_name', 'parent.parent_phone', 'class_level.class_level_name']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Registration List</h5>
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
        <template #empty> No registrations found. </template>
        <template #loading> Loading registrations data. Please wait. </template>

        <Column field="first_name" header="Name" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                {{ data.first_name }} {{ data.middle_name }} {{ data.last_name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by name"
                />
            </template>
        </Column>

        <Column field="phone" header="Phone" :sortable="true" filterMatchMode="contains">
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

        <Column field="gender" header="Gender" :sortable="true" filterMatchMode="equals">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="genderOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Gender"
                    class="p-column-filter"
                    showClear
                />
            </template>
        </Column>

        <Column field="class_level.class_level_name" header="Class Level" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by class level"
                />
            </template>
        </Column>

        <Column field="parent.parent_name" header="Parent Name" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by parent name"
                />
            </template>
        </Column>

        <Column field="parent.parent_phone" header="Parent Phone" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by parent phone"
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
                    placeholder="Any"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.status)" />
            </template>
        </Column>

        <Column field="registration_date" header="Registration Date" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by date (YYYY-MM-DD)"
                />
            </template>
            <template #body="{ data }">
                {{ formatDate(data.registration_date) }}
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
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Edit'"
                    @click="handleEdit(data)"
                />
                <Button
                    icon="pi pi-phone"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Follow Up'"
                    @click="handleFollowUp(data)"
                />
                <Button
                    icon="pi pi-print"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Print Registration Form'"
                    @click="handlePrintRegistration(data)"
                />
                <Button
                    icon="pi pi-check"
                    class="p-button-rounded p-button-text p-button-plain p-button-success"
                    v-tooltip="'Admit Student'"
                    @click="handleAdmit(data)"
                    v-if="data.status === 'registered'"
                />
            </template>
        </Column>
    </DataTable>
</template>
