<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import AcademicService from '@/service/AcademicService';

// Props
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    exam: {
        type: Object,
        default: null
    }
});

// Emits
const emit = defineEmits(['update:visible', 'exam-saved']);

// Reactive data
const toast = useToast();
const saving = ref(false);
const loadingSubjects = ref(false);
const loadingClassLevels = ref(false);
const loadingStreams = ref(false);

const subjects = ref([]);
const classLevels = ref([]);
const streams = ref([]);
const examTypes = AcademicService.getExamTypes();
const examStatuses = AcademicService.getExamStatuses();

const formData = reactive({
    exam_name: '',
    exam_type: '',
    subject_id: null,
    class_level_id: null,
    class_level_stream_id: null,
    exam_date: null,
    duration: 60,
    total_marks: 100,
    passing_marks: 40,
    status: 'scheduled',
    instructions: '',
    academic_year: new Date().getFullYear().toString()
});

const errors = reactive({});

// Computed
const isEdit = computed(() => !!props.exam);

// Watchers
watch(() => props.visible, (newVal) => {
    if (newVal && props.exam) {
        // Edit mode - populate form
        Object.assign(formData, {
            exam_name: props.exam.exam_name || '',
            exam_type: props.exam.exam_type || '',
            subject_id: props.exam.subject_id || null,
            class_level_id: props.exam.class_level_id || null,
            class_level_stream_id: props.exam.class_level_stream_id || null,
            exam_date: props.exam.exam_date ? new Date(props.exam.exam_date) : null,
            duration: props.exam.duration || 60,
            total_marks: props.exam.total_marks || 100,
            passing_marks: props.exam.passing_marks || 40,
            status: props.exam.status || 'scheduled',
            instructions: props.exam.instructions || '',
            academic_year: props.exam.academic_year || new Date().getFullYear().toString()
        });
        
        // Load streams for the class level
        if (props.exam.class_level_id) {
            loadStreams(props.exam.class_level_id);
        }
    } else if (newVal) {
        // Create mode - reset form
        resetForm();
    }
});

// Methods
const resetForm = () => {
    Object.assign(formData, {
        exam_name: '',
        exam_type: '',
        subject_id: null,
        class_level_id: null,
        class_level_stream_id: null,
        exam_date: null,
        duration: 60,
        total_marks: 100,
        passing_marks: 40,
        status: 'scheduled',
        instructions: '',
        academic_year: new Date().getFullYear().toString()
    });
    
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });
    
    streams.value = [];
};

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.exam_name.trim()) {
        newErrors.exam_name = 'Exam name is required';
    }
    
    if (!formData.exam_type) {
        newErrors.exam_type = 'Exam type is required';
    }
    
    if (!formData.subject_id) {
        newErrors.subject_id = 'Subject is required';
    }
    
    if (!formData.class_level_id) {
        newErrors.class_level_id = 'Class level is required';
    }
    
    if (!formData.exam_date) {
        newErrors.exam_date = 'Exam date is required';
    }
    
    if (!formData.duration || formData.duration < 15) {
        newErrors.duration = 'Duration must be at least 15 minutes';
    }
    
    if (!formData.total_marks || formData.total_marks < 1) {
        newErrors.total_marks = 'Total marks is required';
    }
    
    if (!formData.passing_marks || formData.passing_marks < 1) {
        newErrors.passing_marks = 'Passing marks is required';
    }
    
    if (formData.passing_marks > formData.total_marks) {
        newErrors.passing_marks = 'Passing marks cannot be greater than total marks';
    }
    
    if (!formData.status) {
        newErrors.status = 'Status is required';
    }
    
    Object.assign(errors, newErrors);
    return Object.keys(newErrors).length === 0;
};

const saveExam = async () => {
    if (!validateForm()) {
        return;
    }
    
    saving.value = true;
    
    try {
        const examData = {
            ...formData,
            exam_date: formData.exam_date.toISOString()
        };
        
        let response;
        if (isEdit.value) {
            response = await AcademicService.updateExam(props.exam.id, examData);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Exam updated successfully',
                life: 3000
            });
        } else {
            response = await AcademicService.createExam(examData);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Exam created successfully',
                life: 3000
            });
        }
        
        emit('exam-saved', response.data);
        emit('update:visible', false);
        resetForm();
    } catch (error) {
        console.error('Error saving exam:', error);
        
        if (error.response?.data?.errors) {
            // Laravel validation errors
            Object.assign(errors, error.response.data.errors);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to save exam',
                life: 3000
            });
        }
    } finally {
        saving.value = false;
    }
};

const loadSubjects = async () => {
    loadingSubjects.value = true;
    try {
        subjects.value = await AcademicService.getSubjects();
        console.log(subjects.value)
    } catch (error) {
        console.error('Error loading subjects:', error);
        subjects.value = [];
    } finally {
        loadingSubjects.value = false;
    }
};

const loadClassLevels = async () => {
    loadingClassLevels.value = true;
    try {
        const response = await AcademicService.getClassLevels();
        classLevels.value = response || [];
    } catch (error) {
        console.error('Error loading class levels:', error);
        classLevels.value = [];
    } finally {
        loadingClassLevels.value = false;
    }
};

const loadStreams = async (classLevelId) => {
    if (!classLevelId) {
        streams.value = [];
        return;
    }
    
    loadingStreams.value = true;
    try {
        const response = await AcademicService.getStreamsByClassLevel(classLevelId);
        streams.value = response || [];
    } catch (error) {
        console.error('Error loading streams:', error);
        streams.value = [];
    } finally {
        loadingStreams.value = false;
    }
};

const onClassLevelChange = () => {
    formData.class_level_stream_id = null;
    streams.value = [];
    if (formData.class_level_id) {
        loadStreams(formData.class_level_id);
    }
};

// Lifecycle
onMounted(() => {
    loadSubjects();
    loadClassLevels();
});
</script>

<template>
    <Dialog 
        :visible="visible" 
        :style="{ width: '600px' }" 
        :header="isEdit ? 'Edit Exam' : 'Create New Exam'" 
        :modal="true"
        @hide="resetForm"
        @update:visible="$emit('update:visible', $event)"
    >
        <form @submit.prevent="saveExam">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Exam Name -->
                <div class="col-span-2">
                    <label for="exam_name" class="block text-900 font-semibold mb-2">Exam Name *</label>
                    <InputText 
                        id="exam_name"
                        v-model="formData.exam_name" 
                        class="w-full" 
                        placeholder="Enter exam name"
                        :class="{ 'p-invalid': errors.exam_name }"
                    />
                    <small v-if="errors.exam_name" class="text-red-500">{{ errors.exam_name }}</small>
                </div>

                <!-- Exam Type -->
                <div class="col-span-1">
                    <label for="exam_type" class="block text-900 font-semibold mb-2">Exam Type *</label>
                    <Dropdown 
                        id="exam_type"
                        v-model="formData.exam_type" 
                        :options="examTypes" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select exam type"
                        class="w-full"
                        :class="{ 'p-invalid': errors.exam_type }"
                    />
                    <small v-if="errors.exam_type" class="text-red-500">{{ errors.exam_type }}</small>
                </div>

                <!-- Subject -->
                <div class="col-span-1">
                    <label for="subject_id" class="block text-900 font-semibold mb-2">Subject *</label>
                    <Dropdown 
                        id="subject_id"
                        v-model="formData.subject_id" 
                        :options="subjects" 
                        optionValue="id" 
                        optionLabel="subject_name"
                        placeholder="Select subject"
                        class="w-full"
                        :class="{ 'p-invalid': errors.subject_id }"
                        :loading="loadingSubjects"
                    />
                    <small v-if="errors.subject_id" class="text-red-500">{{ errors.subject_id }}</small>
                </div>

                <!-- Class Level -->
                <div class="col-span-1">
                    <label for="class_level_id" class="block text-900 font-semibold mb-2">Class Level *</label>
                    <Dropdown 
                        id="class_level_id"
                        v-model="formData.class_level_id" 
                        :options="classLevels" 
                        optionValue="id" 
                        optionLabel="class_level_name"
                        placeholder="Select class level"
                        class="w-full"
                        :class="{ 'p-invalid': errors.class_level_id }"
                        :loading="loadingClassLevels"
                        @change="onClassLevelChange"
                    />
                    <small v-if="errors.class_level_id" class="text-red-500">{{ errors.class_level_id }}</small>
                </div>

                <!-- Class Stream -->
                <div class="col-span-1">
                    <label for="class_level_stream_id" class="block text-900 font-semibold mb-2">Class Stream</label>
                    <Dropdown 
                        id="class_level_stream_id"
                        v-model="formData.class_level_stream_id" 
                        :options="streams" 
                        optionValue="id" 
                        optionLabel="class_level_stream_name"
                        placeholder="Select stream (optional)"
                        class="w-full"
                        :loading="loadingStreams"
                        :disabled="!formData.class_level_id"
                    />
                    <small v-if="errors.class_level_stream_id" class="text-red-500">{{ errors.class_level_stream_id }}</small>
                </div>

                <!-- Exam Date -->
                <div class="col-span-1">
                    <label for="exam_date" class="block text-900 font-semibold mb-2">Exam Date *</label>
                    <Calendar 
                        id="exam_date"
                        v-model="formData.exam_date" 
                        class="w-full"
                        :showTime="true"
                        :class="{ 'p-invalid': errors.exam_date }"
                    />
                    <small v-if="errors.exam_date" class="text-red-500">{{ errors.exam_date }}</small>
                </div>

                <!-- Duration -->
                <div class="col-span-1">
                    <label for="duration" class="block text-900 font-semibold mb-2">Duration (minutes) *</label>
                    <InputNumber 
                        id="duration"
                        v-model="formData.duration" 
                        class="w-full"
                        :min="15"
                        :max="480"
                        placeholder="Duration in minutes"
                        :class="{ 'p-invalid': errors.duration }"
                    />
                    <small v-if="errors.duration" class="text-red-500">{{ errors.duration }}</small>
                </div>

                <!-- Total Marks -->
                <div class="col-span-1">
                    <label for="total_marks" class="block text-900 font-semibold mb-2">Total Marks *</label>
                    <InputNumber 
                        id="total_marks"
                        v-model="formData.total_marks" 
                        class="w-full"
                        :min="1"
                        placeholder="Total marks"
                        :class="{ 'p-invalid': errors.total_marks }"
                    />
                    <small v-if="errors.total_marks" class="text-red-500">{{ errors.total_marks }}</small>
                </div>

                <!-- Passing Marks -->
                <div class="col-span-1">
                    <label for="passing_marks" class="block text-900 font-semibold mb-2">Passing Marks *</label>
                    <InputNumber 
                        id="passing_marks"
                        v-model="formData.passing_marks" 
                        class="w-full"
                        :min="1"
                        :max="formData.total_marks || 100"
                        placeholder="Passing marks"
                        :class="{ 'p-invalid': errors.passing_marks }"
                    />
                    <small v-if="errors.passing_marks" class="text-red-500">{{ errors.passing_marks }}</small>
                </div>

                <!-- Status -->
                <div class="col-span-1">
                    <label for="status" class="block text-900 font-semibold mb-2">Status *</label>
                    <Dropdown 
                        id="status"
                        v-model="formData.status" 
                        :options="examStatuses" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select status"
                        class="w-full"
                        :class="{ 'p-invalid': errors.status }"
                    />
                    <small v-if="errors.status" class="text-red-500">{{ errors.status }}</small>
                </div>

                <!-- Academic Year -->
                <div class="col-span-1">
                    <label for="academic_year" class="block text-900 font-semibold mb-2">Academic Year</label>
                    <InputText 
                        id="academic_year"
                        v-model="formData.academic_year" 
                        class="w-full" 
                        placeholder="e.g., 2026"
                    />
                    <small v-if="errors.academic_year" class="text-red-500">{{ errors.academic_year }}</small>
                </div>

                <!-- Instructions -->
                <div class="col-span-2">
                    <label for="instructions" class="block text-900 font-semibold mb-2">Instructions</label>
                    <Textarea 
                        id="instructions"
                        v-model="formData.instructions" 
                        rows="3" 
                        class="w-full"
                        placeholder="Enter exam instructions (optional)"
                        :class="{ 'p-invalid': errors.instructions }"
                    />
                    <small v-if="errors.instructions" class="text-red-500">{{ errors.instructions }}</small>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-content-end gap-2 mt-4">
                <Button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    class="p-button-text" 
                    @click="$emit('update:visible', false)"
                />
                <Button 
                    :label="isEdit ? 'Update Exam' : 'Create Exam'" 
                    icon="pi pi-save" 
                    type="submit"
                    class="p-button-primary"
                    :loading="saving"
                />
            </div>
        </form>
    </Dialog>
</template>


<style scoped>
.p-invalid {
    border-color: #f87171 !important;
}

.text-red-500 {
    color: #ef4444;
}
</style>
