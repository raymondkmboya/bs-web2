<script setup>
const props = defineProps({
    levels: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-level', 'edit-level', 'delete-level']);

function getSeverity(level) {
    // Custom severity based on student count
    if (level.totalStudents > 120) return 'warning';
    if (level.totalStudents < 100) return 'info';
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
        :value="levels"
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
                <h5 class="m-0">Class Levels</h5>
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
                        <InputText placeholder="Search levels..." />
                    </span>
                </div>
            </div>
        </template>

        <Column field="name" header="Level Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.code }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="description" header="Description" sortable>
            <template #body="{ data }">
                <span class="text-600">{{ data.description }}</span>
            </template>
        </Column>

        <Column field="totalStudents" header="Total Students" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <Tag
                        :value="formatNumber(data.totalStudents)"
                        :severity="getSeverity(data)"
                        class="mr-2"
                    />
                    <span class="text-600 text-sm">students</span>
                </div>
            </template>
        </Column>

        <Column field="streams" header="Streams" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-sitemap mr-2"></i>
                    <span class="font-semibold">{{ data.streams }}</span>
                    <span class="text-600 text-sm ml-1">streams</span>
                </div>
            </template>
        </Column>

        <Column field="avgStudentsPerStream" header="Avg/Stream" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">
                        {{ Math.round(data.totalStudents / data.streams) }}
                    </span>
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text mr-2"
                    @click="$emit('edit-level', data)"
                    v-tooltip="'Edit Level'"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="$emit('delete-level', data)"
                    v-tooltip="'Delete Level'"
                />
            </template>
        </Column>
    </DataTable>
</template>
