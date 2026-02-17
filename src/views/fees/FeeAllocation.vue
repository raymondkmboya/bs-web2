<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const feeAllocations = ref([]);
const feeGroups = ref([]);
const streams = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editingAllocation = ref(null);

const formData = ref({
    feeGroupId: '',
    streamId: '',
    amount: 0,
    academicYear: new Date().getFullYear().toString(),
    isInstallmentAllowed: false,
    maxInstallments: 1,
    dueDate: ''
});

const academicYears = [
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
    { label: '2026', value: '2026' }
];

const installmentOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '6', value: 6 },
    { label: '12', value: 12 }
];

const columns = [
    { field: 'feeGroupName', header: 'Fee Group' },
    { field: 'streamName', header: 'Stream' },
    { field: 'amount', header: 'Amount (TZS)' },
    { field: 'academicYear', header: 'Academic Year' },
    { field: 'dueDate', header: 'Due Date' },
    { field: 'installments', header: 'Installments' },
    { field: 'status', header: 'Status' }
];

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    feeGroupName: { value: null, matchMode: 'contains' },
    streamName: { value: null, matchMode: 'contains' },
    academicYear: { value: null, matchMode: 'equals' }
});

const globalFilterFields = ['feeGroupName', 'streamName', 'academicYear'];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        feeGroupName: { value: null, matchMode: 'contains' },
        streamName: { value: null, matchMode: 'contains' },
        academicYear: { value: null, matchMode: 'equals' }
    };
}

function openDialog(allocation = null) {
    editingAllocation.value = allocation;
    if (allocation) {
        formData.value = { ...allocation };
    } else {
        formData.value = {
            feeGroupId: '',
            streamId: '',
            amount: 0,
            academicYear: new Date().getFullYear().toString(),
            isInstallmentAllowed: false,
            maxInstallments: 1,
            dueDate: ''
        };
    }
    showDialog.value = true;
}

function closeDialog() {
    showDialog.value = false;
    editingAllocation.value = null;
    formData.value = {
        feeGroupId: '',
        streamId: '',
        amount: 0,
        academicYear: new Date().getFullYear().toString(),
        isInstallmentAllowed: false,
        maxInstallments: 1,
        dueDate: ''
    };
}

async function saveAllocation() {
    try {
        loading.value = true;
        
        if (editingAllocation.value) {
            await RegistrationService.updateFeeAllocation(editingAllocation.value.id, formData.value);
        } else {
            await RegistrationService.createFeeAllocation(formData.value);
        }
        
        await loadFeeAllocations();
        closeDialog();
    } catch (error) {
        console.error('Failed to save fee allocation:', error);
    } finally {
        loading.value = false;
    }
}

async function deleteAllocation(allocation) {
    if (confirm(`Are you sure you want to delete this allocation?`)) {
        try {
            loading.value = true;
            await RegistrationService.deleteFeeAllocation(allocation.id);
            await loadFeeAllocations();
        } catch (error) {
            console.error('Failed to delete fee allocation:', error);
        } finally {
            loading.value = false;
        }
    }
}

async function loadFeeAllocations() {
    try {
        loading.value = true;
        feeAllocations.value = await RegistrationService.getFeeAllocations();
    } catch (error) {
        console.error('Failed to load fee allocations:', error);
    } finally {
        loading.value = false;
    }
}

async function loadDropdownData() {
    try {
        feeGroups.value = await RegistrationService.getFeeGroups();
        streams.value = await RegistrationService.getStreams();
    } catch (error) {
        console.error('Failed to load dropdown data:', error);
    }
}

function getSeverity(status) {
    return status === 'Active' ? 'success' : 'danger';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}

onMounted(() => {
    loadFeeAllocations();
    loadDropdownData();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <div>
                        <h5 class="mb-2">Fee Allocation</h5>
                        <span class="text-600">Allocate fees to different streams (CSEE Arts, Science, etc.)</span>
                    </div>
                    <Button 
                        label="Add Allocation" 
                        icon="pi pi-plus" 
                        @click="openDialog()"
                        class="p-button-outlined"
                    />
                </div>

                <DataTable 
                    :value="feeAllocations" 
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
                                    placeholder="Search fee allocations..." 
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
                                :severity="data.streamName.includes('Science') ? 'info' : data.streamName.includes('Arts') ? 'warning' : 'success'"
                            />
                        </template>
                    </Column>

                    <Column field="amount" header="Amount (TZS)" sortable>
                        <template #body="{ data }">
                            <span class="font-bold text-green-600">{{ formatCurrency(data.amount) }}</span>
                        </template>
                    </Column>

                    <Column field="academicYear" header="Academic Year" sortable>
                        <template #body="{ data }">
                            <Tag :value="data.academicYear" severity="secondary" />
                        </template>
                    </Column>

                    <Column field="dueDate" header="Due Date" sortable>
                        <template #body="{ data }">
                            {{ data.dueDate ? new Date(data.dueDate).toLocaleDateString() : '-' }}
                        </template>
                    </Column>

                    <Column field="installments" header="Installments" sortable>
                        <template #body="{ data }">
                            <span v-if="data.isInstallmentAllowed">
                                {{ data.maxInstallments }} installments
                            </span>
                            <span v-else class="text-600">No installments</span>
                        </template>
                    </Column>

                    <Column field="status" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.isActive ? 'Active' : 'Inactive'" 
                                :severity="getSeverity(data.isActive)"
                            />
                        </template>
                    </Column>

                    <Column header="Actions" :exportable="false" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Button 
                                icon="pi pi-pencil" 
                                class="p-button-rounded p-button-text mr-2" 
                                @click="openDialog(data)"
                                v-tooltip="'Edit'"
                            />
                            <Button 
                                icon="pi pi-trash" 
                                class="p-button-rounded p-button-text p-button-danger" 
                                @click="deleteAllocation(data)"
                                v-tooltip="'Delete'"
                            />
                        </template>
                    </Column>
                </DataTable>

                <!-- Add/Edit Dialog -->
                <Dialog 
                    v-model:visible="showDialog" 
                    :header="editingAllocation ? 'Edit Fee Allocation' : 'Add Fee Allocation'"
                    :modal="true" 
                    :style="{ width: '500px' }"
                    :closable="false"
                >
                    <div class="field">
                        <label for="feeGroupId">Fee Group *</label>
                        <Dropdown 
                            id="feeGroupId" 
                            v-model="formData.feeGroupId" 
                            :options="feeGroups" 
                            optionLabel="name" 
                            optionValue="id"
                            placeholder="Select fee group"
                            :class="{ 'p-invalid': !formData.feeGroupId }"
                        />
                        <small class="p-error" v-if="!formData.feeGroupId">Fee group is required.</small>
                    </div>

                    <div class="field">
                        <label for="streamId">Stream *</label>
                        <Dropdown 
                            id="streamId" 
                            v-model="formData.streamId" 
                            :options="streams" 
                            optionLabel="name" 
                            optionValue="id"
                            placeholder="Select stream"
                            :class="{ 'p-invalid': !formData.streamId }"
                        />
                        <small class="p-error" v-if="!formData.streamId">Stream is required.</small>
                    </div>

                    <div class="field">
                        <label for="amount">Amount (TZS) *</label>
                        <InputNumber 
                            id="amount" 
                            v-model="formData.amount" 
                            mode="currency" 
                            currency="TZS" 
                            locale="en-TZ"
                            :min="0"
                            :class="{ 'p-invalid': !formData.amount || formData.amount <= 0 }"
                        />
                        <small class="p-error" v-if="!formData.amount || formData.amount <= 0">Valid amount is required.</small>
                    </div>

                    <div class="field">
                        <label for="academicYear">Academic Year *</label>
                        <Dropdown 
                            id="academicYear" 
                            v-model="formData.academicYear" 
                            :options="academicYears" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select academic year"
                        />
                    </div>

                    <div class="field">
                        <label for="dueDate">Due Date</label>
                        <Calendar 
                            id="dueDate" 
                            v-model="formData.dueDate" 
                            dateFormat="yy-mm-dd"
                            placeholder="Select due date"
                        />
                    </div>

                    <div class="field-checkbox">
                        <Checkbox 
                            id="isInstallmentAllowed" 
                            v-model="formData.isInstallmentAllowed" 
                            binary
                        />
                        <label for="isInstallmentAllowed">Allow Installments</label>
                    </div>

                    <div class="field" v-if="formData.isInstallmentAllowed">
                        <label for="maxInstallments">Maximum Installments</label>
                        <Dropdown 
                            id="maxInstallments" 
                            v-model="formData.maxInstallments" 
                            :options="installmentOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select max installments"
                        />
                    </div>

                    <template #footer>
                        <Button 
                            label="Cancel" 
                            icon="pi pi-times" 
                            class="p-button-text" 
                            @click="closeDialog()"
                        />
                        <Button 
                            label="Save" 
                            icon="pi pi-check" 
                            @click="saveAllocation()" 
                            :loading="loading"
                        />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.field-checkbox {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.field-checkbox label {
    margin-bottom: 0;
}
</style>
