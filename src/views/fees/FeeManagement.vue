<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';
import FeeGroupsTable from '@/components/fees/FeeGroupsTable.vue';
import FeeAllocationTable from '@/components/fees/FeeAllocationTable.vue';
import FeeGroupDialog from '@/components/fees/FeeGroupDialog.vue';
import FeeAllocationDialog from '@/components/fees/FeeAllocationDialog.vue';

const activeTab = ref(0);
const feeGroups = ref([]);
const feeAllocations = ref([]);
const streams = ref([]);
const loading = ref(false);
const showGroupDialog = ref(false);
const showAllocationDialog = ref(false);
const editingGroup = ref(null);
const editingAllocation = ref(null);

const feeTypes = [
    { label: 'Mandatory', value: 'mandatory' },
    { label: 'Optional', value: 'optional' },
    { label: 'One-time', value: 'one_time' }
];

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

// Fee Groups Filters
const groupFilters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    type: { value: null, matchMode: 'equals' },
    description: { value: null, matchMode: 'contains' }
});

const groupGlobalFilterFields = ['name', 'type', 'description'];

// Fee Allocation Filters
const allocationFilters = ref({
    global: { value: null, matchMode: 'contains' },
    feeGroupName: { value: null, matchMode: 'contains' },
    streamName: { value: null, matchMode: 'contains' },
    academicYear: { value: null, matchMode: 'equals' }
});

const allocationGlobalFilterFields = ['feeGroupName', 'streamName', 'academicYear'];

function clearGroupFilter() {
    groupFilters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        type: { value: null, matchMode: 'equals' },
        description: { value: null, matchMode: 'contains' }
    };
}

function clearAllocationFilter() {
    allocationFilters.value = {
        global: { value: null, matchMode: 'contains' },
        feeGroupName: { value: null, matchMode: 'contains' },
        streamName: { value: null, matchMode: 'contains' },
        academicYear: { value: null, matchMode: 'equals' }
    };
}

// Fee Groups Functions
function openGroupDialog(group = null) {
    editingGroup.value = group;
    showGroupDialog.value = true;
}

function closeGroupDialog() {
    showGroupDialog.value = false;
    editingGroup.value = null;
}

function handleSaveGroup(groupData) {
    if (editingGroup.value) {
        RegistrationService.updateFeeGroup(editingGroup.value.id, groupData);
    } else {
        RegistrationService.createFeeGroup(groupData);
    }

    loadFeeGroups();
    closeGroupDialog();
}

async function deleteGroup(group) {
    if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
        loading.value = true;
        await RegistrationService.deleteFeeGroup(group.id);
        await loadFeeGroups();
        loading.value = false;
    }
}

// Fee Allocation Functions
function openAllocationDialog(allocation = null) {
    editingAllocation.value = allocation;
    showAllocationDialog.value = true;
}

function closeAllocationDialog() {
    showAllocationDialog.value = false;
    editingAllocation.value = null;
}

function handleSaveAllocation(allocationData) {
    if (editingAllocation.value) {
        RegistrationService.updateFeeAllocation(editingAllocation.value.id, allocationData);
    } else {
        RegistrationService.createFeeAllocation(allocationData);
    }

    loadFeeAllocations();
    closeAllocationDialog();
}

async function deleteAllocation(allocation) {
    if (confirm(`Are you sure you want to delete this allocation?`)) {
        loading.value = true;
        await RegistrationService.deleteFeeAllocation(allocation.id);
        await loadFeeAllocations();
        loading.value = false;
    }
}

// Data Loading
async function loadFeeGroups() {
    try {
        loading.value = true;
        feeGroups.value = await RegistrationService.getFeeGroups();
    } catch (error) {
        console.error('Failed to load fee groups:', error);
    } finally {
        loading.value = false;
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
        streams.value = await RegistrationService.getStreams();
    } catch (error) {
        console.error('Failed to load dropdown data:', error);
    }
}

// Utility Functions
function getSeverity(status) {
    return status ? 'success' : 'danger';
}

function getTypeLabel(type) {
    const typeMap = {
        'mandatory': 'Mandatory',
        'optional': 'Optional',
        'one_time': 'One-time'
    };
    return typeMap[type] || type;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}

onMounted(() => {
    loadFeeGroups();
    loadFeeAllocations();
    loadDropdownData();
});
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Fee Management</h5>
            <span class="text-600">Manage fee groups and allocate fees to different streams</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Fee Groups Tab -->
            <TabPanel header="Fee Groups">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Fee Categories</h6>
                        <span class="text-600 text-sm">Manage fee categories like tuition, exam fees, etc.</span>
                    </div>
                    <Button
                        label="Add Fee Group"
                        icon="pi pi-plus"
                        @click="openGroupDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <!-- Fee Groups Table Component -->
                <FeeGroupsTable
                    :fee-groups="feeGroups"
                    :loading="loading"
                    :filters="groupFilters"
                    :global-filter-fields="groupGlobalFilterFields"
                    @clear-filter="clearGroupFilter"
                    @add-group="openGroupDialog"
                    @edit-group="openGroupDialog"
                    @delete-group="deleteGroup"
                />
            </TabPanel>

            <!-- Fee Allocation Tab -->
            <TabPanel header="Fee Allocation">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Stream Fee Configuration</h6>
                        <span class="text-600 text-sm">Allocate fees to different streams (CSEE Arts, Science, etc.)</span>
                    </div>
                    <Button
                        label="Add Allocation"
                        icon="pi pi-plus"
                        @click="openAllocationDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <!-- Fee Allocation Table Component -->
                <FeeAllocationTable
                    :fee-allocations="feeAllocations"
                    :loading="loading"
                    :filters="allocationFilters"
                    :global-filter-fields="allocationGlobalFilterFields"
                    @clear-filter="clearAllocationFilter"
                    @add-allocation="openAllocationDialog"
                    @edit-allocation="openAllocationDialog"
                    @delete-allocation="deleteAllocation"
                />
            </TabPanel>
        </TabView>
    </div>

    <!-- Fee Groups Dialog Component -->
    <FeeGroupDialog
        :visible="showGroupDialog"
        :fee-group="editingGroup"
        :fee-types="feeTypes"
        :loading="loading"
        @save="handleSaveGroup"
        @cancel="closeGroupDialog"
    />

    <!-- Fee Allocation Dialog Component -->
    <FeeAllocationDialog
        :visible="showAllocationDialog"
        :fee-allocation="editingAllocation"
        :fee-groups="feeGroups"
        :streams="streams"
        :academic-years="academicYears"
        :installment-options="installmentOptions"
        :loading="loading"
        @save="handleSaveAllocation"
        @cancel="closeAllocationDialog"
    />
</template>
