<script setup>
import { ref, onMounted } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import AcademicService from '@/service/AcademicService';
import SubjectsTable from '@/components/academics/SubjectsTable.vue';
import SubjectTeachersTable from '@/components/academics/SubjectTeachersTable.vue';

const activeTab = ref(0);
const loading = ref(false);
const subjects = ref([]);
const subjectTeachers = ref([]);

onMounted(() => {
    loadSubjects();
    loadSubjectTeachers();
});

async function loadSubjects() {
    try {
        loading.value = true;
        subjects.value = await AcademicService.getSubjects();
        console.log(subjects.value)
    } catch (error) {
        console.error('Failed to load subjects:', error);
    } finally {
        loading.value = false;
    }
}

async function loadSubjectTeachers() {
    try {
        loading.value = true;
        subjectTeachers.value = await AcademicService.getSubjectTeachers();
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
                <div class="flex justify-between items-center mb-4">
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
                <div class="flex justify-between items-center mb-4">
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
