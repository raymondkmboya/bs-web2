<script setup>
import { ref } from 'vue';

const props = defineProps({
    enquiries: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'edit', 'followUp']);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    email: { value: null, matchMode: 'contains' },
    phone: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    source: { value: null, matchMode: 'equals' },
    enquiryDate: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Followed Up', value: 'followed_up' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' }
];

// Source options
const sourceOptions = [
    { label: 'Phone Call', value: 'phone_call' },
    { label: 'Walk In', value: 'walk_in' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Email', value: 'email' },
    { label: 'Website', value: 'website' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        email: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        source: { value: null, matchMode: 'equals' },
        enquiryDate: { value: null, matchMode: 'contains' }
    };
}

function getSeverity(status) {
    switch (status) {
        case 'converted':
            return 'success';
        case 'followed_up':
            return 'info';
        case 'contacted':
            return 'warning';
        case 'lost':
            return 'danger';
        case 'new':
            return 'secondary';
        default:
            return 'info';
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

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
    <DataTable
        :value="enquiries"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['name', 'email', 'phone', 'status', 'enquiryDate', 'source']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Enquiry List</h5>
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
        <template #empty> No enquiries found. </template>
        <template #loading> Loading enquiries data. Please wait. </template>

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

        <Column field="source" header="Source" :sortable="true" filterMatchMode="equals">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="sourceOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any Source"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.status)" />
            </template>
        </Column>

        <Column field="enquiryDate" header="Enquiry Date" :sortable="true" filterMatchMode="contains">
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
                {{ formatDate(data.enquiryDate) }}
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
                    icon="pi pi-phone"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'Follow Up'"
                    @click="handleFollowUp(data)"
                />
                <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Edit Enquiry'"
                    @click="handleEdit(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
