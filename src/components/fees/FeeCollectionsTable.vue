<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-payment', 'view-receipt']);

const props = defineProps({
    feeCollections: {
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

function openPaymentDialog(data) {
    emit('add-payment', data);
}

function openReceiptDialog(data) {
    emit('view-receipt', data);
}

function getSeverity(status) {
    const severityMap = {
        'paid': 'success',
        'partial': 'warning',
        'pending': 'info',
        'overdue': 'danger'
    };
    return severityMap[status] || 'info';
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
        :value="feeCollections" 
        :paginator="true" 
        :rows="10" 
        dataKey="id"
        :loading="loading"
        :filters="filters"
        :globalFilterFields="globalFilterFields"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-content-between">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear" 
                    class="p-button-outlined" 
                    @click="clearFilter()"
                />
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText 
                        v-model="filters.global.value" 
                        placeholder="Search collections..." 
                    />
                </span>
            </div>
        </template>

        <Column field="studentName" header="Student Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-semibold">{{ data.studentName }}</span>
                </div>
            </template>
        </Column>

        <Column field="feeGroupName" header="Fee Group" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.feeGroupName" 
                    :severity="data.feeGroupName.includes('Tuition') ? 'primary' : 'secondary'"
                />
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

        <Column field="totalAmount" header="Total Amount" sortable>
            <template #body="{ data }">
                <span class="font-bold text-blue-600">{{ formatCurrency(data.totalAmount) }}</span>
            </template>
        </Column>

        <Column field="totalPaid" header="Paid Amount" sortable>
            <template #body="{ data }">
                <span class="font-bold text-green-600">{{ formatCurrency(data.totalPaid) }}</span>
            </template>
        </Column>

        <Column field="balance" header="Balance" sortable>
            <template #body="{ data }">
                <span 
                    :class="data.balance > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'"
                >
                    {{ formatCurrency(data.balance) }}
                </span>
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.status.toUpperCase()" 
                    :severity="getSeverity(data.status)"
                />
            </template>
        </Column>

        <Column field="lastPaymentDate" header="Last Payment" sortable>
            <template #body="{ data }">
                {{ data.lastPaymentDate ? new Date(data.lastPaymentDate).toLocaleDateString() : '-' }}
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-money-bill" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="openPaymentDialog(data)"
                    v-tooltip="'Add Payment'"
                    :disabled="data.balance <= 0"
                />
                <Button 
                    icon="pi pi-receipt" 
                    class="p-button-rounded p-button-text p-button-info" 
                    @click="openReceiptDialog(data)"
                    v-tooltip="'View Receipt'"
                />
            </template>
        </Column>
    </DataTable>
</template>
