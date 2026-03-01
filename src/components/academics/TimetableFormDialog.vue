<template>
    <Dialog 
        :visible="visible" 
        :style="{ width: '700px' }" 
        :header="isEdit ? 'Edit Timetable Entry' : 'Create Timetable Entry'" 
        :modal="true"
        @hide="resetForm"
        @update:visible="$emit('update:visible', $event)"
    >
        <form @submit.prevent="saveTimetableEntry">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        :class="{ 'p-invalid': errors.class_level_stream_id }"
                        :loading="loadingStreams"
                        :disabled="!formData.class_level_id"
                    />
                    <small v-if="errors.class_level_stream_id" class="text-red-500">{{ errors.class_level_stream_id }}</small>
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

                <!-- Teacher -->
                <div class="col-span-1">
                    <label for="teacher_id" class="block text-900 font-semibold mb-2">Teacher *</label>
                    <Dropdown 
                        id="teacher_id"
                        v-model="formData.teacher_id" 
                        :options="teachers" 
                        optionValue="id" 
                        optionLabel="full_name"
                        placeholder="Select teacher"
                        class="w-full"
                        :class="{ 'p-invalid': errors.teacher_id }"
                        :loading="loadingTeachers"
                    />
                    <small v-if="errors.teacher_id" class="text-red-500">{{ errors.teacher_id }}</small>
                </div>

                <!-- Room -->
                <div class="col-span-1">
                    <label for="room_id" class="block text-900 font-semibold mb-2">Room *</label>
                    <Dropdown 
                        id="room_id"
                        v-model="formData.room_id" 
                        :options="rooms" 
                        optionValue="id" 
                        optionLabel="room_name"
                        placeholder="Select room"
                        class="w-full"
                        :class="{ 'p-invalid': errors.room_id }"
                        :loading="loadingRooms"
                    />
                    <small v-if="errors.room_id" class="text-red-500">{{ errors.room_id }}</small>
                </div>

                <!-- Day of Week -->
                <div class="col-span-1">
                    <label for="day_of_week" class="block text-900 font-semibold mb-2">Day of Week *</label>
                    <Dropdown 
                        id="day_of_week"
                        v-model="formData.day_of_week" 
                        :options="daysOfWeek" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select day"
                        class="w-full"
                        :class="{ 'p-invalid': errors.day_of_week }"
                    />
                    <small v-if="errors.day_of_week" class="text-red-500">{{ errors.day_of_week }}</small>
                </div>

                <!-- Time Slot -->
                <div class="col-span-1">
                    <label for="time_slot" class="block text-900 font-semibold mb-2">Time Slot *</label>
                    <Dropdown 
                        id="time_slot"
                        v-model="formData.time_slot" 
                        :options="timeSlots" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select time"
                        class="w-full"
                        :class="{ 'p-invalid': errors.time_slot }"
                    />
                    <small v-if="errors.time_slot" class="text-red-500">{{ errors.time_slot }}</small>
                </div>

                <!-- Academic Year -->
                <div class="col-span-1">
                    <label for="academic_year" class="block text-900 font-semibold mb-2">Academic Year</label>
                    <InputText 
                        id="academic_year"
                        v-model="formData.academic_year" 
                        class="w-full" 
                        placeholder="e.g., 2026"
                        :class="{ 'p-invalid': errors.academic_year }"
                    />
                    <small v-if="errors.academic_year" class="text-red-500">{{ errors.academic_year }}</small>
                </div>

                <!-- Semester -->
                <div class="col-span-1">
                    <label for="semester" class="block text-900 font-semibold mb-2">Semester</label>
                    <Dropdown 
                        id="semester"
                        v-model="formData.semester" 
                        :options="semesters" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select semester"
                        class="w-full"
                        :class="{ 'p-invalid': errors.semester }"
                    />
                    <small v-if="errors.semester" class="text-red-500">{{ errors.semester }}</small>
                </div>

                <!-- Status -->
                <div class="col-span-1">
                    <label for="status" class="block text-900 font-semibold mb-2">Status *</label>
                    <Dropdown 
                        id="status"
                        v-model="formData.status" 
                        :options="statuses" 
                        optionValue="value" 
                        optionLabel="label"
                        placeholder="Select status"
                        class="w-full"
                        :class="{ 'p-invalid': errors.status }"
                    />
                    <small v-if="errors.status" class="text-red-500">{{ errors.status }}</small>
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
                    :label="isEdit ? 'Update Entry' : 'Create Entry'" 
                    icon="pi pi-save" 
                    type="submit"
                    class="p-button-primary"
                    :loading="saving"
                />
            </div>
        </form>
    </Dialog>
</template>

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
    timetableEntry: {
        type: Object,
        default: null
    }
});

// Emits
const emit = defineEmits(['update:visible', 'timetable-saved']);

// Reactive data
const toast = useToast();
const saving = ref(false);
const loadingSubjects = ref(false);
const loadingTeachers = ref(false);
const loadingRooms = ref(false);
const loadingClassLevels = ref(false);
const loadingStreams = ref(false);

const subjects = ref([]);
const teachers = ref([]);
const rooms = ref([]);
const classLevels = ref([]);
const streams = ref([]);

const daysOfWeek = AcademicService.getDaysOfWeek();
const timeSlots = AcademicService.getTimeSlots();
const semesters = AcademicService.getSemesters();
const statuses = AcademicService.getTimetableStatuses();

const formData = reactive({
    class_level_id: null,
    class_level_stream_id: null,
    subject_id: null,
    teacher_id: null,
    room_id: null,
    day_of_week: null,
    time_slot: null,
    academic_year: new Date().getFullYear().toString(),
    semester: '1',
    status: 'active'
});

const errors = reactive({});

// Computed
const isEdit = computed(() => !!props.timetableEntry);

// Watchers
watch(() => props.visible, (newVal) => {
    if (newVal && props.timetableEntry) {
        // Edit mode - populate form
        Object.assign(formData, {
            class_level_id: props.timetableEntry.class_level_id || null,
            class_level_stream_id: props.timetableEntry.class_level_stream_id || null,
            subject_id: props.timetableEntry.subject_id || null,
            teacher_id: props.timetableEntry.teacher_id || null,
            room_id: props.timetableEntry.room_id || null,
            day_of_week: props.timetableEntry.day_of_week || null,
            time_slot: props.timetableEntry.time_slot || null,
            academic_year: props.timetableEntry.academic_year || new Date().getFullYear().toString(),
            semester: props.timetableEntry.semester || '1',
            status: props.timetableEntry.status || 'active'
        });
        
        // Load streams for the class level
        if (props.timetableEntry.class_level_id) {
            loadStreams(props.timetableEntry.class_level_id);
        }
    } else if (newVal) {
        // Create mode - reset form
        resetForm();
    }
});

// Methods
const resetForm = () => {
    Object.assign(formData, {
        class_level_id: null,
        class_level_stream_id: null,
        subject_id: null,
        teacher_id: null,
        room_id: null,
        day_of_week: null,
        time_slot: null,
        academic_year: new Date().getFullYear().toString(),
        semester: '1',
        status: 'active'
    });
    
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });
    
    streams.value = [];
};

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.class_level_id) {
        newErrors.class_level_id = 'Class level is required';
    }
    
    if (!formData.subject_id) {
        newErrors.subject_id = 'Subject is required';
    }
    
    if (!formData.teacher_id) {
        newErrors.teacher_id = 'Teacher is required';
    }
    
    if (!formData.room_id) {
        newErrors.room_id = 'Room is required';
    }
    
    if (!formData.day_of_week) {
        newErrors.day_of_week = 'Day of week is required';
    }
    
    if (!formData.time_slot) {
        newErrors.time_slot = 'Time slot is required';
    }
    
    if (!formData.status) {
        newErrors.status = 'Status is required';
    }
    
    Object.assign(errors, newErrors);
    return Object.keys(newErrors).length === 0;
};

const saveTimetableEntry = async () => {
    if (!validateForm()) {
        return;
    }
    
    saving.value = true;
    
    try {
        let response;
        if (isEdit.value) {
            response = await AcademicService.updateTimetableEntry(props.timetableEntry.id, formData);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Timetable entry updated successfully',
                life: 3000
            });
        } else {
            response = await AcademicService.createTimetableEntry(formData);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Timetable entry created successfully',
                life: 3000
            });
        }
        
        emit('timetable-saved', response.data);
        emit('update:visible', false);
        resetForm();
    } catch (error) {
        console.error('Error saving timetable entry:', error);
        
        if (error.response?.data?.errors) {
            // Laravel validation errors
            Object.assign(errors, error.response.data.errors);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to save timetable entry',
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
        const response = await AcademicService.getSubjects();
        subjects.value = response.data || [];
    } catch (error) {
        console.error('Error loading subjects:', error);
        subjects.value = [];
    } finally {
        loadingSubjects.value = false;
    }
};

const loadTeachers = async () => {
    loadingTeachers.value = true;
    try {
        const response = await AcademicService.getTeachers();
        teachers.value = response.data || [];
    } catch (error) {
        console.error('Error loading teachers:', error);
        teachers.value = [];
    } finally {
        loadingTeachers.value = false;
    }
};

const loadRooms = async () => {
    loadingRooms.value = true;
    try {
        const response = await AcademicService.getClassRooms();
        rooms.value = response.data || [];
    } catch (error) {
        console.error('Error loading rooms:', error);
        rooms.value = [];
    } finally {
        loadingRooms.value = false;
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
    loadTeachers();
    loadRooms();
    loadClassLevels();
});
</script>

<style scoped>
.p-invalid {
    border-color: #f87171 !important;
}

.text-red-500 {
    color: #ef4444;
}
</style>
