<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-allocation', 'edit-allocation', 'delete-allocation']);

const props = defineProps({
    feeStructures: {
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
        :value="feeStructures" 
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
            <div class="flex justify-between">
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

        <Column field="fee_structure_name" header="Fee Structure" sortable>
            <template #body="{ data }">
                <span class="font-semibold">{{ data.fee_structure_name }}</span>
            </template>
        </Column>

         <Column field="fee_group" header="Fee Group" sortable>
            <template #body="{ data }">
                <span class="font-semibold">{{ data.fee_group.fee_group_name }}</span>
            </template>
        </Column>

        <Column field="streamName" header="Class Level" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.class_level?.class_level_name" 
                    :severity="data.class_level?.class_level_name.includes('Science') ? 'info' : 'warning'"
                />
            </template>
        </Column>

        <Column field="amount" header="Amount (TZS)" sortable>
            <template #body="{ data }">
                <span class="font-bold text-green-600">{{ formatCurrency(data.amount) }}</span>
            </template>
        </Column>

         <Column field="initial_amount" header="Initial Amount (TZS)" sortable>
            <template #body="{ data }">
                <span class="font-bold text-blue-600">{{ formatCurrency(data.initial_amount) }}</span>
            </template>
        </Column>

        <Column field="academic_year" header="Year" sortable>
            <template #body="{ data }">
                <Tag :value="data.academic_year" severity="secondary" />
            </template>
        </Column>

        <Column field="installments" header="Installments" sortable>
            <template #body="{ data }">
                <!-- <span v-if="data.installments" class="text-sm">
                    {{ data.installments }}x
                </span> -->
                <Tag :value="data.installments" severity="secondary" />
                    <!-- <span v-else class="text-600 text-sm">{{ data.installments }}</span> -->
            </template>
        </Column>

        <Column field="admission_month" header="Admission Month" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.admission_month" 
                    :severity="data.admission_month ? 'success' : 'danger'"
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
