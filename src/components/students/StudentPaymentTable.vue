<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    payments: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['view', 'enroll', 'reject', 'add-transaction']);
const router = useRouter();

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    phone: { value: null, matchMode: 'contains' },
    gender: { value: null, matchMode: 'equals' },
    classLevelAndStream: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    admissionDate: { value: null, matchMode: 'contains' }
});

// Status options
const statusOptions = [
    { label: 'Admitted', value: 'admitted' },
    { label: 'Enrolled', value: 'enrolled' },
    { label: 'Pending Enrollment', value: 'pending_enrollment' },
    { label: 'Rejected', value: 'rejected' }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        phone: { value: null, matchMode: 'contains' },
        gender: { value: null, matchMode: 'equals' },
        classLevelAndStream: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' },
        admissionDate: { value: null, matchMode: 'contains' }
    };
}

function getSeverity(status) {
    switch (status) {
        case 'enrolled':
            return 'success';
        case 'completed':
            return 'info';
        case 'pending_enrollment':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return 'info';
    }
}

function getVerificationSeverity(status) {
    switch (status) {
        case 'verified':
            return 'success';
        case 'pending':
            return 'warning';
        case 'rejected':
            return 'danger';
        default:
            return 'info';
    }
}

function handleView(data) {
    emit('view', data);
    // Navigate to student profile page
    router.push(`/students/profile/${data.id}`);
}

function handleEnroll(data) {
    emit('enroll', data);
}

function handleReject(data) {
    emit('reject', data);
}

function handleAddTransaction(data) {
    emit('add-transaction', data);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
    <DataTable
        :value="payments"
        dataKey="id"
        :rowHover="true"
        :loading="loading"
        showGridlines
        responsiveLayout="scroll"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h5 class="m-0">Payment Invoices</h5>
                <div class="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear"
                        outlined
                        @click="clearFilter"
                    />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Keyword Search"
                        />
                    </IconField>
                </div>
            </div>
        </template>
        <template #empty> No payments found. </template>
        <template #loading> Loading payments data. Please wait. </template>

        <!-- Invoice Number Column -->
        <Column field="invoice_number" header="Invoice Number" :sortable="true" filterMatchMode="contains">
            <template #body="{ data }">
                <span class="font-mono font-semibold">{{ data.invoice_number || 'N/A' }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by invoice number"
                />
            </template>
        </Column>

        <Column field="fee_structure.fee_group.fee_group_name" header="Fee Group" :sortable="true" filterMatchMode="contains">
            <template #filter="{ filterModel, filterCallback }">
                <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by fee structure"
                />
            </template>
        </Column>

        <Column field="fee_structure.amount" header="Total Amount" :sortable="true" filterMatchMode="equals">
            <template #body="{ data }">
                TZS {{ data.fee_structure.amount?.toLocaleString() || '0' }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                 <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by amount paid"
                />
            </template>
        </Column>

        <Column field="totalPaid" header="Total Amount Paid" :sortable="true" filterMatchMode="equals">
            <template #body="{ data }">
                TZS {{ data.totalPaid?.toLocaleString() || '0' }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                 <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by amount paid"
                />
            </template>
        </Column>

        <Column field="balance" header="Balance" :sortable="true" filterMatchMode="equals">
            <template #body="{ data }">
                TZS {{ data.balance?.toLocaleString() || '0' }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                 <InputText
                    type="text"
                    v-model="filterModel.value"
                    @keydown.enter="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by amount paid"
                />
            </template>
        </Column>

        <Column field="status" header="Status" :sortable="true" filterMatchMode="equals">
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    :options="statusOptions"
                    optionValue="value"
                    optionLabel="label"
                    placeholder="Any"
                    class="p-column-filter"
                    showClear
                />
            </template>
            <template #body="{ data }">
                <Tag :value="data.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())" :severity="getSeverity(data.status)" />
            </template>
        </Column>

        <Column header="Actions" style="min-width: 200px">
            <template #body="{ data }">
                <Button
                    icon="pi pi-plus"
                    class="p-button-rounded p-button-text p-button-success mr-2"
                    v-tooltip="'Add Transaction'"
                    @click="handleAddTransaction(data)"
                />
                <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'View Details'"
                    @click="handleView(data)"
                />
                <Button
                    icon="pi pi-check"
                    class="p-button-rounded p-button-text p-button-plain mr-2"
                    v-tooltip="'Approve'"
                    @click="handleEnroll(data)"
                />
                <Button
                    icon="pi pi-times"
                    class="p-button-rounded p-button-text p-button-plain"
                    v-tooltip="'Reject'"
                    @click="handleReject(data)"
                />
            </template>
        </Column>
    </DataTable>
</template>
