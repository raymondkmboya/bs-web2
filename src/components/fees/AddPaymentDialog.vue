
<script setup>
import { ref, reactive, watch } from 'vue';
import Calendar from 'primevue/calendar';
import PaymentService from '@/service/PaymentService.js';

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

const emit = defineEmits(['update:visible', 'submit']);

const loading = ref(false);
const feeStructures = ref([]);
const errors = reactive({});

const formData = reactive({
    student_id: '',
    fee_structure_id: '',
    amount_paid: null,
    amount: null,
    receipt_file: null,
    payment_method: '',
    transaction_ref: '',
    transaction_date: null // Initialize as null for Calendar component
});

const paymentMethods = ref([
    'Cash', 'Bank Transfer', 'Mobile Money', 'Bank Deposit', 'Selcom Pay'
]);

// Reset form
function resetForm() {
    Object.keys(errors).forEach(key => delete errors[key]);
    Object.assign(formData, {
        payment_id: null, // For existing payments
        student_id: props.studentData?.value?.id || '',
        fee_structure_id: '',
        amount_paid: null,
        amount: null,
        receipt_file: null,
        payment_method: '',
        transaction_ref: '',
        transaction_date: null
    });
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.files[0];
    if (file) {
        formData.receipt_file = file;
    }
}

// Handle submit
async function handleSubmit() {
    loading.value = true;
    try {
        // Create FormData for file upload
        const submitFormData = new FormData();

        // Append payment_id if exists (for existing payments)
        if (props.payment?.id) {
            submitFormData.append('payment_id', props.payment.id);
        }

        // Append student_id for new payments
        if (formData.student_id) {
            submitFormData.append('student_id', formData.student_id);
        }

        // Append fee_structure_id for new payments
        if (formData.fee_structure_id) {
            submitFormData.append('fee_structure_id', formData.fee_structure_id);
        }

        // Append all form fields
        if (formData.amount_paid) {
            submitFormData.append('amount_paid', formData.amount_paid);
        }
        if (formData.payment_method) {
            submitFormData.append('payment_method', formData.payment_method);
        }
        if (formData.transaction_ref) {
            submitFormData.append('transaction_ref', formData.transaction_ref);
        }
        if (formData.transaction_date) {
            // Send raw Date object - let backend handle it
            submitFormData.append('transaction_date', formData.transaction_date);
        }
        if (formData.receipt_file) {
            submitFormData.append('receipt_file', formData.receipt_file);
        }

        // Emit to parent for API call - parent will handle success/error
        emit('submit', submitFormData);

    } catch (error) {
        console.error('Submit error:', error);
        loading.value = false;
        // Handle validation errors
        if (error.response?.data?.errors) {
            Object.assign(errors, error.response.data.errors);
        } else if (error.response?.data?.message) {
            errors.general = [error.response.data.message];
        } else {
            errors.general = ['An unexpected error occurred. Please try again.'];
        }
    }
}

// Handle cancel
function handleCancel() {
    resetForm();
    emit('update:visible', false);
}

// Handle success from parent
function handleSuccess(response) {
    resetForm();
    loading.value = false;
}

// Handle error from parent
function handleError(error) {
    loading.value = false;
    console.error('Submit error:', error);
    // Handle validation errors
    if (error.response?.data?.errors) {
        Object.assign(errors, error.response.data.errors);
    } else if (error.response?.data?.message) {
        errors.general = [error.response.data.message];
    } else {
        errors.general = ['An unexpected error occurred. Please try again.'];
    }
}

function formatDateForServer(date) {
    if (!date) return null;

    // Get local date components to avoid timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Return in YYYY-MM-DD format without time to avoid timezone issues
    return `${year}-${month}-${day}`;
}

// Expose methods for parent
defineExpose({
    handleSuccess,
    handleError
});

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

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
        loadfeeStructures();
    }
});

// Watch for fee structure selection to auto-populate amount
watch(() => formData.fee_structure_id, (new_fee_structure_id) => {
    if (new_fee_structure_id && feeStructures.value.length > 0) {
        const selected_fee_structure = feeStructures.value.find(fs => fs.id === new_fee_structure_id);
        if (selected_fee_structure) {
            formData.amount = selected_fee_structure.amount;
        }
    }
});


</script>

<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        header="Add Transaction"
        :style="{ width: '500px' }"
    >
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Fee Type (only for new payments) -->
            <div v-if="!props.payment?.id">
                <label class="block text-sm font-medium mb-2">Fee Type *</label>
                <Dropdown
                    id="fee_structure_id"
                    v-model="formData.fee_structure_id"
                    :options="feeStructures"
                    optionLabel="fee_structure_name"
                    optionValue="id"
                    placeholder="Select fee type"
                    class="w-full"
                />
                 <div v-if="errors.fee_structure_id" class="text-red-600 text-sm mt-1">
                    {{ errors.fee_structure_id[0] }}
                </div>
            </div>

            <!-- Fee Amount (display only for existing payments, auto-populated for new) -->
            <div v-if="!props.payment?.id">
                <label class="block text-sm font-medium mb-2">Fee Amount (TZS)</label>
                <InputNumber
                    id="amount"
                    v-model="formData.amount"
                    mode="currency"
                    currency="TZS"
                    locale="en-TZ"
                    class="w-full"
                    :min="0"
                    :disabled="formData.fee_structure_id"
                    readonly
                />
                <small class="text-gray-500">Auto-populated from fee structure</small>
            </div>

            <!-- Payment Method -->
            <div>
                <label class="block text-sm font-medium mb-2">Payment Method *</label>
                <Dropdown
                    v-model="formData.payment_method"
                    :options="paymentMethods"
                    placeholder="Select Payment Method"
                    class="w-full"
                    required
                />
                <div v-if="errors.payment_method" class="text-red-600 text-sm mt-1">
                    {{ errors.payment_method[0] }}
                </div>
            </div>

            <!-- Amount Paid -->
            <div>
                <label class="block text-sm font-medium mb-2">Amountd Paid *</label>
                <InputNumber
                    v-model="formData.amount_paid"
                    mode="currency"
                    currency="TZS"
                    locale="en-TZ"
                    placeholder="0.00"
                    class="w-full"
                    required
                />
                <div v-if="errors.amount_paid" class="text-red-600 text-sm mt-1">
                    {{ errors.amount_paid[0] }}
                </div>
            </div>

            <!-- Transaction Reference -->
            <div>
                <label class="block text-sm font-medium mb-2">Transaction Reference *</label>
                <InputText
                    v-model="formData.transaction_ref"
                    placeholder="Bank reference or transaction ID"
                    class="w-full"
                />
                <div v-if="errors.transaction_ref" class="text-red-600 text-sm mt-1">
                    {{ errors.transaction_ref[0] }}
                </div>
            </div>

            <!-- Transaction Date -->
            <div>
                <label class="block text-sm font-medium mb-2">Transaction Date *</label>
                <Calendar
                    v-model="formData.transaction_date"
                    dateFormat="dd/mm/yy"
                    :showIcon="true"
                    class="w-full"
                />
                <div v-if="errors.transaction_date" class="text-red-600 text-sm mt-1">
                    {{ errors.transaction_date[0] }}
                </div>
            </div>

            <!-- Receipt Upload -->
            <div>
                <label class="block text-sm font-medium mb-2">Receipt</label>
                <FileUpload
                    mode="basic"
                    :auto="true"
                    :custom-upload="true"
                    @uploader="handleFileUpload"
                    accept="image/*,.pdf"
                    :maxFileSize="2000000"
                    choose-label="Choose Receipt"
                    class="w-full"
                />
                <div v-if="errors.receipt_file" class="text-red-600 text-sm mt-1">
                    {{ errors.receipt_file[0] }}
                </div>
                <div v-if="formData.receipt_file" class="mt-2">
                    <small class="text-green-600">File: {{ formData.receipt_file.name }}</small>
                </div>
            </div>

            <!-- Error Messages -->
            <div v-if="errors.general" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div v-for="(error, index) in errors.general" :key="index" class="text-red-600 text-sm">
                    {{ error }}
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-2 pt-4">
                <Button
                    label="Cancel"
                    severity="secondary"
                    @click="handleCancel"
                    type="button"
                />
                <Button
                    label="Add Transaction"
                    :loading="loading"
                    type="submit"
                />
            </div>
        </form>
    </Dialog>
</template>

<style scoped>
.space-y-4 > * + * {
    margin-top: 1rem;
}
</style>
