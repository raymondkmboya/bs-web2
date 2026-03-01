<script setup>
import { ref, computed, onMounted } from 'vue';
import StudentService from '@/service/StudentService';
import AcademicService from '@/service/AcademicService';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Tag from 'primevue/tag';
import Card from 'primevue/card';

const props = defineProps({
    studentData: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'save']);

const saving = ref(false);
const error = ref('');
const successMessage = ref('');
const showError = ref(false);

// Photo upload
const photoFile = ref(null);
const photoPreview = ref(null);

const admissionData = ref({
    class_level_id: props.studentData.class_level_id || null,
    class_level_stream_id: props.studentData.class_level_stream_id || null,
    admission_number: '',
    admission_date: new Date(),
    level: '',
    stream: '',
    class: ''
});

// Create reactive student data for form binding
const studentFormData = ref({
    ...props.studentData,
    date_of_birth: props.studentData.date_of_birth ? new Date(props.studentData.date_of_birth) : null
});

const firstParent = ref({
    name: props.studentData.parent?.parent_name || '',
    email: props.studentData.parent?.parent_email || '',
    phone: props.studentData.parent?.parent_phone || '',
    relationship: props.studentData.parent?.relationship_to_student || ''
});

const secondParent = ref({
    name: '',
    email: '',
    phone: '',
    relationship: ''
});

// Options
const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
];

const relationshipOptions = [
    { label: 'Father', value: 'father' },
    { label: 'Mother', value: 'mother' },
    { label: 'Guardian', value: 'guardian' },
    { label: 'Relative', value: 'relative' }
];

const classLevelOptions = ref([]);
const streamOptions = ref([]);

// Payment calculations
const initialFee = ref(10000);
const amountPaid = ref(0);
const balance = computed(() => initialFee.value - amountPaid.value);

// Payment method data
const paymentMethod = ref('Cash');
const transactionRef = ref('');
const selcomPhone = ref('');
const transactionReceipt = ref(null);

const paymentMethodOptions = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Selcom Pay', value: 'Selcom Pay' },
    { label: 'M-Pesa', value: 'M-Pesa' },
    { label: 'Tigo Pesa', value: 'Tigo Pesa' },
    { label: 'Airtel Money', value: 'Airtel Money' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'Bank Deposit', value: 'Bank Deposit' }
];

const paymentStatus = computed(() => {
    if (amountPaid.value >= initialFee.value) return 'Paid';
    if (amountPaid.value > 0) return 'Partial';
    return 'Unpaid';
});

const paymentSeverity = computed(() => {
    switch (paymentStatus.value) {
        case 'Paid': return 'success';
        case 'Partial': return 'warning';
        default: return 'danger';
    }
});

// Methods
const onPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        photoFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const onTransactionReceiptChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        transactionReceipt.value = file;
    }
};

const onClassLevelChange = () => {
    // Load streams based on selected class level
    loadStreams();
};

const loadStreams = async () => {
    if (!admissionData.value.class_level_id) {
        streamOptions.value = [];
        return;
    }
    try {
        // Use the new separate function for filtered streams
        const streams = await AcademicService.getStreamsByClassLevel(admissionData.value.class_level_id);
        streamOptions.value = streams || [];
    } catch (error) {
        console.error('Error loading streams:', error);
        streamOptions.value = [];
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS'
    }).format(amount);
};

const saveAdmission = async () => {
    console.log('🚀 saveAdmission called, saving.value:', saving.value);
    saving.value = true;
    try {
        // Create FormData for file upload
        const formData = new FormData();

        // Add all admission data with correct types
        formData.append('admission_number', admissionData.value.admission_number || '');
        formData.append('admission_date', admissionData.value.admission_date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        formData.append('class_level_id', admissionData.value.class_level_id);
        formData.append('class_level_stream_id', admissionData.value.class_level_stream_id || '');

        // Add student data as JSON string (Laravel will decode this)
        formData.append('student_data', JSON.stringify(studentFormData.value));
        formData.append('first_parent', JSON.stringify(firstParent.value));
        if (secondParent.value.name) {
            formData.append('second_parent', JSON.stringify(secondParent.value));
        }

        // Add photo if selected
        if (photoFile.value) {
            formData.append('photo', photoFile.value);
        }

        // Add payment data with correct types
        formData.append('payment_method', paymentMethod.value);
        formData.append('amount_paid', amountPaid.value.toString()); // Ensure string for FormData
        formData.append('transaction_ref', transactionRef.value);
        formData.append('selcom_phone', selcomPhone.value);

        // Add receipt if selected
        if (transactionReceipt.value) {
            formData.append('transaction_receipt', transactionReceipt.value);
        }

        console.log('FormData payload:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await StudentService.admitStudent(props.studentData.id, formData);
        console.log('✅ Student admitted successfully!');
        handleSuccess('Student admitted successfully!');
        console.log('📤 Emitting save and close events...');
        emit('save', formData);
        emit('close');
    } catch (error) {
        console.log('❌ Error in saveAdmission:', error);
        handleError(error);
    } finally {
        console.log('🏁 saveAdmission finished, resetting saving.value');
        saving.value = false;
    }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

function handleSuccess(message) {
    successMessage.value = message;
    showError.value = false;
}

function handleError(err) {
    if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        error.value = validationErrors.join(', ') || 'Validation failed. Please check form.';
    } else {
        error.value = err.response?.data?.message || 'Failed to save admission. Please try again.';
    }
    showError.value = true;
    successMessage.value = '';
}

onMounted(async () => {
    try {
        const levels = await AcademicService.getClassLevels();
        classLevelOptions.value = levels || [];
        // Set initial photo preview
        if (props.studentData.profile_image) {
            photoPreview.value = props.studentData.profile_image;
        }
        // Load streams for current class level
        loadStreams();
    } catch (error) {
        console.error('Error loading class levels:', error);
    }
});

</script>

<template>
    <Card class="w-full">
        <template #title>
            Student Admission Form
        </template>

        <template #content>
            <!-- Success Display -->
            <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-500 mr-2"></i>
                    <span class="text-green-700">{{ successMessage }}</span>
                </div>
            </div>

            <!-- Error Display -->
            <div v-if="showError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div class="flex items-center">
                    <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
                    <span class="text-red-700">{{ error }}</span>
                </div>
            </div>

            <form @submit.prevent="saveAdmission" class="p-fluid">
                <div class="flex flex-col gap-6">
                    <!-- Student Information Section -->
                    <div class="surface-section p-4 mb-2 border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-user text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Student Information</h6>
                                <span class="text-600 text-sm">Basic personal details and contact information</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="col-span-1">
                                <label for="student_number" class="block text-900 font-semibold mb-2">Student Number</label>
                                <InputText id="student_number" v-model="studentFormData.student_number" disabled class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="first_name" class="block text-900 font-semibold mb-2">First Name</label>
                                <InputText id="first_name" v-model="studentFormData.first_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="middle_name" class="block text-900 font-semibold mb-2">Middle Name</label>
                                <InputText id="middle_name" v-model="studentFormData.middle_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="last_name" class="block text-900 font-semibold mb-2">Last Name</label>
                                <InputText id="last_name" v-model="studentFormData.last_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="email" class="block text-900 font-semibold mb-2">Email Address</label>
                                <InputText id="email" v-model="studentFormData.email" type="email" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="phone" class="block text-900 font-semibold mb-2">Phone Number</label>
                                <InputText id="phone" maxlength="10" v-model="studentFormData.phone" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="date_of_birth" class="block text-900 font-semibold mb-2">Date of Birth</label>
                                <Calendar id="date_of_birth" v-model="studentFormData.date_of_birth" dateFormat="dd/mm/yy" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="gender" class="block text-900 font-semibold mb-2">Gender</label>
                                <Dropdown
                                    id="gender"
                                    v-model="studentFormData.gender"
                                    :options="genderOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select gender"
                                    class="w-full"
                                />
                            </div>
                            <div class="col-span-1">
                                <label for="photo" class="block text-900 font-semibold mb-2">Student Photo</label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    @change="onPhotoChange"
                                    class="w-full p-2 border-1 border-300 border-round"
                                />
                                <div v-if="photoPreview" class="mt-2">
                                    <img :src="photoPreview" alt="Student Photo" class="w-32 h-32 object-cover border-round border-1 border-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Class Assignment Section -->
                    <div class="surface-section p-4 mb-2 border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-book text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Class Assignment</h6>
                                <span class="text-600 text-sm">Assign student to appropriate class and stream</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-1">
                                <label for="class_level" class="block text-900 font-semibold mb-2">Class Level *</label>
                                <Dropdown
                                    id="class_level"
                                    v-model="admissionData.class_level_id"
                                    :options="classLevelOptions"
                                    optionValue="id"
                                    optionLabel="class_level_name"
                                    placeholder="Select class level"
                                    @change="onClassLevelChange"
                                    class="w-full"
                                />
                            </div>
                            <div class="col-span-1">
                                <label for="class_stream" class="block text-900 font-semibold mb-2">Class Stream</label>
                                <Dropdown
                                    id="class_stream"
                                    v-model="admissionData.class_level_stream_id"
                                    :options="streamOptions"
                                    optionValue="id"
                                    optionLabel="class_level_stream_name"
                                    placeholder="Select stream"
                                    :disabled="!admissionData.class_level_id"
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Parents Information Section -->
                    <div class="surface-section p-4 mb-2 border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-users text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Parents/Guardians Information</h6>
                                <span class="text-600 text-sm">Parent and guardian contact details</span>
                            </div>
                        </div>

                        <!-- First Parent -->
                        <div class="mb-4">
                            <h6 class="text-lg font-semibold mb-3 text-primary">First Parent/Guardian</h6>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div class="col-span-1">
                                    <label for="parent1_name" class="block text-900 font-semibold mb-2">Name *</label>
                                    <InputText id="parent1_name" v-model="firstParent.name" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent1_email" class="block text-900 font-semibold mb-2">Email</label>
                                    <InputText id="parent1_email" v-model="firstParent.email" type="email" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent1_phone" class="block text-900 font-semibold mb-2">Phone *</label>
                                    <InputText id="parent1_phone" maxlength="10" v-model="firstParent.phone" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent1_relationship" class="block text-900 font-semibold mb-2">Relationship</label>
                                    <Dropdown
                                        id="parent1_relationship"
                                        v-model="firstParent.relationship"
                                        :options="relationshipOptions"
                                        optionValue="value"
                                        optionLabel="label"
                                        placeholder="Select relationship"
                                        class="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Second Parent -->
                        <div>
                            <h6 class="text-lg font-semibold mb-3 text-primary">Second Parent/Guardian (Optional)</h6>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div class="col-span-1">
                                    <label for="parent2_name" class="block text-900 font-semibold mb-2">Name</label>
                                    <InputText id="parent2_name" v-model="secondParent.name" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent2_email" class="block text-900 font-semibold mb-2">Email</label>
                                    <InputText id="parent2_email" v-model="secondParent.email" type="email" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent2_phone" class="block text-900 font-semibold mb-2">Phone</label>
                                    <InputText id="parent2_phone" maxlength="10" v-model="secondParent.phone" class="w-full" />
                                </div>
                                <div class="col-span-1">
                                    <label for="parent2_relationship" class="block text-900 font-semibold mb-2">Relationship</label>
                                    <Dropdown
                                        id="parent2_relationship"
                                        v-model="secondParent.relationship"
                                        :options="relationshipOptions"
                                        optionValue="value"
                                        optionLabel="label"
                                        placeholder="Select relationship"
                                        class="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Information Section -->
                    <div class="surface-section p-4 mb-2 border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-money-bill text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Payment Information</h6>
                                <span class="text-600 text-sm">Registration fee status and payment details</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div class="col-span-1">
                                <label class="block text-900 font-semibold mb-2">Registration Fee Status</label>
                                <Tag :value="paymentStatus" :severity="paymentSeverity" class="w-full justify-content-center" />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-900 font-semibold mb-2">Initial Fee Amount</label>
                                <div class="p-3 border-1 border-300 border-round bg-gray-50">
                                    <strong class="text-lg">TSh {{ formatCurrency(initialFee) }}</strong>
                                </div>
                            </div>
                            <div class="col-span-1">
                                <label for="amount_paid" class="block text-900 font-semibold mb-2">Amount Paid</label>
                                <InputText
                                    id="amount_paid"
                                    v-model="amountPaid"
                                    type="number"
                                    placeholder="Enter amount paid"
                                    class="w-full"
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-900 font-semibold mb-2">Balance</label>
                                <div class="p-3 border-1 border-300 border-round bg-gray-50">
                                    <strong class="text-lg">TSh {{ formatCurrency(balance) }}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-1">
                                <label for="payment_method" class="block text-900 font-semibold mb-2">Payment Method *</label>
                                <Dropdown
                                    id="payment_method"
                                    v-model="paymentMethod"
                                    :options="paymentMethodOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select payment method"
                                    class="w-full"
                                />
                            </div>

                            <!-- Transaction Reference for Mobile Money -->
                            <div class="col-span-1" v-if="['M-Pesa', 'Tigo Pesa', 'Airtel Money'].includes(paymentMethod)">
                                <label for="transaction_ref" class="block text-900 font-semibold mb-2">Transaction Reference *</label>
                                <InputText
                                    id="transaction_ref"
                                    v-model="transactionRef"
                                    placeholder="Enter transaction ID"
                                    class="w-full"
                                />
                            </div>

                            <!-- Selcom Phone Number -->
                            <div class="col-span-1" v-if="paymentMethod === 'Selcom Pay'">
                                <label for="selcom_phone" class="block text-900 font-semibold mb-2">Selcom Phone Number *</label>
                                <InputText
                                    id="selcom_phone"
                                    v-model="selcomPhone"
                                    placeholder="Enter Selcom phone number"
                                    class="w-full"
                                    maxlength="10"
                                />
                            </div>

                            <!-- Transaction Receipt for Bank Methods -->
                            <div class="col-span-1" v-if="['Bank Deposit', 'Bank Transfer'].includes(paymentMethod)">
                                <label for="transaction_receipt" class="block text-900 font-semibold mb-2">Transaction Receipt *</label>
                                <input
                                    id="transaction_receipt"
                                    type="file"
                                    accept="image/*,.pdf"
                                    @change="onTransactionReceiptChange"
                                    class="w-full p-2 border-1 border-300 border-round"
                                />
                                <small v-if="transactionReceipt" class="text-green-600">
                                    <i class="pi pi-check mr-1"></i>
                                    {{ transactionReceipt.name }}
                                </small>
                            </div>

                            <!-- Transaction Reference for Bank Methods -->
                            <div class="col-span-1" v-if="['Bank Deposit', 'Bank Transfer'].includes(paymentMethod)">
                                <label for="bank_transaction_ref" class="block text-900 font-semibold mb-2">Transaction Reference *</label>
                                <InputText
                                    id="bank_transaction_ref"
                                    v-model="transactionRef"
                                    placeholder="Enter transaction reference number"
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-content-end gap-2">
                        <Button
                            label="Save Admission"
                            icon="pi pi-save"
                            type="submit"
                            class="p-button-primary"
                            :loading="saving"
                        />
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            @click="$emit('close')"
                            class="p-button-secondary"
                        />
                    </div>
                </div>
            </form>
        </template>
    </Card>
</template>

<style scoped>
.surface-section {
    background: var(--surface-card);
}

.border-round {
    border-radius: 6px;
}

.border-1 {
    border-width: 1px;
}

.surface-border {
    border-color: var(--surface-border);
}

.text-primary {
    color: var(--primary-color);
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.justify-content-center {
    justify-content: center;
}
</style>
