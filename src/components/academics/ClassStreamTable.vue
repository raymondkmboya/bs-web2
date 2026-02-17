<script setup>
const props = defineProps({
    streams: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-stream', 'edit-stream', 'delete-stream']);

function getSeverity(stream) {
    // Custom severity based on student count
    if (stream.students > 32) return 'warning';
    if (stream.students < 25) return 'info';
    return 'success';
}

function formatNumber(num) {
    if (num === undefined || num === null || num === 0) {
        return '0';
    }
    return num.toLocaleString();
}
</script>

<template>
    <DataTable
        :value="streams"
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
                <h5 class="m-0">Class Streams</h5>
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
                        <InputText placeholder="Search streams..." />
                    </span>
                </div>
            </div>
        </template>

        <Column field="name" header="Stream Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-sitemap mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.levelName }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="students" header="Students" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <Tag
                        :value="formatNumber(data.students)"
                        :severity="getSeverity(data)"
                        class="mr-2"
                    />
                    <span class="text-600 text-sm">students</span>
                </div>
            </template>
        </Column>

        <Column field="teacher" header="Class Teacher" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-semibold">{{ data.teacher }}</span>
                </div>
            </template>
        </Column>

        <Column field="room" header="Classroom" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-home mr-2"></i>
                    <Tag
                        :value="data.room"
                        severity="info"
                    />
                </div>
            </template>
        </Column>

        <Column field="capacity" header="Capacity Status" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <ProgressBar
                        :value="(data.students / 35) * 100"
                        class="w-6rem mr-2"
                        :show-value="false"
                    />
                    <span class="text-600 text-sm">{{ data.students }}/35</span>
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text mr-2"
                    @click="$emit('edit-stream', data)"
                    v-tooltip="'Edit Stream'"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="$emit('delete-stream', data)"
                    v-tooltip="'Delete Stream'"
                />
            </template>
        </Column>
    </DataTable>
</template>
