<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-group', 'edit-group', 'delete-group']);

const props = defineProps({
    feeGroups: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    filters: {
        type: Object,
        default: () => ({})
    },
    globalFilterFields: {
        type: Array,
        default: () => []
    }
});

function clearFilter() {
    emit('clear-filter');
}

function openAddGroupDialog() {
    emit('add-group');
}

function openEditGroupDialog(group) {
    emit('edit-group', group);
}

function openDeleteGroup(group) {
    emit('delete-group', group);
}

function getSeverity(status) {
    return status ? 'success' : 'danger';
}

function getTypeLabel(type) {
    const typeMap = {
        'mandatory': 'Mandatory',
        'optional': 'Optional',
        'one_time': 'One-time'
    };
    return typeMap[type] || type;
}
</script>

<template>
    <DataTable 
        :value="feeGroups" 
        :paginator="true" 
        :rows="5" 
        dataKey="id"
        :loading="loading"
        :filters="filters"
        :globalFilterFields="globalFilterFields"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        size="small"
    >
        <template #header>
            <div class="flex justify-content-between">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear" 
                    class="p-button-outlined" 
                    @click="clearFilter()"
                    size="small"
                />
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText 
                        v-model="filters.global.value" 
                        placeholder="Search fee groups..." 
                    />
                </span>
            </div>
        </template>

        <Column field="name" header="Fee Group Name" sortable>
            <template #body="{ data }">
                <span class="font-semibold">{{ data.name }}</span>
            </template>
        </Column>

        <Column field="type" header="Type" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="getTypeLabel(data.type)" 
                    :severity="data.type === 'mandatory' ? 'danger' : data.type === 'optional' ? 'warning' : 'info'"
                />
            </template>
        </Column>

        <Column field="description" header="Description">
            <template #body="{ data }">
                <span class="text-600 text-sm">{{ data.description || '-' }}</span>
            </template>
        </Column>

        <Column field="isActive" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.isActive ? 'Active' : 'Inactive'" 
                    :severity="getSeverity(data.isActive)"
                />
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 6rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-1" 
                    @click="openEditGroupDialog(data)"
                    v-tooltip="'Edit'"
                    size="small"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="openDeleteGroup(data)"
                    v-tooltip="'Delete'"
                    size="small"
                />
            </template>
        </Column>
    </DataTable>
</template>
