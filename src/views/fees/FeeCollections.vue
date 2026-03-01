<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';
import PaymentForm from '@/components/fees/PaymentForm.vue';
import ReceiptDialog from '@/components/fees/ReceiptDialog.vue';
import FeePaymentTable from '@/components/fees/FeePaymentTable.vue';
import FeeTransactionTable from '@/components/fees/FeeTransactionTable.vue';
import FeeCollectionsStats from '@/components/fees/FeeCollectionsStats.vue';
import StudentService from '@/service/StudentService';
import PaymentService from '@/service/PaymentService';

const payments = ref([]);
const transactions = ref([]);

const loading = ref(false);
const showPaymentDialog = ref(false);
const showReceiptDialog = ref(false);
const showRejectionDialog = ref(false);
const editingPayment = ref(null);
const selectedPayment = ref(null);
const rejectingTransaction = ref(null);
const rejectionReason = ref('');

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

async function openReceiptDialog(studentData) {
    try {
        const response = await PaymentService.generateStudentStatement(studentData.id);

        if (response.success) {
            // Open statement in new window for printing
            const statementWindow = window.open('', '_blank', 'width=800,height=600');
            statementWindow.document.write(response.data.statement_html);
            statementWindow.document.close();
        }
    } catch (error) {
        console.error('Failed to generate student statement:', error);
    }
}

function viewBankReceipt(transaction) {
    // Open bank receipt file in new window
    if (transaction.transaction_reciept) {
        const receiptUrl = `http://localhost:8080/storage/${transaction.transaction_reciept}`;
        window.open(receiptUrl, '_blank');
    }
}

function printSystemReceipt(transaction) {
    // Generate and print system receipt from backend
    PaymentService.generateReceipt(transaction.id)
        .then(response => {
            const receiptContent = response.receipt_html; // PaymentService already returns response.data.data
            const printWindow = window.open('', '_blank');
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.print();
        })
        .catch(error => {
            console.error('Failed to generate receipt:', error);
        });
}

function closeReceiptDialog() {
    showReceiptDialog.value = false;
    selectedPayment.value = null;
}

function approveTransaction(transaction) {
    // Approve transaction
    PaymentService.approveTransaction(transaction.id)
        .then(response => {
            console.log('Transaction approved:', response);
            // Refresh transactions to show updated status
            loadTransactions();
            loadPayments();
        })
        .catch(error => {
            console.error('Failed to approve transaction:', error);
        });
}

function rejectTransaction(transaction) {
    // Open rejection dialog
    rejectingTransaction.value = transaction;
    rejectionReason.value = '';
    showRejectionDialog.value = true;
}

function confirmRejection() {
    // Reject transaction with reason
    PaymentService.rejectTransaction(rejectingTransaction.value.id, rejectionReason.value)
        .then(response => {
            console.log('Transaction rejected:', response);
            showRejectionDialog.value = false;
            rejectingTransaction.value = null;
            rejectionReason.value = '';
            // Refresh transactions to show updated status
            loadTransactions();
            loadPayments();
        })
        .catch(error => {
            console.error('Failed to reject transaction:', error);
        });
}

function cancelRejection() {
    showRejectionDialog.value = false;
    rejectingTransaction.value = null;
    rejectionReason.value = '';
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

async function loadPayments() {
    try {
        loading.value = true;
        payments.value = await PaymentService.getStudentPayments();
        console.log('Payments:', payments.value);
    } catch (error) {
        console.error('Failed to load fee collections:', error);
    } finally {
        loading.value = false;
    }
}

async function loadTransactions() {
    try {
        loading.value = true;
        transactions.value = await PaymentService.getStudentTransactions();
        console.log('Transactions:', transactions.value);
    } catch (error) {
        console.error('Failed to load fee collections:', error);
    } finally {
        loading.value = false;
    }
}

// Generate income statement for all students
async function generateAllStudentsIncomeStatement() {
    try {
        const params = {
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
            end_date: new Date().toISOString().split('T')[0] // Today
        };

        const response = await PaymentService.generateIncomeStatement(params);

        // Open statement in new window for printing
        const statementWindow = window.open('', '_blank', 'width=1200,height=800');
        statementWindow.document.write(response);
        statementWindow.document.close();

    } catch (error) {
        console.error('Failed to generate income statement:', error);
    }
}

// Generate detailed income statement with transactions
async function generateDetailedIncomeStatement() {
    try {
        const params = {
            detailed: true, // Flag for detailed report
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
            end_date: new Date().toISOString().split('T')[0] // Today
        };

        const response = await PaymentService.generateIncomeStatement(params);

        // Open statement in new window for printing
        const statementWindow = window.open('', '_blank', 'width=1200,height=800');
        statementWindow.document.write(response);
        statementWindow.document.close();

    } catch (error) {
        console.error('Failed to generate detailed income statement:', error);
    }
}

// Generate income statement for individual student from payment invoice
async function openIncomeStatementDialog(paymentData) {
    try {
        const params = {
            student_id: paymentData.id, // Use the grouped student ID
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
            end_date: new Date().toISOString().split('T')[0] // Today
        };

        const response = await PaymentService.generateIncomeStatement(params);

        // Open statement in new window for printing
        const statementWindow = window.open('', '_blank', 'width=1200,height=800');
        statementWindow.document.write(response);
        statementWindow.document.close();

    } catch (error) {
        console.error('Failed to generate student income statement:', error);
    }
}

onMounted(() => {
    loadPayments();
    loadTransactions();
});
</script>

<template>
    <!-- Fee Collections Stats Component -->
    <FeeCollectionsStats />

    <div class="card mb-6">
        <div class="mb-5">
            <div class="flex justify-between items-center">
                <div>
                    <h5 class="mb-2">Fee Collections</h5>
                    <span class="text-600">Track fee payments and collections approvals from students</span>
                </div>
                <div class="flex gap-2">
                    <Button
                        label="All Students Income Statement"
                        icon="pi pi-file-pdf"
                        class="p-button-outlined"
                        @click="generateAllStudentsIncomeStatement"
                    />
                    <Button
                        label="Detailed Income Statement"
                        icon="pi pi-list"
                        class="p-button-outlined p-button-info"
                        @click="generateDetailedIncomeStatement"
                    />
                </div>
            </div>
        </div>

        <!-- Fee Collections Header and Table -->
        <TabView v-model:activeIndex="activeTab">
            <!-- Registrations Tab -->
            <TabPanel header="Payment Invoices">
                <!-- Fee Collections Table Component -->
                <FeePaymentTable
                    :payments="payments"
                    :loading="loading"
                    :filters="filters"
                    :global-filter-fields="globalFilterFields"
                    @clear-filter="clearFilter"
                    @add-payment="openPaymentDialog"
                    @view-receipt="openReceiptDialog"
                    @view-income-statement="openIncomeStatementDialog"
                />
            </TabPanel>
            <!-- Follow Ups Tab -->
            <TabPanel header="Transactions">
                <!-- Fee Collections Table Component -->
                <FeeTransactionTable
                    :transactions="transactions"
                    :loading="loading"
                    :filters="filters"
                    :global-filter-fields="globalFilterFields"
                    @clear-filter="clearFilter"
                    @add-payment="openPaymentDialog"
                    @view-receipt="openReceiptDialog"
                    @view-bank-receipt="viewBankReceipt"
                    @print-system-receipt="printSystemReceipt"
                    @approve-transaction="approveTransaction"
                    @reject-transaction="rejectTransaction"
                />
            </TabPanel>
        </TabView>

        <!-- Payment Form Component -->
        <PaymentForm
            :visible="showPaymentDialog"
            :payment="editingPayment"
            @save="handleSavePayment"
            @cancel="closePaymentDialog"
        />

        <!-- Rejection Reason Dialog -->
        <Dialog
            v-model:visible="showRejectionDialog"
            :style="{ width: '450px' }"
            header="Reject Transaction"
            :modal="true"
        >
            <div class="flex flex-column gap-3">
                <div>
                    <label for="rejectionReason" class="font-semibold">Rejection Reason</label>
                    <Textarea
                        id="rejectionReason"
                        v-model="rejectionReason"
                        rows="4"
                        cols="30"
                        class="w-full mt-2"
                        placeholder="Please provide a reason for rejecting this transaction..."
                    />
                </div>
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    @click="cancelRejection"
                />
                <Button
                    label="Reject"
                    icon="pi pi-check"
                    severity="danger"
                    @click="confirmRejection"
                    :disabled="!rejectionReason.trim()"
                />
            </template>
        </Dialog>

        <!-- Receipt Dialog Component -->
        <ReceiptDialog
            :visible="showReceiptDialog"
            :payment="selectedPayment"
            @close="closeReceiptDialog"
        />
    </div>
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
