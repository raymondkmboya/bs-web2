<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';

const props = defineProps({
    payments: {
        type: Array,
        default: () => []
    },
    transactions: {
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

const emit = defineEmits(['add-transaction', 'view-bank-receipt', 'print-system-receipt', 'clear-filter', 'approve-transaction', 'reject-transaction']);

const expandedRows = ref([]);

// Restructure payments data for hierarchical display
const restructuredPayments = computed(() => {
    if (!props.payments || props.payments.length === 0) return [];

    return props.payments.map(payment => {
        const amount = payment.fee_structure ? parseFloat(payment.fee_structure.amount) : 0;
        const amountPaid = payment.transactions ? payment.transactions.reduce((sum, txn) => {
            return sum + (txn.verification_status === 'approved' ? parseFloat(txn.amount_paid) : 0);
        }, 0) : 0;
        const balance = amount - amountPaid;

        // Calculate status based on payment amount vs balance
        let status = 'unpaid';
        if (amountPaid > 0 && balance > 0) {
            status = 'partial';
        } else if (balance <= 0) {
            status = 'paid';
        }

        return {
            id: payment.id,
            invoice_number: payment.invoice_number,
            fee_group_name: payment.fee_structure?.fee_group?.fee_group_name || 'Unknown Fee Type',
            amount: amount,
            amount_paid: amountPaid,
            balance: balance,
            status: status,
            created_at: payment.created_at,
            transactions: payment.transactions || []
        };
    });
});

// Get status severity for Tag component
const getSeverity = (status) => {
    switch (status) {
        case 'paid':
            return 'success';
        case 'partial':
            return 'warning';
        case 'unpaid':
            return 'danger';
        default:
            return 'info';
    }
};

// Get status display text
const getStatusText = (status) => {
    switch (status) {
        case 'paid':
            return 'Fully Paid';
        case 'partial':
            return 'Partial';
        case 'unpaid':
            return 'Unpaid';
        default:
            return status;
    }
};

// Get transaction status severity
const getTransactionSeverity = (status) => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return 'info';
    }
};

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS'
    }).format(value);
};

// Format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Expand/Collapse functions
const expandAll = () => {
    expandedRows.value = restructuredPayments.value.reduce((acc, p) => {
        acc[p.id] = true;
        return acc;
    }, {});
};

const collapseAll = () => {
    expandedRows.value = {};
};

const clearFilter = () => {
    emit('clear-filter');
};

// Handle add transaction
const handleAddTransaction = (paymentData) => {
    emit('add-transaction', paymentData);
};

// Handle approve transaction
const handleApproveTransaction = (transactionData) => {
    emit('approve-transaction', transactionData);
};

// Handle reject transaction
const handleRejectTransaction = (transactionData) => {
    emit('reject-transaction', transactionData);
};

// Handle view bank receipt
const handleViewBankReceipt = (transactionData) => {
    emit('view-bank-receipt', transactionData);
};

// Handle print system receipt
const handlePrintSystemReceipt = (transactionData) => {
    emit('print-system-receipt', transactionData);
};
</script>

<template>
    <DataTable
        :value="restructuredPayments"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :loading="loading"
        :filters="props.filters"
        :globalFilterFields="props.globalFilterFields"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        v-model:expandedRows="expandedRows"
        tableStyle="min-width: 60rem"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="mb-3">
                    <h5 class="mb-2">Payment Invoices & Transactions</h5>
                    <span class="text-600">Manage payment invoices and view transactions</span>
                </div>
                <div>
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </div>
        </template>

        <!-- Main table rows - Payment Invoices -->
        <Column expander style="width: 3rem" />
        <Column field="invoice_number" header="Invoice Number" sortable />
        <Column field="fee_group_name" header="Fee Type" sortable />
        <Column field="amount" header="Amount" sortable>
            <template #body="{ data }">
                {{ formatCurrency(data.amount) }}
            </template>
        </Column>
        <Column field="amount_paid" header="Amount Paid" sortable>
            <template #body="{ data }">
                {{ formatCurrency(data.amount_paid) }}
            </template>
        </Column>
        <Column field="balance" header="Balance" sortable>
            <template #body="{ data }">
                <span :class="{ 'text-red-600': data.balance > 0, 'text-green-600': data.balance <= 0 }">
                    {{ formatCurrency(data.balance) }}
                </span>
            </template>
        </Column>
        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag :value="getStatusText(data.status)" :severity="getSeverity(data.status)" />
            </template>
        </Column>
        <Column field="created_at" header="Date" sortable>
            <template #body="{ data }">
                {{ formatDate(data.created_at) }}
            </template>
        </Column>
        <Column header="Actions" style="width: 8rem">
            <template #body="{ data }">
                <Button
                    icon="pi pi-plus"
                    class="p-button-rounded p-button-text p-button-info"
                    v-tooltip="'Add Transaction'"
                    @click="handleAddTransaction(data)"
                    :disabled="data.balance <= 0"
                />
            </template>
        </Column>

        <!-- Expanded row template -->
        <template #expansion="{ data }">
            <div class="p-4">
                <!-- Transactions Sub-table -->
                <div>
                    <h6 class="mb-3 font-semibold">Transactions for Invoice {{ data.invoice_number }}</h6>
                    <DataTable
                        :value="data.transactions"
                        :paginator="false"
                        responsiveLayout="scroll"
                        class="p-datatable-sm"
                    >
                        <Column field="transaction_number" header="Transaction #" />
                        <Column field="amount_paid" header="Amount Paid">
                            <template #body="{ data }">
                                {{ formatCurrency(data.amount_paid) }}
                            </template>
                        </Column>
                        <Column field="payment_method" header="Method" />
                        <Column field="transaction_ref" header="Reference" />
                        <Column field="transaction_date" header="Date">
                            <template #body="{ data }">
                                {{ formatDate(data.transaction_date) }}
                            </template>
                        </Column>
                        <Column field="created_by" header="Status">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Tag :value="data.status" :severity="getTransactionSeverity(data.status)" />
                                    <Button
                                        v-if="data.created_by"
                                        icon="pi pi-user"
                                        class="p-button-rounded p-button-text p-button-info p-button-sm"
                                        v-tooltip="`Created by: ${data.created_by?.staff?.first_name} ${data.created_by?.staff?.last_name}`"
                                    />
                                </div>
                            </template>
                        </Column>
                                                <Column field="verification_status" header="Verification Status">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <Tag :value="data.verification_status" :severity="getTransactionSeverity(data.verification_status)" />

                                    <!-- Approved by tooltip -->
                                    <Button
                                        v-if="data.verification_status === 'approved' && data.verified_by"
                                        icon="pi pi-user-check"
                                        class="p-button-rounded p-button-text p-button-success p-button-sm"
                                        v-tooltip="`Approved by: ${data.verified_by?.staff?.first_name} ${data.verified_by?.staff?.last_name}`"
                                    />

                                    <!-- Rejection reason tooltip -->
                                    <Button
                                        v-if="data.verification_status === 'rejected' && data.rejection_reason"
                                        icon="pi pi-info-circle"
                                        class="p-button-rounded p-button-text p-button-info p-button-sm"
                                        v-tooltip="`Rejection Reason: ${data.rejection_reason}`"
                                    />
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="width: 8rem">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <!-- View Bank Receipt (for uploaded files) -->
                                    <Button
                                        v-if="data.transaction_reciept"
                                        icon="pi pi-file-pdf"
                                        class="p-button-rounded p-button-text p-button-warning"
                                        v-tooltip="'View Bank Receipt'"
                                        @click="handleViewBankReceipt(data)"
                                    />

                                    <!-- Print System Receipt -->
                                    <Button
                                        icon="pi pi-print"
                                        class="p-button-rounded p-button-text p-button-info"
                                        v-tooltip="'Print System Receipt'"
                                        @click="handlePrintSystemReceipt(data)"
                                    />

                                    <!-- Approve Action (for pending transactions only) -->
                                    <Button
                                        v-if="data.verification_status === 'pending' || data.verification_status === 'rejected'"
                                        icon="pi pi-check"
                                        class="p-button-rounded p-button-text p-button-success"
                                        v-tooltip="'Approve Transaction'"
                                        @click="handleApproveTransaction(data)"
                                    />

                                    <!-- Reject Action (for pending or approved transactions, not rejected) -->
                                    <Button
                                        v-if="data.verification_status === 'pending' || data.verification_status === 'approved'"
                                        icon="pi pi-times"
                                        class="p-button-rounded p-button-text p-button-danger"
                                        v-tooltip="'Reject Transaction'"
                                        @click="handleRejectTransaction(data)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>

                    <div v-if="!data.transactions || data.transactions.length === 0" class="text-center p-4 text-600">
                        No transactions found for this invoice.
                    </div>
                </div>
            </div>
        </template>

        <template #empty>
            <div class="text-center p-4">
                <i class="pi pi-inbox text-4xl text-400"></i>
                <p class="mt-2">No payment records found.</p>
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
    padding: 0.5rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 0.25rem;
}
</style>
