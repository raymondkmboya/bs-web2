<script setup>
import { ref, onMounted } from 'vue';
import SubjectsTable from '@/components/academics/SubjectsTable.vue';
import SubjectTeachersTable from '@/components/academics/SubjectTeachersTable.vue';

const activeTab = ref(0);
const loading = ref(false);

// Mock data for demonstration
const subjects = ref([]);
const subjectTeachers = ref([]);

onMounted(() => {
    loadSubjects();
    loadSubjectTeachers();
});

async function loadSubjects() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        subjects.value = [
            { id: 1, name: 'Mathematics', code: 'MATH', category: 'Core', totalClasses: 8, totalStudents: 240, teachers: 3 },
            { id: 2, name: 'English Language', code: 'ENG', category: 'Core', totalClasses: 8, totalStudents: 240, teachers: 3 },
            { id: 3, name: 'Physics', code: 'PHY', category: 'Science', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 4, name: 'Chemistry', code: 'CHEM', category: 'Science', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 5, name: 'Biology', code: 'BIO', category: 'Science', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 6, name: 'History', code: 'HIST', category: 'Humanities', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 7, name: 'Geography', code: 'GEO', category: 'Humanities', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 8, name: 'Kiswahili', code: 'KIS', category: 'Core', totalClasses: 8, totalStudents: 240, teachers: 3 },
            { id: 9, name: 'Computer Studies', code: 'ICT', category: 'Technical', totalClasses: 4, totalStudents: 120, teachers: 2 },
            { id: 10, name: 'Business Studies', code: 'BIZ', category: 'Technical', totalClasses: 4, totalStudents: 120, teachers: 2 }
        ];
    } catch (error) {
        console.error('Failed to load subjects:', error);
    } finally {
        loading.value = false;
    }
}

async function loadSubjectTeachers() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        subjectTeachers.value = [
            { id: 1, name: 'Mr. Smith', email: 'smith@school.edu', phone: '+255 123 456 789', subjects: 'Mathematics, Physics', totalClasses: 4, totalStudents: 120, status: 'active' },
            { id: 2, name: 'Ms. Johnson', email: 'johnson@school.edu', phone: '+255 123 456 790', subjects: 'English, Literature', totalClasses: 4, totalStudents: 120, status: 'active' },
            { id: 3, name: 'Mr. Brown', email: 'brown@school.edu', phone: '+255 123 456 791', subjects: 'Chemistry, Biology', totalClasses: 4, totalStudents: 120, status: 'active' },
            { id: 4, name: 'Ms. Davis', email: 'davis@school.edu', phone: '+255 123 456 792', subjects: 'History, Geography', totalClasses: 4, totalStudents: 120, status: 'active' },
            { id: 5, name: 'Mr. Wilson', email: 'wilson@school.edu', phone: '+255 123 456 793', subjects: 'Computer Studies, Business', totalClasses: 4, totalStudents: 120, status: 'active' },
            { id: 6, name: 'Ms. Miller', email: 'miller@school.edu', phone: '+255 123 456 794', subjects: 'Kiswahili, Civics', totalClasses: 4, totalStudents: 120, status: 'active' }
        ];
    } catch (error) {
        console.error('Failed to load subject teachers:', error);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Subjects Management</h5>
            <span class="text-600">Manage academic subjects and subject teacher assignments</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Subjects Tab -->
            <TabPanel header="Subjects">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Academic Subjects</h6>
                        <span class="text-600 text-sm">Manage curriculum subjects with class assignments and teacher allocations</span>
                    </div>
                    <Button 
                        label="Add Subject" 
                        icon="pi pi-plus" 
                        @click="openSubjectDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <SubjectsTable
                    :subjects="subjects"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Subject Teachers Tab -->
            <TabPanel header="Subject Teachers">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Subject Teachers</h6>
                        <span class="text-600 text-sm">Manage subject teacher assignments and class responsibilities</span>
                    </div>
                    <Button 
                        label="Add Teacher" 
                        icon="pi pi-plus" 
                        @click="openTeacherDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <SubjectTeachersTable
                    :teachers="subjectTeachers"
                    :loading="loading"
                />
            </TabPanel>
        </TabView>
    </div>
</template>
