<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import HumanResourceService from '@/service/HumanResourceService.js';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    editingStaff: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'submit', 'cancel']);

const formData = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    // employee_id: '',
    department_id: '',
    position: '',
    employment_type: 'full_time',
    hire_date: '',
    salary: '',
    status: 'active',
    address: '',
    city: '',
    country: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    qualifications: [],
    experience_years: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    notes: '',
    password: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');
const departments = ref([]);
const loadingDepartments = ref(false);

const employmentTypeOptions = [
    { label: 'Full Time', value: 'full_time' },
    { label: 'Part Time', value: 'part_time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Temporary', value: 'temporary' }
];

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Terminated', value: 'terminated' }
];

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
];

const positionOptions = [
    { label: 'Principal', value: 'Principal' },
    { label: 'Vice Principal', value: 'Vice Principal' },
    { label: 'Head Teacher', value: 'Head Teacher' },
    { label: 'Senior Teacher', value: 'Senior Teacher' },
    { label: 'Teacher', value: 'Teacher' },
    { label: 'Administrator', value: 'Administrator' },
    { label: 'Secretary', value: 'Secretary' },
    { label: 'Accountant', value: 'Accountant' },
    { label: 'IT Officer', value: 'IT Officer' },
    { label: 'Librarian', value: 'Librarian' },
    { label: 'Lab Technician', value: 'Lab Technician' },
    { label: 'Support Staff', value: 'Support Staff' }
];

// Computed property for department options
const departmentOptions = computed(() => {
    return departments.value.map(dept => ({
        label: dept.department_name,
        value: dept.id
    }));
});

// Load departments from API
const loadDepartments = async () => {
    try {
        loadingDepartments.value = true;
        const data = await HumanResourceService.getDepartments();
        departments.value = data;
    } catch (err) {
        console.error('Failed to load departments:', err);
        error.value = 'Failed to load departments';
    } finally {
        loadingDepartments.value = false;
    }
};

// Watch for editing staff changes
watch(() => props.editingStaff, (newStaff) => {
    if (newStaff) {
        formData.value = { ...newStaff };
    } else {
        resetForm();
    }
});

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        // employee_id: '',
        department_id: '',
        position: '',
        employment_type: 'full_time',
        hire_date: '',
        salary: '',
        status: 'active',
        address: '',
        city: '',
        country: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        qualifications: [],
        experience_years: '',
        date_of_birth: '',
        gender: '',
        nationality: '',
        notes: '',
        password: ''
    };
    error.value = '';
}

function addQualification() {
    if (formData.value.qualifications && formData.value.qualifications.length < 10) {
        formData.value.qualifications.push('');
    }
}

function removeQualification(index) {
    formData.value.qualifications.splice(index, 1);
}

function updateQualification(index, value) {
    formData.value.qualifications[index] = value;
}

function submitForm() {
    loading.value = true;
    error.value = '';
    success.value = '';

    const submitData = { ...formData.value };

    // Only include password for new staff or if it's changed
    if (!props.editingStaff && !submitData.password) {
        submitData.password = 'temp123456'; // Default password for new staff
    }

    // Emit submit event - parent will handle async operation
    emit('submit', submitData);
}

// Method to handle successful submission
function handleSubmissionSuccess() {
    success.value = props.editingStaff ? 'Staff member updated successfully!' : 'Staff member created successfully!';

    // Hide form and reset after a short delay to show success message
    setTimeout(() => {
        resetForm();
        emit('update:visible', false);
        success.value = '';
    }, 1500);

    loading.value = false;
}

// Method to handle submission error
function handleSubmissionError(err) {
    // Display detailed error message and keep form visible
    if (err.response?.data?.errors) {
        // If there are validation errors, show them
        const validationErrors = Object.values(err.response.data.errors).flat();
        error.value = validationErrors.join(', ') || 'Validation failed. Please check the form.';
    } else {
        error.value = err.response?.data?.message || 'Failed to save staff member. Please try again.';
    }
    console.error('Form submission error:', err);
    // Don't hide the form on error - keep it visible for user to fix
    loading.value = false;
}

function cancelForm() {
    resetForm();
    emit('cancel');
    emit('update:visible', false);
}

// Load departments when component mounts
onMounted(() => {
    loadDepartments();
});

// Expose methods to parent component
defineExpose({
    handleSubmissionSuccess,
    handleSubmissionError
});
</script>

<template>
    <Card v-if="props.visible" class="w-full">
        <template #title>
            {{ editingStaff ? 'Edit Staff Member' : 'Add New Staff Member' }}
        </template>

        <template #content>
            <!-- Success Display -->
            <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-500 mr-2"></i>
                    <span class="text-green-700">{{ success }}</span>
                </div>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div class="flex items-center">
                    <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
                    <span class="text-red-700">{{ error }}</span>
                </div>
            </div>

            <form @submit.prevent="submitForm" class="p-fluid">
                <!-- Personal Information Section -->
                <div class="surface-section p-4 mb-4 border-round border-1 surface-border">
                    <div class="flex align-items-center mb-4">
                        <i class="pi pi-user text-2xl text-primary mr-3"></i>
                        <div>
                            <h6 class="text-lg font-semibold m-0 text-primary">Personal Information</h6>
                            <span class="text-600 text-sm">Basic personal details and contact information</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label for="first_name" class="block text-900 font-semibold mb-2">First Name *</label>
                            <InputText
                                id="first_name"
                                v-model="formData.first_name"
                                placeholder="Enter first name"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="last_name" class="block text-900 font-semibold mb-2">Last Name *</label>
                            <InputText
                                id="last_name"
                                v-model="formData.last_name"
                                placeholder="Enter last name"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="email" class="block text-900 font-semibold mb-2">Email Address *</label>
                            <InputText
                                id="email"
                                v-model="formData.email"
                                type="email"
                                placeholder="Enter email address"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="phone" class="block text-900 font-semibold mb-2">Phone Number *</label>
                            <InputText
                                id="phone"
                                v-model="formData.phone"
                                placeholder="Enter phone number"
                                class="w-full"
                                maxlength="10"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="date_of_birth" class="block text-900 font-semibold mb-2">Date of Birth</label>
                            <Calendar
                                id="date_of_birth"
                                v-model="formData.date_of_birth"
                                dateFormat="yy-mm-dd"
                                placeholder="Select date of birth"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="gender" class="block text-900 font-semibold mb-2">Gender</label>
                            <Dropdown
                                id="gender"
                                v-model="formData.gender"
                                :options="genderOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select gender"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1 lg:col-span-2">
                            <label for="nationality" class="block text-900 font-semibold mb-2">Nationality</label>
                            <InputText
                                id="nationality"
                                v-model="formData.nationality"
                                placeholder="Enter nationality"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>

                <!-- Employment Information Section -->
                <div class="surface-section p-4 mb-4 border-round border-1 surface-border">
                    <div class="flex align-items-center mb-4">
                        <i class="pi pi-briefcase text-2xl text-primary mr-3"></i>
                        <div>
                            <h6 class="text-lg font-semibold m-0 text-primary">Employment Information</h6>
                            <span class="text-600 text-sm">Job details, department, and employment terms</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- <div class="col-span-1">
                            <label for="employee_id" class="block text-900 font-semibold mb-2">Employee ID *</label>
                            <InputText
                                id="employee_id"
                                v-model="formData.employee_id"
                                placeholder="Enter employee ID"
                                class="w-full"
                                required
                            />
                        </div> -->

                        <div class="col-span-1">
                            <label for="department_id" class="block text-900 font-semibold mb-2">Department *</label>
                            <Dropdown
                                id="department_id"
                                v-model="formData.department_id"
                                :options="departmentOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select department"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="position" class="block text-900 font-semibold mb-2">Position *</label>
                            <Dropdown
                                id="position"
                                v-model="formData.position"
                                :options="positionOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select position"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="employment_type" class="block text-900 font-semibold mb-2">Employment Type *</label>
                            <Dropdown
                                id="employment_type"
                                v-model="formData.employment_type"
                                :options="employmentTypeOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select employment type"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="hire_date" class="block text-900 font-semibold mb-2">Hire Date </label>
                            <Calendar
                                id="hire_date"
                                v-model="formData.hire_date"
                                dateFormat="yy-mm-dd"
                                placeholder="Select hire date"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="salary" class="block text-900 font-semibold mb-2">Monthly Salary</label>
                            <InputNumber
                                id="salary"
                                v-model="formData.salary"
                                mode="currency"
                                currency="TZS"
                                placeholder="Enter salary"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="status" class="block text-900 font-semibold mb-2">Employment Status *</label>
                            <Dropdown
                                id="status"
                                v-model="formData.status"
                                :options="statusOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select status"
                                class="w-full"
                                required
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="experience_years" class="block text-900 font-semibold mb-2">Experience (Years)</label>
                            <InputNumber
                                id="experience_years"
                                v-model="formData.experience_years"
                                :min="0"
                                placeholder="Years of experience"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>

                <!-- Contact Information Section -->
                <div class="surface-section p-4 mb-4 border-round border-1 surface-border">
                    <div class="flex align-items-center mb-4">
                        <i class="pi pi-map-marker text-2xl text-primary mr-3"></i>
                        <div>
                            <h6 class="text-lg font-semibold m-0 text-primary">Contact Information</h6>
                            <span class="text-600 text-sm">Address and emergency contact details</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="col-span-1 lg:col-span-2">
                            <label for="address" class="block text-900 font-semibold mb-2">Residential Address</label>
                            <InputText
                                id="address"
                                v-model="formData.address"
                                placeholder="Enter full address"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="city" class="block text-900 font-semibold mb-2">City</label>
                            <InputText
                                id="city"
                                v-model="formData.city"
                                placeholder="Enter city"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="country" class="block text-900 font-semibold mb-2">Country</label>
                            <InputText
                                id="country"
                                v-model="formData.country"
                                placeholder="Enter country"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="emergency_contact_name" class="block text-900 font-semibold mb-2">Emergency Contact Name</label>
                            <InputText
                                id="emergency_contact_name"
                                v-model="formData.emergency_contact_name"
                                placeholder="Emergency contact name"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="emergency_contact_phone" class="block text-900 font-semibold mb-2">Emergency Contact Phone</label>
                            <InputText
                                id="emergency_contact_phone"
                                v-model="formData.emergency_contact_phone"
                                placeholder="Emergency contact phone"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>

                <!-- Qualifications Section -->
                <div class="surface-section p-4 mb-4 border-round border-1 surface-border">
                    <div class="flex align-items-center mb-4">
                        <i class="pi pi-graduation-cap text-2xl text-primary mr-3"></i>
                        <div>
                            <h6 class="text-lg font-semibold m-0 text-primary">Qualifications</h6>
                            <span class="text-600 text-sm">Academic and professional qualifications</span>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(qualification, index) in formData.qualifications" :key="index" class="flex gap-3">
                            <div class="flex-1">
                                <InputText
                                    v-model="formData.qualifications[index]"
                                    placeholder="Enter qualification (e.g., Bachelor of Education)"
                                    class="w-full"
                                />
                            </div>
                            <Button
                                icon="pi pi-trash"
                                class="p-button-outlined p-button-danger"
                                @click="removeQualification(index)"
                                v-tooltip="'Remove qualification'"
                            />
                        </div>
                        <Button
                            icon="pi pi-plus"
                            label="Add Qualification"
                            class="p-button-outlined"
                            @click="addQualification"
                            :disabled="formData.qualifications.length >= 10"
                        />
                    </div>
                </div>

                <!-- Additional Information Section -->
                <div class="surface-section p-4 mb-4 border-round border-1 surface-border">
                    <div class="flex align-items-center mb-4">
                        <i class="pi pi-info-circle text-2xl text-primary mr-3"></i>
                        <div>
                            <h6 class="text-lg font-semibold m-0 text-primary">Additional Information</h6>
                            <span class="text-600 text-sm">Notes and account security</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="col-span-1">
                            <label for="notes" class="block text-900 font-semibold mb-2">Additional Notes</label>
                            <Textarea
                                id="notes"
                                v-model="formData.notes"
                                placeholder="Enter any additional notes or remarks"
                                rows="4"
                                class="w-full"
                            />
                        </div>

                        <div class="col-span-1">
                            <label for="password" class="block text-900 font-semibold mb-2">
                                {{ editingStaff ? 'New Password (leave blank to keep current)' : 'Account Password *' }}
                            </label>
                            <Password
                                id="password"
                                v-model="formData.password"
                                :placeholder="editingStaff ? 'Enter new password' : 'Enter password'"
                                :feedback="!editingStaff"
                                toggleMask
                                class="w-full"
                                :class="{ 'p-invalid': !editingStaff && !formData.password }"
                            />
                            <small v-if="!editingStaff && !formData.password" class="text-red-500">Password is required for new staff</small>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-content-end gap-3 mt-6 p-4 surface-card border-round border-1 surface-border">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="p-button-outlined p-button-secondary"
                        @click="cancelForm"
                        :disabled="loading"
                        size="large"
                    />
                    <Button
                        :label="editingStaff ? 'Update Staff Member' : 'Add Staff Member'"
                        icon="pi pi-save"
                        type="submit"
                        class="p-button-primary"
                        :loading="loading"
                        :disabled="loading"
                        size="large"
                    />
                </div>
            </form>
        </template>
    </Card>
</template>
