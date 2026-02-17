<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-allocation', 'edit-allocation', 'delete-allocation']);

const props = defineProps({
    feeAllocations: {
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

function openAddAllocationDialog() {
    emit('add-allocation');
}

function openEditAllocationDialog(allocation) {
    emit('edit-allocation', allocation);
}

function openDeleteAllocation(allocation) {
    emit('delete-allocation', allocation);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}
</script>

<template>
    <DataTable 
        :value="feeAllocations" 
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
                        placeholder="Search allocations..." 
                    />
                </span>
            </div>
        </template>

        <Column field="feeGroupName" header="Fee Group" sortable>
            <template #body="{ data }">
                <span class="font-semibold">{{ data.feeGroupName }}</span>
            </template>
        </Column>

        <Column field="streamName" header="Stream" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.streamName" 
                    :severity="data.streamName.includes('Science') ? 'info' : 'warning'"
                />
            </template>
        </Column>

        <Column field="amount" header="Amount (TZS)" sortable>
            <template #body="{ data }">
                <span class="font-bold text-green-600">{{ formatCurrency(data.amount) }}</span>
            </template>
        </Column>

        <Column field="academicYear" header="Year" sortable>
            <template #body="{ data }">
                <Tag :value="data.academicYear" severity="secondary" />
            </template>
        </Column>

        <Column field="installments" header="Installments" sortable>
            <template #body="{ data }">
                <span v-if="data.isInstallmentAllowed" class="text-sm">
                    {{ data.maxInstallments }}x
                </span>
                <span v-else class="text-600 text-sm">No</span>
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.isActive ? 'Active' : 'Inactive'" 
                    :severity="data.isActive ? 'success' : 'danger'"
                />
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 6rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-1" 
                    @click="openEditAllocationDialog(data)"
                    v-tooltip="'Edit'"
                    size="small"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="openDeleteAllocation(data)"
                    v-tooltip="'Delete'"
                    size="small"
                />
            </template>
        </Column>
    </DataTable>
</template>
