<script setup>
import { ref, watch } from 'vue';

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

const emit = defineEmits(['view', 'edit', 'followUp', 'update:expandedRows']);

// Local expanded rows ref
const expandedRows = ref([]);

function expandAll() {
    expandedRows.value = props.enquiries.reduce((acc, e) => (acc[e.id] = true, acc), {});
}

function collapseAll() {
    expandedRows.value = {};
}

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    full_name: { value: null, matchMode: 'contains' },
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
    { label: 'Email', value: 'email' },
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Walk In', value: 'walk_in' },
    { label: 'Referral', value: 'referral' }
];

function getStatusSeverity(status) {
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

function handleRowToggle(event) {
    // Toggle local expanded rows
    if (event.data && expandedRows.value.includes(event.data.id)) {
        // Row is being collapsed - remove from local
        const index = expandedRows.value.indexOf(event.data.id);
        if (index > -1) {
            expandedRows.value.splice(index, 1);
        }
        // Remove follow ups data
        delete event.data.followUps;
    } else if (event.data) {
        // Row is being expanded - add to local
        expandedRows.value.push(event.data.id);
        loadEnquiryFollowUps(event.data.id).then(followUps => {
            event.data.followUps = followUps;
        });
    }
    
    // Emit update to parent
    emit('update:expandedRows', expandedRows.value);
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

// Function to load follow ups for a specific enquiry
async function loadEnquiryFollowUps(enquiryId) {
    try {
        const response = await fetch(`/api/frontoffice/enquiries/${enquiryId}/follow-ups`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data || data;
        } else {
            console.error('Failed to load enquiry follow ups:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Failed to load enquiry follow ups:', error);
        return [];
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        email: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        source: { value: null, matchMode: 'equals' },
        enquiryDate: { value: null, matchMode: 'contains' }
    };
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
        v-model:expandedRows="expandedRows"
        :expandableRows="true"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['full_name', 'email', 'phone', 'status', 'enquiryDate', 'source']"
        showGridlines
        responsiveLayout="scroll"
        :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
        :rowsPerPageOptions="[5, 10, 25]"
        @rowtoggle="handleRowToggle"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Enquiry Lists</h5>
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

        <Column field="full_name" header="Name" :sortable="true" filterMatchMode="contains">
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
                <Tag 
                    :value="data.status" 
                    :severity="getStatusSeverity(data.status)"
                />
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

        <!-- Row Expansion Template for Follow Ups -->
        <template #expansion="slotProps">
            <div class="p-4 bg-gray-50 border-round">
                <div class="flex justify-between items-center mb-3">
                    <h5 class="m-0 text-lg font-semibold text-blue-600">
                        <i class="pi pi-phone mr-2"></i>
                        Follow Ups for {{ slotProps.data.first_name }} {{ slotProps.data.last_name }}
                    </h5>
                    <Button
                        icon="pi pi-plus"
                        label="Add Follow Up"
                        class="p-button-sm p-button-outlined"
                        @click="handleFollowUp(slotProps.data)"
                    />
                </div>

                <!-- Follow Ups List -->
                <div v-if="slotProps.data.followUps && slotProps.data.followUps.length > 0" class="space-y-2">
                    <div 
                        v-for="followUp in slotProps.data.followUps" 
                        :key="followUp.id"
                        class="p-3 bg-white border border-round shadow-sm"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1">
                                <div class="text-sm text-600 mb-1">
                                    <i class="pi pi-calendar mr-1"></i>
                                    {{ formatDate(followUp.follow_up_date) }}
                                </div>
                                <div class="text-sm text-500">
                                    <i class="pi pi-user mr-1"></i>
                                    {{ followUp.createdBy?.staff?.first_name }} {{ followUp.createdBy?.staff?.last_name }}
                                </div>
                                <div v-if="followUp.message_content" class="text-sm text-700 mt-2">
                                    <i class="pi pi-comment mr-1"></i>
                                    {{ followUp.message_content }}
                                </div>
                            </div>
                            <div class="text-right">
                                <Tag 
                                    :value="followUp.status" 
                                    :severity="getStatusSeverity(followUp.status)"
                                    class="text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Follow Ups Message -->
                <div v-else class="text-center text-500 py-4">
                    <i class="pi pi-info-circle text-2xl mb-2"></i>
                    <p>No follow ups recorded yet</p>
                    <Button
                        icon="pi pi-plus"
                        label="Add First Follow Up"
                        class="mt-3"
                        @click="handleFollowUp(slotProps.data)"
                    />
                </div>
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.text-400 {
    color: #94a3b8;
}

.text-500 {
    color: #495057;
    font-weight: 600;
}

.text-600 {
    color: #495057;
    font-weight: 600;
}

.text-700 {
    color: #343a40;
    font-weight: 700;
}
</style>
