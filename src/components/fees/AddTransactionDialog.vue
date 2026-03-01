<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        header="Add Transaction"
        :style="{ width: '500px' }"
    >
        <form @submit.prevent="handleSubmit" class="space-y-4">
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

            <!-- Amount -->
            <div>
                <label class="block text-sm font-medium mb-2">Amount *</label>
                <InputNumber
                    v-model="formData.amount"
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

<script setup>
import { ref, reactive, watch } from 'vue';
import Calendar from 'primevue/calendar';

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

const emit = defineEmits(['update:visible', 'submit']);

const loading = ref(false);
const errors = reactive({});

const formData = reactive({
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

        // Append all form fields
        if (formData.amount) {
            submitFormData.append('amount_paid', formData.amount);
        }
        if (formData.payment_method) {
            submitFormData.append('payment_method', formData.payment_method);
        }
        if (formData.transaction_ref) {
            submitFormData.append('transaction_ref', formData.transaction_ref);
        }
        if (formData.transaction_date) {
            // Convert Date object to YYYY-MM-DD format for backend
            const date = new Date(formData.transaction_date);
            const formattedDate = date.toISOString().split('T')[0];
            submitFormData.append('transaction_date', formattedDate);
        }
        if (formData.receipt_file) {
            submitFormData.append('receipt_file', formData.receipt_file);
        }
        if (props.payment?.id) {
            submitFormData.append('payment_id', props.payment.id);
        }
        if (props.payment?.student_id) {
            submitFormData.append('student_id', props.payment.student_id);
        }

        emit('submit', submitFormData);
        resetForm();
    } catch (error) {
        console.error('Submit error:', error);
        // Handle validation errors
        if (error.response?.data?.errors) {
            Object.assign(errors, error.response.data.errors);
        } else {
            errors.general = ['An unexpected error occurred. Please try again.'];
        }
    } finally {
        loading.value = false;
    }
}

// Handle cancel
function handleCancel() {
    resetForm();
    emit('update:visible', false);
}

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
    }
});
</script>

<style scoped>
.space-y-4 > * + * {
    margin-top: 1rem;
}
</style>
