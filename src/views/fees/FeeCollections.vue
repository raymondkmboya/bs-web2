<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';
import PaymentForm from '@/components/fees/PaymentForm.vue';
import ReceiptDialog from '@/components/fees/ReceiptDialog.vue';
import FeeCollectionsTable from '@/components/fees/FeeCollectionsTable.vue';
import FeeCollectionsStats from '@/components/fees/FeeCollectionsStats.vue';

const feeCollections = ref([]);
const loading = ref(false);
const showPaymentDialog = ref(false);
const showReceiptDialog = ref(false);
const selectedPayment = ref(null);
const editingPayment = ref(null);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    studentName: { value: null, matchMode: 'contains' },
    feeGroupName: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    paymentMethod: { value: null, matchMode: 'equals' }
});

const globalFilterFields = ['studentName', 'feeGroupName', 'status', 'paymentMethod'];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        studentName: { value: null, matchMode: 'contains' },
        feeGroupName: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        paymentMethod: { value: null, matchMode: 'equals' }
    };
}

function openPaymentDialog(payment = null) {
    editingPayment.value = payment;
    showPaymentDialog.value = true;
}

function closePaymentDialog() {
    showPaymentDialog.value = false;
    editingPayment.value = null;
}

function openReceiptDialog(payment) {
    selectedPayment.value = payment;
    showReceiptDialog.value = true;
}

function closeReceiptDialog() {
    showReceiptDialog.value = false;
    selectedPayment.value = null;
}

async function handleSavePayment(paymentData) {
    try {
        loading.value = true;
        await RegistrationService.createFeePayment(paymentData);
        await loadFeeCollections();
        closePaymentDialog();
    } catch (error) {
        console.error('Failed to save payment:', error);
    } finally {
        loading.value = false;
    }
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

async function loadFeeCollections() {
    try {
        loading.value = true;
        feeCollections.value = await RegistrationService.getFeeCollections();
    } catch (error) {
        console.error('Failed to load fee collections:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadFeeCollections();
});
</script>

<template>
    <!-- Fee Collections Stats Component -->
    <FeeCollectionsStats />

    <!-- Fee Collections Header and Table -->
    <div class="card mb-6">
        <div class="flex justify-content-between align-items-center mb-5">
            <div>
                <h5 class="mb-2">Fee Collections</h5>
                <span class="text-600">Track fee payments and collections from students</span>
            </div>
            <Button
                label="Record Payment"
                icon="pi pi-plus"
                @click="openPaymentDialog()"
                class="p-button-outlined"
            />
        </div>

        <!-- Fee Collections Table Component -->
        <FeeCollectionsTable
            :fee-collections="feeCollections"
            :loading="loading"
            :filters="filters"
            :global-filter-fields="globalFilterFields"
            @clear-filter="clearFilter"
            @add-payment="openPaymentDialog"
            @view-receipt="openReceiptDialog"
        />
    </div>

    <!-- Payment Form Component -->
    <PaymentForm
        :visible="showPaymentDialog"
        :payment="editingPayment"
        @save="handleSavePayment"
        @cancel="closePaymentDialog"
    />

    <!-- Receipt Dialog Component -->
    <ReceiptDialog
        :visible="showReceiptDialog"
        :payment="selectedPayment"
        @close="closeReceiptDialog"
    />
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.receipt-content {
    padding: 1rem;
}

@media print {
    .receipt-content {
        padding: 2rem;
    }

    .p-dialog-header,
    .p-dialog-footer {
        display: none !important;
    }
}
</style>
