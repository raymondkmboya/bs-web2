<script setup>
import { ref, computed, watch } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const emit = defineEmits(['save', 'cancel', 'update:visible']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Object,
        default: null
    }
});

const formData = ref({
    studentId: '',
    feeAllocationId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    notes: ''
});

const students = ref([]);
const feeAllocations = ref([]);
const loading = ref(false);

const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Mobile Money', value: 'mobile_money' },
    { label: 'Cheque', value: 'cheque' }
];

const isFormValid = computed(() => {
    return formData.value.studentId &&
           formData.value.feeAllocationId &&
           formData.value.amount > 0;
});

// Watch for payment prop changes
watch(() => props.payment, (newPayment) => {
    if (newPayment) {
        formData.value = { ...newPayment };
    } else {
        resetForm();
    }
}, { immediate: true });

// Watch for visibility changes
watch(() => props.visible, (isVisible) => {
    if (!isVisible) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        studentId: '',
        feeAllocationId: '',
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNumber: '',
        notes: ''
    };
}

async function loadStudents() {
    try {
        students.value = await RegistrationService.getStudents();
    } catch (error) {
        console.error('Failed to load students:', error);
    }
}

async function loadFeeAllocations() {
    try {
        feeAllocations.value = await RegistrationService.getFeeAllocations();
    } catch (error) {
        console.error('Failed to load fee allocations:', error);
    }
}

function handleSave() {
    if (!isFormValid.value) return;

    const paymentData = {
        ...formData.value,
        receiptNumber: formData.value.receiptNumber || `REC${Date.now()}`,
        status: 'paid'
    };

    emit('save', paymentData);
}

function handleCancel() {
    emit('cancel');
}

// Load data when component becomes visible
watch(() => props.visible, (isVisible) => {
    if (isVisible) {
        loadStudents();
        loadFeeAllocations();
    }
});
</script>

<template>
    <Dialog
        :visible="visible"
        :header="payment ? 'Edit Payment' : 'Record Payment'"
        :modal="true"
        :style="{ width: '500px' }"
        :closable="false"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="studentId">Student *</label>
            <Dropdown
                id="studentId"
                v-model="formData.studentId"
                :options="students"
                optionLabel="name"
                optionValue="id"
                placeholder="Select student"
                :class="{ 'p-invalid': !formData.studentId }"
            />
            <small class="p-error" v-if="!formData.studentId">Student is required.</small>
        </div>

        <div class="field">
            <label for="feeAllocationId">Fee Type *</label>
            <Dropdown
                id="feeAllocationId"
                v-model="formData.feeAllocationId"
                :options="feeAllocations"
                optionLabel="feeGroupName"
                optionValue="id"
                placeholder="Select fee type"
                :class="{ 'p-invalid': !formData.feeAllocationId }"
            />
            <small class="p-error" v-if="!formData.feeAllocationId">Fee type is required.</small>
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
            <label for="paymentMethod">Payment Method *</label>
            <Dropdown
                id="paymentMethod"
                v-model="formData.paymentMethod"
                :options="paymentMethods"
                optionLabel="label"
                optionValue="value"
                placeholder="Select payment method"
            />
        </div>

        <div class="field">
            <label for="paymentDate">Payment Date *</label>
            <Calendar
                id="paymentDate"
                v-model="formData.paymentDate"
                dateFormat="yy-mm-dd"
                placeholder="Select payment date"
            />
        </div>

        <div class="field">
            <label for="receiptNumber">Receipt Number</label>
            <InputText
                id="receiptNumber"
                v-model="formData.receiptNumber"
                placeholder="Auto-generated if empty"
            />
        </div>

        <div class="field">
            <label for="notes">Notes</label>
            <Textarea
                id="notes"
                v-model="formData.notes"
                rows="3"
                placeholder="Add payment notes..."
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
                label="Record Payment"
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
</style>
