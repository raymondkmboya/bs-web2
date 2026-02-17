<script setup>
const props = defineProps({
    departments: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-department', 'edit-department', 'delete-department']);

function getStatusSeverity(status) {
    const statusMap = {
        'active': 'success',
        'inactive': 'danger',
        'suspended': 'warning'
    };
    return statusMap[status] || 'info';
}

function formatBudget(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}
</script>

<template>
    <DataTable 
        :value="departments" 
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
                    <InputText placeholder="Search departments..." />
                </span>
            </div>
        </template>

        <Column field="name" header="Department Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-building mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.description }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="head" header="Department Head" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="text-600">{{ data.head }}</span>
                </div>
            </template>
        </Column>

        <Column field="totalStaff" header="Total Staff" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-users mr-2"></i>
                    <Tag 
                        :value="data.totalStaff" 
                        severity="info"
                        class="mr-2"
                    />
                    <span class="text-600 text-sm">staff</span>
                </div>
            </template>
        </Column>

        <Column field="budget" header="Budget" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-money-bill mr-2"></i>
                    <span class="font-semibold text-green-600">{{ formatBudget(data.budget) }}</span>
                </div>
            </template>
        </Column>

        <Column field="avgBudgetPerStaff" header="Budget/Staff" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">
                        {{ formatBudget(Math.round(data.budget / data.totalStaff)) }}
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
                    @click="$emit('edit-department', data)"
                    v-tooltip="'Edit Department'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-department', data)"
                    v-tooltip="'Delete Department'"
                />
            </template>
        </Column>
    </DataTable>
</template>
