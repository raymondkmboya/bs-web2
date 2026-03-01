<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import AcademicService from '@/service/AcademicService';

// Props
const props = defineProps({
    exams: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['create-exam', 'view-exam', 'edit-exam', 'delete-exam', 'refresh']);

// Reactive data
const toast = useToast();
const deleteDialogVisible = ref(false);
const examToDelete = ref(null);
const filters = ref({
    global: { value: null }
});

// Methods
const clearFilters = () => {
    filters.value.global.value = null;
};

const confirmDelete = (exam) => {
    examToDelete.value = exam;
    deleteDialogVisible.value = true;
};

const deleteExam = async () => {
    try {
        await AcademicService.deleteExam(examToDelete.value.id);
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Exam deleted successfully',
            life: 3000
        });

        deleteDialogVisible.value = false;
        examToDelete.value = null;
        
        emit('delete-exam', examToDelete.value);
        emit('refresh');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to delete exam',
            life: 3000
        });
    }
};

function getStatusSeverity(status) {
    const severities = {
        scheduled: 'info',
        ongoing: 'warning',
        completed: 'success',
        cancelled: 'danger'
    };
    return severities[status] || 'secondary';
}

function getTypeSeverity(type) {
    const typeMap = {
        'midterm': 'primary',
        'final': 'success',
        'quiz': 'warning',
        'assignment': 'info',
        'practical': 'secondary'
    };
    return typeMap[type] || 'secondary';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}

function formatTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
}

function formatNumber(num) {
    return num.toLocaleString();
}

function getExamTypeLabel(type) {
    const types = {
        midterm: 'Midterm',
        final: 'Final',
        quiz: 'Quiz',
        assignment: 'Assignment',
        practical: 'Practical'
    };
    return types[type] || type;
}

function getStatusLabel(status) {
    const statuses = {
        scheduled: 'Scheduled',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    return statuses[status] || status;
}
</script>

<template>
    <DataTable 
        :value="exams" 
        :paginator="true" 
        :rows="10" 
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        :filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['exam_name', 'subject.subject_name', 'exam_type', 'status']"
    >
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button 
                        type="button" 
                        icon="pi pi-filter-slash" 
                        label="Clear Filters" 
                        class="p-button-outlined" 
                        size="small"
                        @click="clearFilters"
                    />
                </div>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText 
                        v-model="filters['global'].value" 
                        placeholder="Search exams..." 
                    />
                </span>
            </div>
        </template>

        <template #empty>
            <div class="text-center py-4">
                <i class="pi pi-calendar text-4xl text-400 mb-3"></i>
                <p class="text-600">No exams found</p>
                <Button 
                    label="Create First Exam" 
                    icon="pi pi-plus" 
                    class="p-button-outlined mt-2"
                    @click="$emit('create-exam')"
                />
            </div>
        </template>

        <!-- Exam Name Column -->
        <Column field="exam_name" header="Exam Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-file-text mr-2 text-primary"></i>
                    <div>
                        <span class="font-semibold">{{ data.exam_name }}</span>
                        <div class="text-600 text-sm">{{ getExamTypeLabel(data.exam_type) }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <!-- Subject Column -->
        <Column field="subject.subject_name" header="Subject" sortable>
            <template #body="{ data }">
                <div v-if="data.subject" class="flex align-items-center">
                    <i class="pi pi-book mr-2 text-blue-500"></i>
                    <span>{{ data.subject.subject_name }}</span>
                </div>
                <span v-else class="text-400">-</span>
            </template>
        </Column>

        <!-- Class Column -->
        <Column header="Class" sortable>
            <template #body="{ data }">
                <div class="flex flex-column">
                    <span class="font-medium">{{ data.classLevel?.class_level_name || '-' }}</span>
                    <span class="text-600 text-sm">{{ data.classStream?.class_level_stream_name || 'All Streams' }}</span>
                </div>
            </template>
        </Column>

        <!-- Date & Time Column -->
        <Column field="exam_date" header="Date & Time" sortable>
            <template #body="{ data }">
                <div class="flex flex-column">
                    <span class="font-medium">{{ formatDate(data.exam_date) }}</span>
                    <span class="text-600 text-sm">{{ formatTime(data.exam_date) }}</span>
                    <span class="text-600 text-sm">{{ formatDuration(data.duration) }}</span>
                </div>
            </template>
        </Column>

        <!-- Marks Column -->
        <Column header="Marks" sortable>
            <template #body="{ data }">
                <div class="flex flex-column">
                    <span class="font-medium">{{ data.total_marks }}</span>
                    <span class="text-600 text-sm">Pass: {{ data.passing_marks }}</span>
                </div>
            </template>
        </Column>

        <!-- Status Column -->
        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="getStatusLabel(data.status)" 
                    :severity="getStatusSeverity(data.status)"
                />
            </template>
        </Column>

        <!-- Actions Column -->
        <Column header="Actions" :exportable="false">
            <template #body="{ data }">
                <div class="flex gap-2">
                    <Button 
                        icon="pi pi-eye" 
                        class="p-button-rounded p-button-text p-button-info" 
                        size="small"
                        @click="$emit('view-exam', data)"
                        v-tooltip="'View Details'"
                    />
                    <Button 
                        icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-warning" 
                        size="small"
                        @click="$emit('edit-exam', data)"
                        v-tooltip="'Edit Exam'"
                    />
                    <Button 
                        icon="pi pi-trash" 
                        class="p-button-rounded p-button-text p-button-danger" 
                        size="small"
                        @click="confirmDelete(data)"
                        v-tooltip="'Delete Exam'"
                    />
                </div>
            </template>
        </Column>
    </DataTable>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
        v-model:visible="deleteDialogVisible" 
        :style="{ width: '450px' }" 
        header="Confirm Delete" 
        :modal="true"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="examToDelete">
                Are you sure you want to delete the exam <b>{{ examToDelete.exam_name }}</b>?
            </span>
        </div>
        <template #footer>
            <Button 
                label="No" 
                icon="pi pi-times" 
                class="p-button-text" 
                @click="deleteDialogVisible = false"
            />
            <Button 
                label="Yes" 
                icon="pi pi-check" 
                class="p-button-danger" 
                @click="deleteExam"
            />
        </template>
    </Dialog>
</template>

<style scoped>
.text-400 {
    color: #94a3b8;
}
</style>
