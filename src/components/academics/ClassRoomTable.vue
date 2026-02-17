<script setup>
const props = defineProps({
    rooms: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-room', 'edit-room', 'delete-room']);

function getSeverity(room) {
    // Custom severity based on occupancy
    const occupancyRate = (room.currentOccupancy / room.capacity) * 100;
    if (room.status === 'available') return 'success';
    if (occupancyRate > 90) return 'danger';
    if (occupancyRate > 80) return 'warning';
    return 'info';
}

function getStatusSeverity(status) {
    const statusMap = {
        'occupied': 'warning',
        'available': 'success',
        'maintenance': 'danger'
    };
    return statusMap[status] || 'info';
}

function formatNumber(num) {
    return num.toLocaleString();
}
</script>

<template>
    <DataTable
        :value="rooms"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Class Rooms</h5>
                <div class="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear Filters"
                        class="p-button-outlined"
                        size="small"
                    />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Search rooms..." />
                    </span>
                </div>
            </div>
        </template>

        <Column field="name" header="Room Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-home mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.building }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="capacity" header="Capacity" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">{{ formatNumber(data.capacity) }}</span>
                    <div class="text-600 text-sm">max students</div>
                </div>
            </template>
        </Column>

        <Column field="currentOccupancy" header="Current Occupancy" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <ProgressBar
                        :value="(data.currentOccupancy / data.capacity) * 100"
                        class="w-6rem mr-2"
                        :show-value="false"
                    />
                    <span class="font-semibold">{{ data.currentOccupancy }}</span>
                </div>
            </template>
        </Column>

        <Column field="availableSeats" header="Available Seats" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <Tag
                        :value="formatNumber(data.capacity - data.currentOccupancy)"
                        :severity="getSeverity(data)"
                    />
                </div>
            </template>
        </Column>

        <Column field="floor" header="Floor" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-building mr-2"></i>
                    <span class="font-semibold">{{ data.floor }}</span>
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
                    @click="$emit('edit-room', data)"
                    v-tooltip="'Edit Room'"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="$emit('delete-room', data)"
                    v-tooltip="'Delete Room'"
                />
            </template>
        </Column>
    </DataTable>
</template>
