<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['add-payment', 'view-receipt', 'view-income-statement']);

const props = defineProps({
    payments: {
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

const expandedRows = ref([]);

function expandAll() {
    expandedRows.value = payments.value.reduce((acc, p) => (acc[p.id] = true, acc), {});
}

function collapseAll() {
    expandedRows.value = {};
}

function clearFilter() {
    emit('clear-filter');
}

function openPaymentDialog(data) {
    emit('add-payment', data);
}

function openReceiptDialog(data) {
    emit('view-receipt', data);
}

function openIncomeStatementDialog(data) {
    emit('view-income-statement', data);
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

function getFeeGroupSeverity(data) {
    const feeGroupName = data.fee_group?.fee_group_name;
    const severityMap = {
        'Registration Fee': 'primary',
        'Tuition Fee': 'info',
        'Examination Fee': 'warning',
        'Activity Fee': 'secondary',
        'Development Fee': 'danger'
    };
    return severityMap[feeGroupName] || 'info';
}

// Transform the raw API response to the format expected by the table
const restructuredPayments = computed(() => {
    if (!props.payments) return [];

    const grouped = props.payments.reduce((acc, current) => {
        const studentId = current.student_id;
        const amount = parseFloat(current.fee_structure?.amount || 0);

        // Calculate paid amount from verified transactions only to stop money leaks
        const amountPaid = current.transactions.reduce((sum, txn) => {
            return txn.verification_status === 'approved' ? sum + parseFloat(txn.amount_paid) : sum;
        }, 0);

        if (!acc[studentId]) {
            acc[studentId] = {
                id: studentId,
                student: current.student,
                totalAmount: 0,
                totalPaid: 0,
                balance: 0,
                status: 'pending',
                feeGroups: [] // This will populate the expansion table
            };
        }

        // Add this invoice to the student's feeGroups array
        acc[studentId].feeGroups.push({
            invoice_number: current.invoice_number,
            fee_group_name: current.fee_structure?.fee_group?.fee_group_name,
            amount: amount,
            amount_paid: amountPaid,
            balance: amount - amountPaid,
            status: current.status.toLowerCase()
        });

        // Update grand totals for the main table row
        acc[studentId].totalAmount += amount;
        acc[studentId].totalPaid += amountPaid;
        acc[studentId].balance += (amount - amountPaid);

        // Determine overall status
        const totalBalance = acc[studentId].balance;
        acc[studentId].status = totalBalance <= 0 ? 'paid' : (acc[studentId].totalPaid > 0 ? 'partial' : 'unpaid');

        return acc;
    }, {});

    return Object.values(grouped);
});

</script>

<template>
    <DataTable
        :value="restructuredPayments"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :loading="loading"
        :filters="filters"
        :globalFilterFields="globalFilterFields"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        v-model:expandedRows="expandedRows"
        tableStyle="min-width: 60rem"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="mb-3">
                    <h5 class="mb-2">Payment Invoices</h5>
                    <span class="text-600">Manage payment invoices</span>
                </div>
                <div>
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
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
            </div>
        </template>

        <Column expander style="width: 5rem" />
        <Column field="studentName" header="Student Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <span class="font-semibold">{{ data.student?.first_name }} {{ data.student?.last_name }}</span>
                </div>
            </template>
        </Column>

        <Column field="streamName" header="Stream" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <span>{{ data.student?.class_level?.class_level_name }} {{ data.student?.class_level_stream?.class_level_stream_name }}</span>
                </div>
            </template>
        </Column>

        <Column field="totalAmount" header="Total Amount" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-money-bill mr-2"></i>
                    <span class="font-bold text-blue-600">{{ formatCurrency(data.totalAmount) }}</span>
                </div>
            </template>
        </Column>

        <Column field="totalPaid" header="Paid Amount" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-check-circle mr-2"></i>
                    <span class="font-bold text-green-600">{{ formatCurrency(data.totalPaid) }}</span>
                </div>
            </template>
        </Column>

        <Column field="balance" header="Balance" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-triangle mr-2"></i>
                    <span
                        :class="data.balance > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'"
                    >
                        {{ formatCurrency(data.balance) }}
                    </span>
                </div>
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

        <Column header="Actions" :exportable="false" style="min-width: 10rem">
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
                    class="p-button-rounded p-button-text p-button-info mr-2"
                    @click="openReceiptDialog(data)"
                    v-tooltip="'View Receipt'"
                />
                <Button
                    icon="pi pi-file-pdf"
                    class="p-button-rounded p-button-text p-button-warning"
                    @click="openIncomeStatementDialog(data)"
                    v-tooltip="'View Income Statement'"
                />
            </template>
        </Column>

        <template #expansion="slotProps">
            <div class="p-4">
                <h5>Fee Groups for {{ slotProps.data.studentName }}</h5>
                <DataTable :value="slotProps.data.feeGroups">
                    <Column field="invoice_number" header="Invoice Number" sortable></Column>
                    <Column field="fee_group_name" header="Fee Group" sortable>
                        <template #body="{ data }">
                            <Tag :value="data.fee_group_name" :severity="getFeeGroupSeverity(data)" />
                        </template>
                    </Column>
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
                            <span
                                :class="data.balance > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'"
                            >
                                {{ formatCurrency(data.balance) }}
                            </span>
                        </template>
                    </Column>
                    <Column field="status" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="getSeverity(data.status)" />
                        </template>
                    </Column>
                    <Column headerStyle="width:4rem">
                        <template #body>
                            <Button icon="pi pi-search" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </DataTable>
</template>
