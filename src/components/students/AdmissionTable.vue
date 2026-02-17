<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    admissions: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'enroll', 'reject']);
const router = useRouter();

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    email: { value: null, matchMode: 'contains' },
    phone: { value: null, matchMode: 'contains' },
    gender: { value: null, matchMode: 'equals' },
    appliedClass: { value: null, matchMode: 'equals' },
    status: { value: null, matchMode: 'equals' },
    admissionDate: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'Admitted', value: 'admitted' },
    { label: 'Enrolled', value: 'enrolled' },
    { label: 'Pending Enrollment', value: 'pending_enrollment' },
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
        email: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        gender: { value: null, matchMode: 'equals' },
        appliedClass: { value: null, matchMode: 'equals' },
        status: { value: null, matchMode: 'equals' },
        admissionDate: { value: null, matchMode: 'contains' }
    };
}

function getSeverity(status) {
    switch (status) {
        case 'enrolled':
            return 'success';
        case 'admitted':
            return 'info';
        case 'pending_enrollment':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return 'info';
    }
}

function handleView(data) {
    emit('view', data);
    // Navigate to student profile page
    router.push(`/students/profile/${data.id}`);
}

function handleEnroll(data) {
    emit('enroll', data);
}

function handleReject(data) {
    emit('reject', data);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
    <DataTable
        :value="admissions"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['name', 'email', 'phone', 'status', 'admissionDate', 'gender', 'appliedClass']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Admission List</h5>
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
        <template #empty> No admissions found. </template>
        <template #loading> Loading admissions data. Please wait. </template>

        <Column field="name" header="Name" :sortable="true" filterMatchMode="contains">
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

        <Column field="email" header="Email" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by email"
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

        <Column field="appliedClass" header="Applied Class" :sortable="true" filterMatchMode="equals">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="classOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Class"
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
                    placeholder="Any"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.status)" />
            </template>
        </Column>

        <Column field="admissionDate" header="Admission Date" :sortable="true" filterMatchMode="contains">
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
                {{ formatDate(data.admissionDate) }}
            </template>
        </Column>

        <Column header="Actions" style="min-width: 150px">
            <template #body="{ data }">
                <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'View Details'"
                    @click="handleView(data)"
                />
                <Button
                    icon="pi pi-check"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'Enroll Student'"
                    @click="handleEnroll(data)"
                />
                <Button
                    icon="pi pi-times"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Reject Admission'"
                    @click="handleReject(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
