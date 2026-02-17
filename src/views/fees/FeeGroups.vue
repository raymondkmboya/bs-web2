<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const feeGroups = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editingGroup = ref(null);

const formData = ref({
    name: '',
    description: '',
    type: 'mandatory',
    isActive: true
});

const feeTypes = [
    { label: 'Mandatory', value: 'mandatory' },
    { label: 'Optional', value: 'optional' },
    { label: 'One-time', value: 'one_time' }
];

const columns = [
    { field: 'name', header: 'Fee Group Name' },
    { field: 'type', header: 'Type' },
    { field: 'description', header: 'Description' },
    { field: 'isActive', header: 'Status' },
    { field: 'createdAt', header: 'Created Date' }
];

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    type: { value: null, matchMode: 'equals' },
    description: { value: null, matchMode: 'contains' }
});

const globalFilterFields = ['name', 'type', 'description'];

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        type: { value: null, matchMode: 'equals' },
        description: { value: null, matchMode: 'contains' }
    };
}

function openDialog(group = null) {
    editingGroup.value = group;
    if (group) {
        formData.value = { ...group };
    } else {
        formData.value = {
            name: '',
            description: '',
            type: 'mandatory',
            isActive: true
        };
    }
    showDialog.value = true;
}

function closeDialog() {
    showDialog.value = false;
    editingGroup.value = null;
    formData.value = {
        name: '',
        description: '',
        type: 'mandatory',
        isActive: true
    };
}

async function saveGroup() {
    try {
        loading.value = true;
        
        if (editingGroup.value) {
            await RegistrationService.updateFeeGroup(editingGroup.value.id, formData.value);
        } else {
            await RegistrationService.createFeeGroup(formData.value);
        }
        
        await loadFeeGroups();
        closeDialog();
    } catch (error) {
        console.error('Failed to save fee group:', error);
    } finally {
        loading.value = false;
    }
}

async function deleteGroup(group) {
    if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
        try {
            loading.value = true;
            await RegistrationService.deleteFeeGroup(group.id);
            await loadFeeGroups();
        } catch (error) {
            console.error('Failed to delete fee group:', error);
        } finally {
            loading.value = false;
        }
    }
}

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

onMounted(() => {
    loadFeeGroups();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <div>
                        <h5 class="mb-2">Fee Groups</h5>
                        <span class="text-600">Manage fee categories like tuition, exam fees, etc.</span>
                    </div>
                    <Button 
                        label="Add Fee Group" 
                        icon="pi pi-plus" 
                        @click="openDialog()"
                        class="p-button-outlined"
                    />
                </div>

                <DataTable 
                    :value="feeGroups" 
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
                                    placeholder="Search fee groups..." 
                                />
                            </span>
                        </div>
                    </template>

                    <Column field="name" header="Fee Group Name" sortable>
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.name }}</span>
                        </template>
                    </Column>

                    <Column field="type" header="Type" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="getTypeLabel(data.type)" 
                                :severity="data.type === 'mandatory' ? 'danger' : data.type === 'optional' ? 'warning' : 'info'"
                            />
                        </template>
                    </Column>

                    <Column field="description" header="Description">
                        <template #body="{ data }">
                            <span class="text-600">{{ data.description || '-' }}</span>
                        </template>
                    </Column>

                    <Column field="isActive" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.isActive ? 'Active' : 'Inactive'" 
                                :severity="getSeverity(data.isActive)"
                            />
                        </template>
                    </Column>

                    <Column field="createdAt" header="Created Date" sortable>
                        <template #body="{ data }">
                            {{ new Date(data.createdAt).toLocaleDateString() }}
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
                                @click="deleteGroup(data)"
                                v-tooltip="'Delete'"
                            />
                        </template>
                    </Column>
                </DataTable>

                <!-- Add/Edit Dialog -->
                <Dialog 
                    v-model:visible="showDialog" 
                    :header="editingGroup ? 'Edit Fee Group' : 'Add Fee Group'"
                    :modal="true" 
                    :style="{ width: '450px' }"
                    :closable="false"
                >
                    <div class="field">
                        <label for="name">Fee Group Name *</label>
                        <InputText 
                            id="name" 
                            v-model="formData.name" 
                            required="true" 
                            :class="{ 'p-invalid': !formData.name }"
                            autofocus
                        />
                        <small class="p-error" v-if="!formData.name">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="type">Type *</label>
                        <Dropdown 
                            id="type" 
                            v-model="formData.type" 
                            :options="feeTypes" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select fee type"
                        />
                    </div>

                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea 
                            id="description" 
                            v-model="formData.description" 
                            rows="3" 
                            placeholder="Enter fee group description..."
                        />
                    </div>

                    <div class="field-checkbox">
                        <Checkbox 
                            id="isActive" 
                            v-model="formData.isActive" 
                            binary
                        />
                        <label for="isActive">Active</label>
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
                            @click="saveGroup()" 
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
