<script setup>
const props = defineProps({
    attendance: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-attendance', 'edit-attendance', 'delete-attendance']);

function getStatusSeverity(status) {
    const statusMap = {
        'present': 'success',
        'absent': 'danger',
        'late': 'warning',
        'half-day': 'info',
        'holiday': 'secondary'
    };
    return statusMap[status] || 'info';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function calculateWorkingHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '0:00';
    
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function formatTime(timeString) {
    return timeString || '--:--';
}
</script>

<template>
    <DataTable 
        :value="attendance" 
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
                    <InputText placeholder="Search attendance..." />
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

        <Column field="date" header="Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.date) }}</span>
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

        <Column field="workingHours" header="Working Hours" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">
                        {{ calculateWorkingHours(data.checkIn, data.checkOut) }}
                    </span>
                </div>
            </template>
        </Column>

        <Column field="overtime" header="Overtime" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span 
                        class="font-bold"
                        :class="data.overtime > 0 ? 'text-orange-600' : 'text-gray-600'"
                    >
                        {{ data.overtime > 0 ? `+${data.overtime} min` : '0 min' }}
                    </span>
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
                    @click="$emit('edit-attendance', data)"
                    v-tooltip="'Edit Attendance'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-attendance', data)"
                    v-tooltip="'Delete Attendance'"
                />
            </template>
        </Column>
    </DataTable>
</template>
