<script setup>
const props = defineProps({
    appointments: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-appointment', 'edit-appointment', 'delete-appointment']);

function getStatusSeverity(status) {
    const statusMap = {
        'scheduled': 'info',
        'completed': 'success',
        'cancelled': 'danger',
        'rescheduled': 'warning'
    };
    return statusMap[status] || 'info';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(timeString) {
    return timeString || '--:--';
}
</script>

<template>
    <DataTable 
        :value="appointments" 
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
                    <InputText placeholder="Search appointments..." />
                </span>
            </div>
        </template>

        <Column field="title" header="Appointment Title" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span class="font-semibold">{{ data.title }}</span>
                </div>
            </template>
        </Column>

        <Column field="visitorName" header="Visitor Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.visitorName }}</span>
                        <div class="text-600 text-sm">{{ data.contactPhone }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="purpose" header="Purpose" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle mr-2"></i>
                    <span class="text-600">{{ data.purpose }}</span>
                </div>
            </template>
        </Column>

        <Column field="appointmentDate" header="Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.appointmentDate) }}</span>
                </div>
            </template>
        </Column>

        <Column field="appointmentTime" header="Time" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-clock mr-2"></i>
                    <span class="text-600">{{ formatTime(data.appointmentTime) }}</span>
                </div>
            </template>
        </Column>

        <Column field="staffName" header="Staff" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user-edit mr-2"></i>
                    <span class="text-600">{{ data.staffName }}</span>
                </div>
            </template>
        </Column>

        <Column field="location" header="Location" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-map-marker mr-2"></i>
                    <span class="text-600">{{ data.location }}</span>
                </div>
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

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-appointment', data)"
                    v-tooltip="'Edit Appointment'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-appointment', data)"
                    v-tooltip="'Delete Appointment'"
                />
            </template>
        </Column>
    </DataTable>
</template>
