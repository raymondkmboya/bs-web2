<script setup>
const props = defineProps({
    gradingScales: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-scale', 'edit-scale', 'delete-scale', 'toggle-scale']);

function getTypeSeverity(type) {
    const typeMap = {
        'O-Level': 'primary',
        'A-Level': 'success',
        'CSEE': 'warning',
        'Primary': 'info'
    };
    return typeMap[type] || 'secondary';
}

function getStatusSeverity(isActive) {
    return isActive ? 'success' : 'danger';
}
</script>

<template>
    <DataTable 
        :value="gradingScales" 
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
                    <InputText placeholder="Search grading scales..." />
                </span>
            </div>
        </template>

        <Column field="name" header="Scale Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-chart-bar mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.type }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="description" header="Description" sortable>
            <template #body="{ data }">
                <span class="text-600">{{ data.description }}</span>
            </template>
        </Column>

        <Column field="type" header="Type" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.type" 
                    :severity="getTypeSeverity(data.type)"
                />
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                    <Tag 
                        :value="data.isActive ? 'ACTIVE' : 'INACTIVE'" 
                        :severity="getStatusSeverity(data.isActive)"
                    />
                    <Button 
                        :icon="data.isActive ? 'pi pi-pause' : 'pi pi-play'"
                        class="p-button-rounded p-button-text"
                        :class="data.isActive ? 'p-button-warning' : 'p-button-success'"
                        @click="$emit('toggle-scale', data)"
                        v-tooltip="data.isActive ? 'Deactivate' : 'Activate'"
                    />
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-scale', data)"
                    v-tooltip="'Edit Scale'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-scale', data)"
                    v-tooltip="'Delete Scale'"
                />
            </template>
        </Column>
    </DataTable>
</template>
