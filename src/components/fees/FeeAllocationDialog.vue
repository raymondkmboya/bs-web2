<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['save', 'cancel', 'update:visible']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    feeAllocation: {
        type: Object,
        default: null
    },
    feeGroups: {
        type: Array,
        default: () => []
    },
    streams: {
        type: Array,
        default: () => []
    },
    academicYears: {
        type: Array,
        default: () => []
    },
    installmentOptions: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const formData = ref({
    feeGroupId: '',
    streamId: '',
    amount: 0,
    academicYear: new Date().getFullYear().toString(),
    isInstallmentAllowed: false,
    maxInstallments: 1,
    dueDate: ''
});

const isFormValid = computed(() => {
    return formData.value.feeGroupId && 
           formData.value.streamId && 
           formData.value.amount > 0;
});

// Watch for prop changes
watch(() => props.feeAllocation, (newAllocation) => {
    if (newAllocation) {
        formData.value = { ...newAllocation };
    } else {
        resetForm();
    }
});

// Watch for visibility changes
watch(() => props.visible, (isVisible) => {
    if (!isVisible) {
        resetForm();
    }
});

function resetForm() {
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

function handleSave() {
    if (!isFormValid.value) return;
    
    const saveData = {
        ...formData.value,
        id: props.feeAllocation?.id || null
    };
    
    emit('save', saveData);
}

function handleCancel() {
    emit('cancel');
}

function handleUpdateVisible(visible) {
    emit('update:visible', visible);
}
</script>

<template>
    <Dialog 
        :visible="visible" 
        :header="feeAllocation ? 'Edit Fee Allocation' : 'Add Fee Allocation'"
        :modal="true" 
        :style="{ width: '500px' }"
        :closable="false"
        @update:visible="handleUpdateVisible"
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
                class="w-full"
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
                class="w-full"
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
                class="w-full"
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
                class="w-full"
            />
        </div>

        <div class="field">
            <label for="dueDate">Due Date</label>
            <Calendar 
                id="dueDate" 
                v-model="formData.dueDate" 
                dateFormat="yy-mm-dd"
                placeholder="Select due date"
                class="w-full"
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
                class="w-full"
            />
        </div>

        <template #footer>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                class="p-button-text" 
                @click="handleCancel()"
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                @click="handleSave()" 
                :loading="loading"
                :disabled="!isFormValid"
            />
        </template>
    </Dialog>
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
