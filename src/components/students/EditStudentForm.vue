<script setup>
import { ref, computed, onMounted } from 'vue';
import StudentService from '@/service/StudentService';
import AcademicService from '@/service/AcademicService';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
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

// Subjects data
const selectedSubjects = ref([]);
const subjectOptions = ref([]);

// Tanzanian regions data
const regionOptions = ref([
    { label: 'Arusha', value: 'Arusha' },
    { label: 'Dar es Salaam', value: 'Dar es Salaam' },
    { label: 'Dodoma', value: 'Dodoma' },
    { label: 'Geita', value: 'Geita' },
    { label: 'Iringa', value: 'Iringa' },
    { label: 'Kagera', value: 'Kagera' },
    { label: 'Katavi', value: 'Katavi' },
    { label: 'Kigoma', value: 'Kigoma' },
    { label: 'Kilimanjaro', value: 'Kilimanjaro' },
    { label: 'Lindi', value: 'Lindi' },
    { label: 'Manyara', value: 'Manyara' },
    { label: 'Mara', value: 'Mara' },
    { label: 'Mbeya', value: 'Mbeya' },
    { label: 'Morogoro', value: 'Morogoro' },
    { label: 'Mtwara', value: 'Mtwara' },
    { label: 'Mwanza', value: 'Mwanza' },
    { label: 'Njombe', value: 'Njombe' },
    { label: 'Pwani', value: 'Pwani' },
    { label: 'Rukwa', value: 'Rukwa' },
    { label: 'Ruvuma', value: 'Ruvuma' },
    { label: 'Shinyanga', value: 'Shinyanga' },
    { label: 'Simiyu', value: 'Simiyu' },
    { label: 'Singida', value: 'Singida' },
    { label: 'Tabora', value: 'Tabora' },
    { label: 'Tanga', value: 'Tanga' }
]);

const admissionData = ref({
    class_level_id: props.studentData.class_level_id || null,
    class_level_stream_id: props.studentData.class_level_stream_id || null,
    admission_number: props.studentData.admission_number || '',
    admission_date: props.studentData.admission_date ? new Date(props.studentData.admission_date) : new Date(),
    level: '',
    stream: '',
    class: ''
});

// Create reactive student data for form binding
const studentFormData = ref({
    student_number: props.studentData.student_number || '',
    first_name: props.studentData.first_name || '',
    middle_name: props.studentData.middle_name || '',
    last_name: props.studentData.last_name || '',
    email: props.studentData.email || '',
    phone: props.studentData.phone || '',
    date_of_birth: props.studentData.date_of_birth ? new Date(props.studentData.date_of_birth) : null,
    gender: props.studentData.gender || '',
    street: props.studentData.address?.street || '',
    city: props.studentData.address?.city || '',
    region: props.studentData.address?.region || ''
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
    loadStreams();
    loadSubjects();
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

const loadSubjects = async () => {
    try {
        subjectOptions.value = await AcademicService.getSubjectsByClassLevel(admissionData.value.class_level_id);
    } catch (error) {
        console.error('Error loading subjects:', error);
        subjectOptions.value = [];
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS'
    }).format(amount);
};

const saveStudent = async () => {
    console.log('🚀 saveStudent called, saving.value:', saving.value);
    saving.value = true;
    error.value = '';
    successMessage.value = '';
    showError.value = false;

    try {
        // Validate email if provided
        if (studentFormData.value.email && studentFormData.value.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(studentFormData.value.email)) {
                error.value = 'Please enter a valid email address.';
                showError.value = true;
                saving.value = false;
                return;
            }
        }

        // Combine all form data
        const formData = {
            // Student basic information
            student_number: studentFormData.value.student_number,
            first_name: studentFormData.value.first_name,
            middle_name: studentFormData.value.middle_name,
            last_name: studentFormData.value.last_name,
            email: studentFormData.value.email?.trim() || null, // Send null if empty to avoid validation
            phone: studentFormData.value.phone,
            date_of_birth: studentFormData.value.date_of_birth,
            gender: studentFormData.value.gender,
            
            // Address information as separate fields
            street: studentFormData.value.street || '',
            city: studentFormData.value.city || '',
            region: studentFormData.value.region || '',
            
            // Class assignment (class level is disabled, so it won't change)
            class_level_id: admissionData.value.class_level_id,
            class_level_stream_id: admissionData.value.class_level_stream_id,
            
            // Subjects
            subjects: selectedSubjects.value,
            
            // Parent information
            parents: [
                {
                    name: firstParent.value.name,
                    email: firstParent.value.email,
                    phone: firstParent.value.phone,
                    relationship: firstParent.value.relationship
                },
                {
                    name: secondParent.value.name,
                    email: secondParent.value.email,
                    phone: secondParent.value.phone,
                    relationship: secondParent.value.relationship
                }
            ].filter(parent => parent.name) // Only include parents with names
        };

        // Add photo if changed
        if (photoFile.value) {
            formData.profile_image = photoFile.value;
        }

        console.log('📤 Sending updated student data:', formData);
        
        // Call the update student API
        const response = await StudentService.updateStudent(props.studentData.id, formData);
        
        console.log('✅ Student updated successfully:', response);
        
        // Show success message
        successMessage.value = 'Student information updated successfully!';
        
        // Emit save event with the response data
        emit('save', response.data);
        
    } catch (err) {
        console.error('❌ Error updating student:', err);
        
        if (err.response?.status === 422 && err.response.data.errors) {
            // Validation errors
            const validationErrors = Object.values(err.response.data.errors).flat();
            error.value = validationErrors.join(', ') || 'Validation failed. Please check form.';
        } else {
            error.value = err.response?.data?.message || 'Failed to update student. Please try again.';
        }
        showError.value = true;
        successMessage.value = '';
    } finally {
        saving.value = false;
    }
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
        error.value = err.response?.data?.message || 'Failed to save student. Please try again.';
    }
    showError.value = true;
    successMessage.value = '';
}

onMounted(async () => {
    try {
        const levels = await AcademicService.getClassLevels();
        classLevelOptions.value = levels || [];
        await loadSubjects();
        // Set initial photo preview
        if (props.studentData.profile_image) {
            photoPreview.value = props.studentData.profile_image;
        }
        // Populate selected subjects from existing student data
        if (props.studentData.subjects && props.studentData.subjects.length > 0) {
            selectedSubjects.value = props.studentData.subjects.map(subject => subject.id);
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
            Edit Student Form
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

            <form @submit.prevent="saveStudent" class="p-fluid">
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

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="col-span-1">
                                <label for="student_number" class="block text-900 font-semibold mb-2">Student Number</label>
                                <InputText id="student_number" v-model="studentFormData.student_number" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="first_name" class="block text-900 font-semibold mb-2">First Name *</label>
                                <InputText id="first_name" v-model="studentFormData.first_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="middle_name" class="block text-900 font-semibold mb-2">Middle Name</label>
                                <InputText id="middle_name" v-model="studentFormData.middle_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="last_name" class="block text-900 font-semibold mb-2">Last Name *</label>
                                <InputText id="last_name" v-model="studentFormData.last_name" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="email" class="block text-900 font-semibold mb-2">Email</label>
                                <InputText id="email" v-model="studentFormData.email" type="email" class="w-full" />
                            </div>
                            <div class="col-span-1">
                                <label for="phone" class="block text-900 font-semibold mb-2">Phone</label>
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
                        </div>
                    </div>

                    <!-- Address Information Section -->
                    <div class="surface-section p-4 mb-2 border-1 surface-border">
                        <div class="flex align-items-center mb-2">
                            <i class="pi pi-home text-2xl text-primary mr-3"></i>
                            <div>
                                <h6 class="text-lg font-semibold m-0 text-primary">Address Information</h6>
                                <span class="text-600 text-sm">Student residential address details</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="col-span-2">
                                <label for="street" class="block text-900 font-semibold mb-2">Street Address</label>
                                <InputText id="street" v-model="studentFormData.street" class="w-full" placeholder="Enter street address" />
                            </div>
                            <div class="col-span-1">
                                <label for="city" class="block text-900 font-semibold mb-2">City</label>
                                <InputText id="city" v-model="studentFormData.city" class="w-full" placeholder="Enter city" />
                            </div>
                            <div class="col-span-1">
                                <label for="region" class="block text-900 font-semibold mb-2">Region</label>
                                <Dropdown
                                    id="region"
                                    v-model="studentFormData.region"
                                    :options="regionOptions"
                                    optionValue="value"
                                    optionLabel="label"
                                    placeholder="Select region"
                                    class="w-full"
                                    :filter="true"
                                />
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
                                    class="w-full"
                                    @change="onClassLevelChange"
                                    :disabled="true"
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
                            <div class="col-span-2">
                                <label for="subjects" class="block text-900 font-semibold mb-2">Subjects</label>
                                <MultiSelect
                                    id="subjects"
                                    v-model="selectedSubjects"
                                    :options="subjectOptions"
                                    optionValue="id"
                                    optionLabel="subject_name"
                                    placeholder="Select subjects"
                                    class="w-full"
                                    :filter="true"
                                    :maxSelectedLabels="5"
                                />
                                <small class="text-500">Select multiple subjects the student will be enrolled in</small>
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

                    <!-- Form Actions -->
                    <div class="flex justify-content-end gap-2">
                        <Button
                            label="Update Student"
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
