<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ExamsTable from '@/components/academics/ExamsTable.vue';
import ResultsTable from '@/components/academics/ResultsTable.vue';
import GradingSystem from '@/components/academics/GradingSystem.vue';
import ExamFormDialog from '@/components/academics/ExamFormDialog.vue';
import AcademicService from '@/service/AcademicService';

const activeTab = ref(0);
const loading = ref(false);
const toast = useToast();

// Exam dialog state
const showExamDialog = ref(false);
const selectedExam = ref(null);

// Data
const exams = ref([]);
const results = ref([]);
const gradingScales = ref([]);

onMounted(() => {
    loadExams();
    loadResults();
    loadGradingScales();
});

// Exam management functions
async function loadExams() {
    try {
        loading.value = true;
        exams.value  = await AcademicService.getExams();
    } catch (error) {
        console.error('Failed to load exams:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load exams',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

function openExamDialog(exam = null) {
    selectedExam.value = exam;
    showExamDialog.value = true;
}

function closeExamDialog() {
    showExamDialog.value = false;
    selectedExam.value = null;
}

function onExamSaved(savedExam) {
    // Refresh exams list
    loadExams();
    
    // Show success message (toast is already shown in dialog)
    console.log('Exam saved:', savedExam);
}

function handleExamAction(action, exam) {
    switch (action) {
        case 'create-exam':
            openExamDialog();
            break;
        case 'view-exam':
            // TODO: Implement view exam functionality
            console.log('View exam:', exam);
            break;
        case 'edit-exam':
            openExamDialog(exam);
            break;
        case 'delete-exam':
            // TODO: Handle delete if needed (already handled in ExamsTable)
            console.log('Delete exam:', exam);
            break;
        case 'refresh':
            loadExams();
            break;
    }
}

async function loadResults() {
    try {
        loading.value = true;
        const response = await AcademicService.getExamResults();
        results.value = response.data || [];
    } catch (error) {
        console.error('Failed to load results:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load exam results',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

async function loadGradingScales() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        gradingScales.value = [
            { id: 1, name: 'O-Level Scale', type: 'O-LEVEL', grades: [{ grade: 'A', minScore: 75, maxScore: 100, points: 1, remarks: 'Excellent' }, { grade: 'B', minScore: 65, maxScore: 74, points: 2, remarks: 'Very Good' }, { grade: 'C', minScore: 50, maxScore: 64, points: 3, remarks: 'Good' }, { grade: 'D', minScore: 30, maxScore: 49, points: 4, remarks: 'Satisfactory' }, { grade: 'F', minScore: 0, maxScore: 29, points: 5, remarks: 'Fail' }] },
            { id: 2, name: 'A-Level Scale', type: 'A-LEVEL', grades: [{ grade: 'A', minScore: 80, maxScore: 100, points: 1, remarks: 'Excellent' }, { grade: 'B', minScore: 70, maxScore: 79, points: 2, remarks: 'Very Good' }, { grade: 'C', minScore: 60, maxScore: 69, points: 3, remarks: 'Good' }, { grade: 'D', minScore: 50, maxScore: 59, points: 4, remarks: 'Satisfactory' }, { grade: 'E', minScore: 35, maxScore: 49, points: 5, remarks: 'Pass' }, { grade: 'S', minScore: 0, maxScore: 34, points: 6, remarks: 'Fail' }] }
        ];
    } catch (error) {
        console.error('Failed to load grading scales:', error);
    } finally {
        loading.value = false;
    }
}

function openResultDialog() {
    // TODO: Implement result dialog
    console.log('Open result dialog');
}

function handleResultAction(action, result) {
    switch (action) {
        case 'create-result':
            openResultDialog();
            break;
        case 'view-result':
            // TODO: Implement view result functionality
            console.log('View result:', result);
            break;
        case 'edit-result':
            // TODO: Implement edit result functionality
            console.log('Edit result:', result);
            break;
        case 'delete-result':
            // TODO: Handle delete result
            console.log('Delete result:', result);
            break;
        case 'refresh-results':
            loadResults();
            break;
    }
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Assessment Management</h5>
            <span class="text-600">Manage examinations, results, and grading systems</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Exams Tab -->
            <TabPanel header="Exams">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Examinations</h6>
                        <span class="text-600 text-sm">Schedule and manage school examinations</span>
                    </div>
                    <Button 
                        label="Schedule Exam" 
                        icon="pi pi-plus" 
                        @click="openExamDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <ExamsTable
                    :exams="exams"
                    :loading="loading"
                    @create-exam="handleExamAction('create-exam')"
                    @view-exam="handleExamAction('view-exam', $event)"
                    @edit-exam="handleExamAction('edit-exam', $event)"
                    @delete-exam="handleExamAction('delete-exam', $event)"
                    @refresh="handleExamAction('refresh')"
                />
            </TabPanel>

            <!-- Results Tab -->
            <TabPanel header="Results">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Exam Results</h6>
                        <span class="text-600 text-sm">Manage and publish student examination results</span>
                    </div>
                    <Button 
                        label="Add Results" 
                        icon="pi pi-plus" 
                        @click="openResultDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <ResultsTable
                    :results="results"
                    :loading="loading"
                    @create-result="handleResultAction('create-result')"
                    @view-result="handleResultAction('view-result', $event)"
                    @edit-result="handleResultAction('edit-result', $event)"
                    @delete-result="handleResultAction('delete-result', $event)"
                    @refresh-results="handleResultAction('refresh-results')"
                />
            </TabPanel>

            <!-- Grading System Tab -->
            <TabPanel header="Grading System">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Grading Scales</h6>
                        <span class="text-600 text-sm">Configure and manage grading systems for different exam types</span>
                    </div>
                    <Button 
                        label="Add Scale" 
                        icon="pi pi-plus" 
                        @click="openGradingDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <GradingSystem
                    :grading-scales="gradingScales"
                    :loading="loading"
                />
            </TabPanel>
        </TabView>
    </div>

    <!-- Exam Form Dialog -->
    <ExamFormDialog 
        v-model:visible="showExamDialog"
        :exam="selectedExam"
        @exam-saved="onExamSaved"
    />
</template>
