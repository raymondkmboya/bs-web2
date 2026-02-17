<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import AcademicService from '../../service/AcademicService.js';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'submit', 'close']);

// State for class levels
const classLevels = ref([]);
const loadingClassLevels = ref(false);
const error = ref('');
const successMessage = ref('');
const showError = ref(false);
const loading = ref(false);

const formData = ref({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: null,
    gender: '',
    address: '',
    region: '',
    previous_school: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    relationship_to_student: '',
    class_level_id: '',
    registration_fee: 10000,
    payment_method: '',
    selcom_phone: ''
});

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
];

const regionOptions = [
    { label: 'Arusha', value: 'arusha' },
    { label: 'Dar es Salaam', value: 'dar es salaam' },
    { label: 'Dodoma', value: 'dodoma' },
    { label: 'Geita', value: 'geita' },
    { label: 'Iringa', value: 'iringa' },
    { label: 'Kagera', value: 'kagera' },
    { label: 'Katavi', value: 'katavi' },
    { label: 'Kigoma', value: 'kigoma' },
    { label: 'Kilimanjaro', value: 'kilimanjaro' },
    { label: 'Lindi', value: 'lindi' },
    { label: 'Manyara', value: 'manyara' },
    { label: 'Mara', value: 'mara' },
    { label: 'Mbeya', value: 'mbeya' },
    { label: 'Morogoro', value: 'morogoro' },
    { label: 'Mtwara', value: 'mtwara' },
    { label: 'Mwanza', value: 'mwanza' },
    { label: 'Njombe', value: 'njombe' },
    { label: 'Pwani', value: 'pwani' },
    { label: 'Rukwa', value: 'rukwa' },
    { label: 'Ruvuma', value: 'ruvuma' },
    { label: 'Shinyanga', value: 'shinyanga' },
    { label: 'Simiyu', value: 'simiyu' },
    { label: 'Singida', value: 'singida' },
    { label: 'Tabora', value: 'tabora' },
    { label: 'Tanga', value: 'tanga' }
];

const relationshipOptions = [
    { label: 'Father', value: 'father' },
    { label: 'Mother', value: 'mother' },
    { label: 'Guardian', value: 'guardian' },
    { label: 'Uncle', value: 'uncle' },
    { label: 'Aunt', value: 'aunt' },
    { label: 'Grandfather', value: 'grandfather' },
    { label: 'Grandmother', value: 'grandmother' },
    { label: 'Other', value: 'other' }
];

const paymentMethodOptions = [
    { label: 'Cash', value: 'Cash' },
    // { label: 'Card', value: 'Card' },
    // { label: 'Bank Deposit', value: 'Bank Deposit' },
    { label: 'Selcom Pay', value: 'Selcom Pay' },
    { label: 'Tigo Pesa', value: 'Tigo Pesa' },
    { label: 'Airtel Money', value: 'Airtel Money' },
    { label: 'Mpesa', value: 'Mpesa' },
    // { label: 'Cheque', value: 'Cheque' }

];

// Computed property for class level options
const classLevelOptions = computed(() => {
    return classLevels.value.map(level => ({
        label: level.class_level_name,
        value: level.id
    }));
});

// Load class levels from API
const loadClassLevels = async () => {
    try {
        loadingClassLevels.value = true;
        const data = await AcademicService.getClassLevels();
        classLevels.value = data;
    } catch (err) {
        console.error('Failed to load class levels:', err);
        error.value = 'Failed to load class levels';
    } finally {
        loadingClassLevels.value = false;
    }
};

// Watch for visibility changes to reset form
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

// Load class levels when component mounts
onMounted(() => {
    loadClassLevels();
});

function resetForm() {
    formData.value = {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: null,
        gender: '',
        address: '',
        region: '',
        previous_school: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        relationship_to_student: '',
        class_level_id: '',
        registration_fee: 10000,
        payment_method: '',
        selcom_phone: ''
    };
    error.value = '';
    successMessage.value = '';
    showError.value = false;
}

function submitForm() {
    loading.value = true;
    error.value = '';
    successMessage.value = '';

    // Format data for submission
    const submissionData = {
        ...formData.value,
        registration_date: new Date().toISOString().split('T')[0], // Auto-generate current date
        date_of_birth: formData.value.date_of_birth ? formData.value.date_of_birth.toISOString().split('T')[0] : null
    };

    // Add Selcom phone to main phone if provided
    if (formData.value.payment_method === 'Selcom Pay' && formData.value.selcom_phone) {
        submissionData.phone = formData.value.selcom_phone;
    }

    // Emit submit event - parent will handle async operation
    emit('submit', submissionData);
}

function cancelForm() {
    resetForm();
    emit('update:visible', false); // Hide form when cancelled
}

// Success and error handlers
function handleSuccess(message) {
    successMessage.value = message;
    showError.value = false;
    error.value = '';

    // Hide form and reset after a short delay to show success message
    setTimeout(() => {
        resetForm();
        emit('update:visible', false);
        successMessage.value = '';
    }, 1500);

    loading.value = false;
}

function handleError(err) {
    // Display detailed error message and keep form visible
    if (err.response?.data?.errors) {
        // If there are validation errors, show them
        const validationErrors = Object.values(err.response.data.errors).flat();
        error.value = validationErrors.join(', ') || 'Validation failed. Please check the form.';
    } else {
        error.value = err.response?.data?.message || 'Failed to save registration. Please try again.';
    }
    showError.value = true;
    successMessage.value = '';
    console.error('Form submission error:', err);
    // Don't hide the form on error - keep it visible for user to fix
    loading.value = false;
}

// Expose methods to parent
defineExpose({
    handleSuccess,
    handleError
});
</script>

<template>
    <Card v-if="visible" class="w-full">
        <template #title>
            Add New Registration
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

            <form @submit.prevent="submitForm" class="p-fluid">
                <div class="flex flex-col gap-6">
                    <!-- Student Information Section -->
                    <div class="surface-section p-4 mb-2 border-round border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-user text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Student Information</h6>
                                <span class="text-600 text-sm">Basic personal details and contact information</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="col-span-1">
                                <label for="first_name" class="block text-900 font-semibold mb-2">First Name *</label>
                                <InputText id="first_name" v-model="formData.first_name" placeholder="Enter first name" required class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="middle_name" class="block text-900 font-semibold mb-2">Middle Name</label>
                                <InputText id="middle_name" v-model="formData.middle_name" placeholder="Enter middle name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="last_name" class="block text-900 font-semibold mb-2">Last Name *</label>
                                <InputText id="last_name" v-model="formData.last_name" placeholder="Enter last name" required class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="email" class="block text-900 font-semibold mb-2">Email Address</label>
                                <InputText id="email" v-model="formData.email" type="email" placeholder="Enter email address" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="phone" class="block text-900 font-semibold mb-2">Phone Number *</label>
                                <InputText id="phone" maxlength="10" v-model="formData.phone" placeholder="Enter phone number" required class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="date_of_birth" class="block text-900 font-semibold mb-2">Date of Birth *</label>
                                <Calendar id="date_of_birth" v-model="formData.date_of_birth" dateFormat="dd/mm/yy" placeholder="Select date of birth" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="gender" class="block text-900 font-semibold mb-2">Gender *</label>
                                <Dropdown
                                    id="gender"
                                    v-model="formData.gender"
                                    :options="genderOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select gender"
                                    required
                                    class="w-full"
                                />
                            </div>
                            <div class="col-span-1">
                                <label for="address" class="block text-900 font-semibold mb-2">Residential Address *</label>
                                <InputText id="address" required v-model="formData.address" placeholder="Enter residential address" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="region" class="block text-900 font-semibold mb-2">Region *</label>
                                <Dropdown
                                    id="region"
                                    v-model="formData.region"
                                    :options="regionOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select region"
                                    required
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Academic Information Section -->
                    <div class="surface-section p-4 mb-2 border-round border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-book text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Academic Information</h6>
                                <span class="text-600 text-sm">Previous school and class details</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-1">
                                <label for="previous_school" class="block text-900 font-semibold mb-2">Previous School</label>
                                <InputText id="previous_school" v-model="formData.previous_school" placeholder="Enter previous school" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="class_level_id" class="block text-900 font-semibold mb-2">Applied Class *</label>
                                <Dropdown
                                    id="class_level_id"
                                    v-model="formData.class_level_id"
                                    :options="classLevelOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select class"
                                    required
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Parent Information Section -->
                    <div class="surface-section p-4 mb-2 border-round border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-users text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Parent Information</h6>
                                <span class="text-600 text-sm">Parent/guardian contact and relationship details</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="col-span-1 lg:col-span-2">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="parent_name" class="block text-900 font-semibold mb-2">Parent Name *</label>
                                        <InputText id="parent_name" v-model="formData.parent_name" placeholder="Enter parent name" required class="w-full" />
                                    </div>
                                    <div>
                                        <label for="relationship_to_student" class="block text-900 font-semibold mb-2">Relationship to Student *</label>
                                        <Dropdown
                                            id="relationship_to_student"
                                            v-model="formData.relationship_to_student"
                                            :options="relationshipOptions"
                                            optionValue="value"
                                            optionLabel="label"
                                            placeholder="Select relationship"
                                            required
                                            class="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-1 lg:col-span-2">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="parent_email" class="block text-900 font-semibold mb-2">Parent Email</label>
                                        <InputText id="parent_email" v-model="formData.parent_email" type="email" placeholder="Enter parent email" class="w-full" />
                                    </div>
                                    <div>
                                        <label for="parent_phone" class="block text-900 font-semibold mb-2">Parent Phone *</label>
                                        <InputText id="parent_phone" maxlength="10" v-model="formData.parent_phone" placeholder="Enter parent phone" required class="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registration Details Section -->
                    <div class="surface-section p-4 mb-2 border-round border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-calendar text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Registration Details</h6>
                                <span class="text-600 text-sm">Registration date and administrative information</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="col-span-1">
                                <label for="registration_fee" class="block text-900 font-semibold mb-2">Registration Fee (TZS)</label>
                                <InputText id="registration_fee" v-model="formData.registration_fee" disabled placeholder="10000" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="payment_method" class="block text-900 font-semibold mb-2">Payment Method *</label>
                                <Dropdown
                                    id="payment_method"
                                    v-model="formData.payment_method"
                                    :options="paymentMethodOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select payment method"
                                    required
                                    class="w-full"
                                />
                            </div>
                            <div v-if="formData.payment_method === 'Selcom Pay'" class="col-span-1">
                                <label for="selcom_phone" class="block text-900 font-semibold mb-2">Selcom Phone Number *</label>
                                <InputText
                                    id="selcom_phone"
                                    v-model="formData.selcom_phone"
                                    placeholder="Enter Selcom phone number"
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-content-end gap-2 mt-4">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            @click="cancelForm"
                            class="p-button-text"
                        />
                        <Button
                            label="Submit Registration"
                            icon="pi pi-check"
                            type="submit"
                            :loading="loading"
                            :disabled="loading"
                            autofocus
                        />
                    </div>
                </div>
            </form>
        </template>
    </Card>
</template>
