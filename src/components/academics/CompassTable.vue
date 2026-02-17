<script setup>
const props = defineProps({
    compass: {
        type: Array,
        default: () => []
    },
    rooms: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-compass', 'edit-compass', 'delete-compass']);

function getStatusSeverity(status) {
    const statusMap = {
        'active': 'success',
        'inactive': 'danger',
        'maintenance': 'warning'
    };
    return statusMap[status] || 'info';
}
</script>

<template>
    <DataTable
        :value="compass"
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
                <h5 class="m-0">Compass</h5>
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
                        <InputText placeholder="Search compass..." />
                    </span>
                </div>
            </div>
        </template>

        <Column field="name" header="Compass Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-compass mr-2"></i>
                    <span class="font-semibold">{{ data.name }}</span>
                </div>
            </template>
        </Column>

        <Column field="description" header="Description" sortable>
            <template #body="{ data }">
                <span class="text-600">{{ data.description }}</span>
            </template>
        </Column>

        <Column field="rooms" header="Assigned Rooms" sortable>
            <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                    <Tag
                        v-for="room in data.rooms"
                        :key="room"
                        :value="room"
                        severity="info"
                        class="mr-1 mb-1"
                    />
                </div>
            </template>
        </Column>

        <Column field="capacity" header="Total Capacity" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-users mr-2"></i>
                    <span class="font-semibold">{{ data.capacity }}</span>
                    <span class="text-600 text-sm ml-1">students</span>
                </div>
            </template>
        </Column>

        <Column field="supervisor" header="Supervisor" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="text-600">{{ data.supervisor }}</span>
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
                    @click="$emit('edit-compass', data)"
                    v-tooltip="'Edit Compass'"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="$emit('delete-compass', data)"
                    v-tooltip="'Delete Compass'"
                />
            </template>
        </Column>
    </DataTable>
</template>
