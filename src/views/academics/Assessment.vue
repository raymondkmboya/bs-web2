<script setup>
import { ref, onMounted } from 'vue';
import ExamsTable from '@/components/academics/ExamsTable.vue';
import ResultsTable from '@/components/academics/ResultsTable.vue';
import GradingSystem from '@/components/academics/GradingSystem.vue';

const activeTab = ref(0);
const loading = ref(false);

// Mock data for demonstration
const exams = ref([]);
const results = ref([]);
const gradingScales = ref([]);

onMounted(() => {
    loadExams();
    loadResults();
    loadGradingScales();
});

async function loadExams() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        exams.value = [
            { id: 1, title: 'Form 1 Mid-Term Exams', type: 'Mid-Term', level: 'Form 1', subject: 'All Subjects', date: '2024-06-15', duration: '2 weeks', status: 'completed', totalStudents: 120 },
            { id: 2, title: 'Form 2 End-Term Exams', type: 'End-Term', level: 'Form 2', subject: 'All Subjects', date: '2024-08-20', duration: '2 weeks', status: 'upcoming', totalStudents: 115 },
            { id: 3, title: 'Form 3 Mock Exams', type: 'Mock', level: 'Form 3', subject: 'Mathematics', date: '2024-09-10', duration: '3 days', status: 'upcoming', totalStudents: 110 },
            { id: 4, title: 'Form 4 National Exams', type: 'National', level: 'Form 4', subject: 'All Subjects', date: '2024-10-15', duration: '3 weeks', status: 'planned', totalStudents: 105 },
            { id: 5, title: 'CSEE Mock Exams', type: 'Mock', level: 'Form 4', subject: 'All Subjects', date: '2024-09-25', duration: '2 weeks', status: 'upcoming', totalStudents: 105 }
        ];
    } catch (error) {
        console.error('Failed to load exams:', error);
    } finally {
        loading.value = false;
    }
}

async function loadResults() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        results.value = [
            { id: 1, examId: 1, studentId: 'STU001', studentName: 'John Smith', level: 'Form 1', stream: 'Form 1A', subject: 'Mathematics', score: 85, grade: 'A', maxScore: 100, remarks: 'Excellent', date: '2024-06-20' },
            { id: 2, examId: 1, studentId: 'STU002', studentName: 'Mary Johnson', level: 'Form 1', stream: 'Form 1A', subject: 'English', score: 78, grade: 'B+', maxScore: 100, remarks: 'Very Good', date: '2024-06-20' },
            { id: 3, examId: 1, studentId: 'STU003', studentName: 'James Brown', level: 'Form 1', stream: 'Form 1A', subject: 'Physics', score: 92, grade: 'A-', maxScore: 100, remarks: 'Excellent', date: '2024-06-20' },
            { id: 4, examId: 2, studentId: 'STU004', studentName: 'Sarah Davis', level: 'Form 2', stream: 'Form 2A', subject: 'Mathematics', score: 88, grade: 'B+', maxScore: 100, remarks: 'Very Good', date: '2024-08-22' },
            { id: 5, examId: 2, studentId: 'STU005', studentName: 'Michael Wilson', level: 'Form 2', stream: 'Form 2A', subject: 'English', score: 95, grade: 'A', maxScore: 100, remarks: 'Excellent', date: '2024-08-22' }
        ];
    } catch (error) {
        console.error('Failed to load results:', error);
    } finally {
        loading.value = false;
    }
}

async function loadGradingScales() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        gradingScales.value = [
            { id: 1, name: 'O-Level Grading', type: 'O-Level', description: 'Standard O-Level grading system', isActive: true },
            { id: 2, name: 'A-Level Grading', type: 'A-Level', description: 'Advanced Level grading system', isActive: false },
            { id: 3, name: 'CSEE Grading', type: 'CSEE', description: 'Primary School Leaving Examination grading', isActive: true }
        ];
    } catch (error) {
        console.error('Failed to load grading scales:', error);
    } finally {
        loading.value = false;
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
                <div class="flex justify-content-between align-items-center mb-4">
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
                />
            </TabPanel>

            <!-- Results Tab -->
            <TabPanel header="Results">
                <div class="flex justify-content-between align-items-center mb-4">
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
                />
            </TabPanel>

            <!-- Grading System Tab -->
            <TabPanel header="Grading System">
                <div class="flex justify-content-between align-items-center mb-4">
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
</template>
