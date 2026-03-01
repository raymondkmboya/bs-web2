<script setup>
import { ref, computed, watch } from 'vue';
import PaymentService from '@/service/PaymentService.js';

const emit = defineEmits(['save', 'cancel', 'update:visible']);

const props = defineProps({
    studentData: {
        type: Object,
        default: null
    },
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
    feeStructureId: '',
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptNumber: ''
});

const students = ref([]);
const feeAllocations = ref([]);
const feeStructures = ref([]);
const loading = ref(false);

const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Mobile Money', value: 'mobile_money' },
    { label: 'Cheque', value: 'cheque' }
];

const isFormValid = computed(() => {
    return formData.value.studentId &&
           formData.value.feeStructureId &&
           formData.value.amount > 0;
});

// Watch for fee structure selection to auto-populate amount
watch(() => formData.value.feeStructureId, (newFeeStructureId) => {
    if (newFeeStructureId && feeStructures.value.length > 0) {
        const selectedFeeStructure = feeStructures.value.find(fs => fs.id === newFeeStructureId);
        if (selectedFeeStructure) {
            formData.value.amount = selectedFeeStructure.amount;
        }
    }
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
        feeStructureId: '',
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNumber: ''
    };
}

// async function loadStudents() {
//     try {
//         students.value = await RegistrationService.getStudents();
//     } catch (error) {
//         console.error('Failed to load students:', error);
//     }
// }

// async function loadFeeAllocations() {
//     try {
//         feeAllocations.value = await RegistrationService.getFeeAllocations();
//     } catch (error) {
//         console.error('Failed to load fee allocations:', error);
//     }
// }

async function loadfeeStructures(){
    console.log(props.studentData.value)
    loading.value = true;
    try {
        const response = await PaymentService.getClassLevelFeeStructure(props.studentData.value.class_level_id);
        console.log('Set fee structures:', response);
        feeStructures.value = response;
    } catch (error) {
        console.error('Failed to load fee structures:', error);
    } finally {
        loading.value = false;
    } 
}

function handleSave() {
    if (!isFormValid.value) return;

    const paymentData = {
        student_id: props.studentData.value.id,
        fee_structure_id: formData.value.feeStructureId,
        amount: formData.value.amount,
        payment_method: formData.value.paymentMethod,
        payment_date: formData.value.paymentDate,
        receipt_number: formData.value.receiptNumber || `REC${Date.now()}`,
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
        // loadStudents();
        // loadFeeAllocations();
        loadfeeStructures();
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
            <label for="feeStructureId">Fee Type *</label>
            <Dropdown
                id="feeStructureId"
                v-model="formData.feeStructureId"
                :options="feeStructures"
                optionLabel="fee_structure_name"
                optionValue="id"
                placeholder="Select fee type"
                :class="{ 'p-invalid': !formData.feeStructureId }"
            />
            <small class="p-error" v-if="!formData.feeStructureId">Fee type is required.</small>
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
                :disabled="formData.feeStructureId"
                :class="{ 'p-invalid': !formData.amount || formData.amount <= 0 }"
            />
            <small class="p-error" v-if="!formData.amount || formData.amount <= 0">Valid amount is required.</small>
        </div>

        <div class="field">
            <label for="receiptNumber">Receipt Number</label>
            <InputText
                id="receiptNumber"
                v-model="formData.receiptNumber"
                placeholder="Auto-generated if empty"
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
