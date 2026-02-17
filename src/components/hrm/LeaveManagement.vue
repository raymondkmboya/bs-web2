<script setup>
const props = defineProps({
    leaves: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-leave', 'edit-leave', 'delete-leave', 'approve-leave', 'reject-leave']);

function getStatusSeverity(status) {
    const statusMap = {
        'approved': 'success',
        'pending': 'warning',
        'rejected': 'danger',
        'cancelled': 'secondary'
    };
    return statusMap[status] || 'info';
}

function getTypeSeverity(type) {
    const typeMap = {
        'Annual Leave': 'primary',
        'Sick Leave': 'danger',
        'Personal Leave': 'info',
        'Maternity Leave': 'success',
        'Study Leave': 'warning',
        'Emergency Leave': 'danger'
    };
    return typeMap[type] || 'secondary';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}
</script>

<template>
    <DataTable 
        :value="leaves" 
        :paginator="true" 
        :rows="10" 
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-content-between">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear Filters" 
                    class="p-button-outlined" 
                    size="small"
                />
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText placeholder="Search leaves..." />
                </span>
            </div>
        </template>

        <Column field="staffName" header="Staff Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-semibold">{{ data.staffName }}</span>
                </div>
            </template>
        </Column>

        <Column field="type" header="Leave Type" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.type" 
                    :severity="getTypeSeverity(data.type)"
                />
            </template>
        </Column>

        <Column field="dateRange" header="Leave Period" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <div>
                        <span class="text-600">{{ formatDate(data.startDate) }}</span>
                        <div class="text-600 text-sm">to {{ formatDate(data.endDate) }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="days" header="Days" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">{{ data.days }} days</span>
                </div>
            </template>
        </Column>

        <Column field="reason" header="Reason" sortable>
            <template #body="{ data }">
                <span class="text-600">{{ data.reason }}</span>
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.status.toUpperCase()" 
                    :severity="getStatusSeverity(data.status)"
                />
            </template>
        </Column>

        <Column field="approvedBy" header="Approved By" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user-edit mr-2"></i>
                    <span class="text-600">{{ data.approvedBy || '--' }}</span>
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 12rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-leave', data)"
                    v-tooltip="'Edit Leave'"
                />
                <Button 
                    v-if="data.status === 'pending'"
                    icon="pi pi-check" 
                    class="p-button-rounded p-button-text p-button-success mr-2" 
                    @click="$emit('approve-leave', data)"
                    v-tooltip="'Approve Leave'"
                />
                <Button 
                    v-if="data.status === 'pending'"
                    icon="pi pi-times" 
                    class="p-button-rounded p-button-text p-button-danger mr-2" 
                    @click="$emit('reject-leave', data)"
                    v-tooltip="'Reject Leave'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-leave', data)"
                    v-tooltip="'Delete Leave'"
                />
            </template>
        </Column>
    </DataTable>
</template>
