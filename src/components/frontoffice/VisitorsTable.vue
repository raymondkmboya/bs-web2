<script setup>
const props = defineProps({
    visitors: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-visitor', 'edit-visitor', 'delete-visitor', 'check-out']);

function getStatusSeverity(status) {
    const statusMap = {
        'active': 'warning',
        'completed': 'success',
        'cancelled': 'danger'
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
        :value="visitors" 
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
                    <InputText placeholder="Search visitors..." />
                </span>
            </div>
        </template>

        <Column field="name" header="Visitor Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.phone }}</div>
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

        <Column field="studentName" header="Student/Department" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <span class="text-600">{{ data.studentName || data.department || '--' }}</span>
                </div>
            </template>
        </Column>

        <Column field="visitDate" header="Visit Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.visitDate) }}</span>
                </div>
            </template>
        </Column>

        <Column field="checkIn" header="Check In" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-clock mr-2"></i>
                    <span class="text-600">{{ formatTime(data.checkIn) }}</span>
                </div>
            </template>
        </Column>

        <Column field="checkOut" header="Check Out" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-clock mr-2"></i>
                    <span class="text-600">{{ formatTime(data.checkOut) }}</span>
                </div>
            </template>
        </Column>

        <Column field="idNumber" header="ID Number" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-id-card mr-2"></i>
                    <span class="text-600">{{ data.idNumber }}</span>
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

        <Column header="Actions" :exportable="false" style="min-width: 10rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-visitor', data)"
                    v-tooltip="'Edit Visitor'"
                />
                <Button 
                    v-if="data.status === 'active'"
                    icon="pi pi-sign-out" 
                    class="p-button-rounded p-button-text p-button-success mr-2" 
                    @click="$emit('check-out', data)"
                    v-tooltip="'Check Out'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-visitor', data)"
                    v-tooltip="'Delete Visitor'"
                />
            </template>
        </Column>
    </DataTable>
</template>
