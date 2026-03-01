<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-payment', 'view-receipt', 'view-bank-receipt', 'print-system-receipt', 'approve-transaction', 'reject-transaction']);

const props = defineProps({
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

function clearFilter() {
    emit('clear-filter');
}

function openPaymentDialog(data) {
    emit('add-payment', data);
}

function openReceiptDialog(data) {
    emit('view-receipt', data);
}

function viewBankReceipt(data) {
    emit('view-bank-receipt', data);
}

function printSystemReceipt(data) {
    emit('print-system-receipt', data);
}

function approveTransaction(data) {
    emit('approve-transaction', data);
}

function rejectTransaction(data) {
    emit('reject-transaction', data);
}

function getSeverity(status) {
    const severityMap = {
        'completed': 'success',
        'pending': 'info',
        'rejected': 'danger'
    };
    return severityMap[status] || 'info';
}

function getVerificationSeverity(status) {
    const severityMap = {
        'approved': 'success',
        'pending': 'info',
        'rejected': 'danger'
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

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStudentName(data) {
    return data.payment?.student ?
        `${data.payment.student.first_name} ${data.payment.student.last_name}` :
        'N/A';
}

function getClassAndStream(data) {
    const student = data.payment?.student;
    if (!student) return 'N/A';

    const className = student.class_level?.class_level_name || student.class_level?.name || 'N/A';
    const streamName = student.class_level_stream?.class_level_stream_name || student.class_level_stream?.name || '';

    return streamName ? `${className} - ${streamName}` : className;
}

function getFeeGroup(data) {
    return data.payment?.fee_structure?.fee_group?.fee_group_name || 'N/A';
}

function getFeeGroupSeverity(data) {
    const feeGroupName = data.payment?.fee_structure?.fee_group?.fee_group_name || '';
    const severityMap = {
        'Registration Fee': 'primary',
        'Tuition Fee': 'info',
        'Examination Fee': 'warning',
        'Activity Fee': 'secondary',
        'Development Fee': 'danger'
    };
    return severityMap[feeGroupName] || 'info';
}

function getCreatedBy(data) {
    const firstName = data.created_by?.staff?.first_name;
    const lastName = data.created_by?.staff?.last_name;
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    }
    return firstName || lastName || 'System';
}

function getPaymentMethodIcon(method) {
    const iconMap = {
        'Cash': 'pi pi-money-bill',
        'Bank Transfer': 'pi pi-credit-card',
        'Bank Deposit': 'pi pi-building',
        'Mobile Money': 'pi pi-mobile',
        'Selcom Pay': 'pi pi-wallet',
        'Cheque': 'pi pi-file'
    };
    return iconMap[method] || 'pi pi-credit-card';
}
</script>

<template>
    <DataTable
        :value="transactions"
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
            <div class="flex justify-between items-center">
                <div class="mb-3">
                    <h5 class="mb-2">Transactions</h5>
                    <span class="text-600">Manage payment transactions and approvals</span>
                </div>
                <div>
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
                            placeholder="Search transactions..."
                        />
                    </span>
                </div>
            </div>
        </template>

        <!-- Student Name Column -->
        <Column field="student_name" header="Student" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-semibold">{{ getStudentName(data) }}</span>
                </div>
            </template>
        </Column>

        <!-- Class & Stream Column -->
        <Column field="class_stream" header="Stream" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <span>{{ getClassAndStream(data) }}</span>
                </div>
            </template>
        </Column>

        <!-- Fee Group Column -->
        <Column field="fee_group" header="Fee Group" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-tag mr-2"></i>
                    <Tag :value="getFeeGroup(data)" :severity="getFeeGroupSeverity(data)" />
                </div>
            </template>
        </Column>

        <!-- Created By Column -->
        <Column field="created_by" header="Created By" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span>{{ getCreatedBy(data) }}</span>
                </div>
            </template>
        </Column>

        <!-- Amount Paid Column -->
        <Column field="amount_paid" header="Amount Paid" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-money-bill mr-2"></i>
                    <span class="font-semibold">{{ formatCurrency(data.amount_paid) }}</span>
                </div>
            </template>
        </Column>

        <!-- Transaction Reference Column -->
        <Column field="transaction_ref" header="Transaction Ref" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-file mr-2"></i>
                    <span>{{ data.transaction_ref || 'N/A' }}</span>
                </div>
            </template>
        </Column>

        <!-- Transaction Number Column -->
        <Column field="transaction_number" header="Transaction No" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-hashtag mr-2"></i>
                    <span class="font-mono">{{ data.transaction_number }}</span>
                </div>
            </template>
        </Column>

        <!-- Payment Method Column -->
        <Column field="payment_method" header="Payment Method" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i :class="getPaymentMethodIcon(data.payment_method) + ' mr-2'"></i>
                    <span>{{ data.payment_method }}</span>
                </div>
            </template>
        </Column>

        <!-- Status Column -->
        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag :value="data.status" :severity="getSeverity(data.status)" />
                 <Button
                        v-if="data.created_by && data.created_by.staff && data.created_by.staff.first_name"
                        icon="pi pi-user-plus"
                        class="p-button-rounded p-button-text p-button-secondary"
                        v-tooltip="`Created by: ${data.created_by.staff.first_name} ${data.created_by.staff.last_name}`"
                        size="small"
                    />
            </template>
        </Column>

        <!-- Verification Status Column -->
        <Column field="verification_status" header="Verification Status" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                    <Tag :value="data.verification_status" :severity="getVerificationSeverity(data.verification_status)" />
                    <Button
                        v-if="data.verification_status === 'rejected' && data.rejection_reason"
                        icon="pi pi-info-circle"
                        class="p-button-rounded p-button-text p-button-info"
                        v-tooltip="data.rejection_reason"
                        size="small"
                    />
                    <Button
                        v-if="data.verification_status === 'approved' && data.verified_by"
                        icon="pi pi-user"
                        class="p-button-rounded p-button-text p-button-success"
                        v-tooltip="`Approved by: ${data.verified_by?.staff?.first_name} ${data.verified_by?.staff?.last_name}`"
                        size="small"
                    />
                </div>
            </template>
        </Column>

        <!-- Transaction Date Column -->
        <Column field="transaction_date" header="Transaction Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.transaction_date) }}</span>
                </div>
            </template>
        </Column>

        <!-- Actions Column -->
        <Column field="actions" header="Actions" :exportable="false">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <!-- View Bank Receipt (for uploaded files) -->
                    <Button
                        v-if="data.transaction_reciept"
                        icon="pi pi-eye"
                        class="p-button-rounded p-button-text p-button-plain"
                        v-tooltip="'View Bank Receipt'"
                        @click="viewBankReceipt(data)"
                    />

                    <!-- Print System Receipt -->
                    <Button
                        icon="pi pi-print"
                        class="p-button-rounded p-button-text p-button-info"
                        v-tooltip="'Print System Receipt'"
                        @click="printSystemReceipt(data)"
                    />

                    <!-- Approve Action (for pending or rejected bank/cash payments) -->
                    <Button
                        v-if="(data.verification_status === 'pending' || data.verification_status === 'rejected') && (data.payment_method === 'Bank Transfer' || data.payment_method === 'Cash' || data.payment_method === 'Bank Deposit')"
                        icon="pi pi-check"
                        class="p-button-rounded p-button-text p-button-success"
                        v-tooltip="'Approve Transaction'"
                        @click="approveTransaction(data)"
                    />

                    <!-- Reject Action (for pending or approved bank/cash payments) -->
                    <Button
                        v-if="(data.verification_status === 'pending' || data.verification_status === 'approved') && (data.payment_method === 'Bank Transfer' || data.payment_method === 'Cash' || data.payment_method === 'Bank Deposit')"
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text p-button-danger"
                        v-tooltip="'Reject Transaction'"
                        @click="rejectTransaction(data)"
                    />
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
.p-button-rounded {
    transition: all 0.2s ease;
}

.p-button-rounded:hover {
    transform: scale(1.1);
}

.font-mono {
    font-family: 'Courier New', monospace;
}
</style>
