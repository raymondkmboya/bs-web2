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
    user: { value: null, matchMode: 'contains' },
    cost: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    medium: { value: null, matchMode: 'equals' },
    advertDate: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Followed Up', value: 'followed_up' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' }
];

// Medium options
const mediumOptions = [
    { label: 'Phone Call', value: 'phone_call' },
    { label: 'Walk In', value: 'walk_in' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'User', value: 'user' },
    { label: 'Website', value: 'website' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        user: { value: null, matchMode: 'contains' },
        cost: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        medium: { value: null, matchMode: 'equals' },
        advertDate: { value: null, matchMode: 'contains' }
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
        :globalFilterFields="['user', 'cost', 'advertDate', 'medium']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Adverts</h5>
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

        <Column field="medium" header="Medium" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by Medium"
                />
            </template>
        </Column>

        <Column field="cost" header="Cost" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by cost"
                />
            </template>
            <template #body="{ data }">
                TZS {{ data.cost?.toLocaleString() || '0' }}
            </template>
        </Column>

        <Column field="advertDate" header="Advert Date" :sortable="true" filterMatchMode="contains">
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
                {{ formatDate(data.advertDate) }}
            </template>
        </Column>

        <Column field="user" header="User" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by user"
                />
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
                    v-tooltip="'Edit Advert'"
                    @click="handleEdit(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
