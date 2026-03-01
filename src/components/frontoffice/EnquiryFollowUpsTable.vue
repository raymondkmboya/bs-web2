<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const props = defineProps({
    followUps: {
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
    status: { value: null, matchMode: 'equals' },
    medium_used: { value: null, matchMode: 'equals' },
    created_at: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = {
    'pending': { label: 'Pending', severity: 'warning' },
    'contacted': { label: 'Contacted', severity: 'info' },
    'interested': { label: 'Interested', severity: 'success' },
    'not_interested': { label: 'Not Interested', severity: 'danger' },
    'enrolled': { label: 'Enrolled', severity: 'success' },
    'stop_follow_up': { label: 'Stop Follow Up', severity: 'secondary' }
};

// Medium options
const mediumOptions = {
    'phone': 'Phone Call',
    'email': 'Email',
    'sms': 'SMS',
    'whatsapp': 'WhatsApp',
    'in_person': 'In Person',
    'social_media': 'Social Media'
};

function getStatusLabel(status) {
    return statusOptions[status]?.label || status;
}

function getStatusSeverity(status) {
    return statusOptions[status]?.severity || 'secondary';
}

function getMediumLabel(medium) {
    return mediumOptions[medium] || medium;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        medium_used: { value: null, matchMode: 'equals' },
        created_at: { value: null, matchMode: 'contains' }
    };
}
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <h5 class="m-0">Enquiry Follow Ups</h5>
            <div class="flex gap-2">
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    outlined
                    @click="clearFilter"
                />
            </div>
        </div>

        <DataTable
            :value="followUps"
            :paginator="true"
            :rows="10"
            :loading="loading"
            :filters="filters"
            :globalFilterFields="['message_content', 'notes', 'createdBy.staff.first_name', 'createdBy.staff.last_name']"
            responsiveLayout="scroll"
            stripedRows
            showGridlines
        >
            <!-- ID Column -->
            <Column field="id" header="ID" :sortable="true" style="min-width: 80px">
                <template #body="{ data }">
                    <span class="font-semibold">#{{ data.id }}</span>
                </template>
            </Column>

            <!-- Enquiry ID Column -->
            <Column field="school_enquiry_id" header="Enquiry ID" :sortable="true" style="min-width: 120px">
                <template #body="{ data }">
                    <span class="text-600">#{{ data.school_enquiry_id }}</span>
                </template>
            </Column>

            <!-- Follow Up Date Column -->
            <Column field="follow_up_date" header="Follow Up Date" :sortable="true" style="min-width: 150px">
                <template #body="{ data }">
                    {{ formatDate(data.follow_up_date) }}
                </template>
            </Column>

            <!-- Medium Column -->
            <Column field="medium_used" header="Medium" :sortable="true" style="min-width: 120px">
                <template #body="{ data }">
                    <Tag :value="getMediumLabel(data.medium_used)" severity="info" />
                </template>
            </Column>

            <!-- Status Column -->
            <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                <template #body="{ data }">
                    <Tag
                        :value="getStatusLabel(data.status)"
                        :severity="getStatusSeverity(data.status)"
                    />
                </template>
            </Column>

            <!-- Created By Column -->
            <Column field="createdBy.staff.first_name" header="Created By" :sortable="true" style="min-width: 150px">
                <template #body="{ data }">
                    <span v-if="data.createdBy?.staff">
                        {{ data.createdBy.staff.first_name }} {{ data.createdBy.staff.last_name }}
                    </span>
                    <span v-else class="text-400">N/A</span>
                </template>
            </Column>

            <!-- Next Follow Up Date Column -->
            <Column field="next_follow_up_date" header="Next Follow Up" :sortable="true" style="min-width: 150px">
                <template #body="{ data }">
                    {{ data.next_follow_up_date ? formatDate(data.next_follow_up_date) : 'N/A' }}
                </template>
            </Column>

            <!-- Actions Column -->
            <Column header="Actions" style="min-width: 120px">
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
                        v-tooltip="'Edit Follow Up'"
                        @click="handleEdit(data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text p-button-plain"
                        v-tooltip="'Delete Follow Up'"
                        @click="handleDelete(data)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.text-400 {
    color: #94a3b8;
}

.text-600 {
    color: #495057;
    font-weight: 600;
}
</style>
