<script setup>
import { ref, onMounted } from 'vue';
import LevelsTable from '@/components/academics/ClassLevelTable.vue';
import StreamsTable from '@/components/academics/ClassStreamTable.vue';
import RoomsTable from '@/components/academics/ClassRoomTable.vue';
import TeachersTable from '@/components/academics/TeachersTable.vue';
import AcademicAnalytics from '@/components/academics/AcademicAnalytics.vue';
import RoomForm from '@/components/academics/ClassRoomForm.vue';
import AcademicService from '@/service/AcademicService.js';

const activeTab = ref(0);
const loading = ref(false);
const showRoomForm = ref(false);
const showCompassForm = ref(false);
const editingClassroom = ref(null);


// Real data from API
const levels = ref([]);
const streams = ref([]);
const rooms = ref([]);
const teachers = ref([]);
const compass = ref([]);
const analytics = ref({});

onMounted(() => {
    loadClassLevels();
    loadClassLevelStreams();
    loadClassRooms();
    // loadTeachers();
    loadCompass();
    // loadAnalytics();
});

async function loadClassLevels() {
    try {
        loading.value = true;
        const levelsData = await AcademicService.getClassLevels();
        levels.value = levelsData;
    } catch (error) {
        console.error('Failed to load levels:', error);
    } finally {
        loading.value = false;
    }
}

async function loadClassLevelStreams() {
    try {
        loading.value = true;
        const streamsData = await AcademicService.getClassLevelStreams();
        streams.value = streamsData;
    } catch (error) {
        console.error('Failed to load streams:', error);
    } finally {
        loading.value = false;
    }
}

async function loadClassRooms() {
    try {
        loading.value = true;
        const roomData = await AcademicService.getClassRooms();
        rooms.value = roomData;
        console.log('Rooms data2:', rooms.value);
    } catch (error) {
        console.error('Failed to load rooms:', error);
    } finally {
        loading.value = false;
    }
}

// async function loadTeachers() {
//     try {
//         loading.value = true;
//         const teachersData = await AcademicService.getTeachers();
//         teachers.value = teachersData;
//     } catch (error) {
//         console.error('Failed to load teachers:', error);
//     } finally {
//         loading.value = false;
//     }
// }

async function loadCompass() {
    try {
        loading.value = true;
        const compassData = await AcademicService.getCompass();
        compass.value = compassData;
    } catch (error) {
        console.error('Failed to load compass:', error);
    } finally {
        loading.value = false;
    }
}

// async function loadAnalytics() {
//     try {
//         loading.value = true;
//         const analyticsData = await AcademicService.getAnalytics();
//         analytics.value = analyticsData;
//     } catch (error) {
//         console.error('Failed to load analytics:', error);
//     } finally {
//         loading.value = false;
//     }
// }

async function submitRoom(data) {
    try {
        await AcademicService.addClassRoom(data);
        await loadClassRooms(); // Refresh table
        return Promise.resolve(); // Signal success
    } catch (error) {
        console.error('Failed to submit room:', error);
        return Promise.reject(error); // Signal failure
    }
}

function openRoomDialog() {
    showRoomForm.value = true;
}

function closeForm() {
    showRoomForm.value = false;
}

function openCompassDialog() {
    showCompassForm.value = true;
}

function closeCompassForm() {
    showCompassForm.value = false;
}

</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Class Management</h5>
            <span class="text-600">Manage academic levels, streams, classrooms, and class teachers</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Rooms Tab -->
            <TabPanel header="Rooms/Capacity">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Classrooms & Capacity</h6>
                        <span class="text-600 text-sm">Manage classroom capacity, occupancy, and availability status</span>
                    </div>
                    <Button
                        label="Add Room"
                        icon="pi pi-plus"
                        @click="openRoomDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <!-- Form Component - Always visible -->
                <RoomForm
                    v-model:visible="showRoomForm"
                    @submit="submitRoom"
                    @close="closeForm"
                />

                <RoomsTable
                    :rooms="rooms"
                    :loading="loading"
                    @edit="openRoomDialog"
                    @delete="deleteClassroom" />
            </TabPanel>

            <!-- Levels Tab -->
            <TabPanel header="Levels">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Academic Levels</h6>
                        <span class="text-600 text-sm">Manage class levels (Form 1-4) with student counts and stream allocations</span>
                    </div>
                    <Button
                        label="Add Level"
                        icon="pi pi-plus"
                        @click="openLevelDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <LevelsTable
                    :levels="levels"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Streams Tab -->
            <TabPanel header="Streams">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Class Streams</h6>
                        <span class="text-600 text-sm">Manage class divisions with student assignments and teacher allocations</span>
                    </div>
                    <Button
                        label="Add Stream"
                        icon="pi pi-plus"
                        @click="openStreamDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <StreamsTable
                    :streams="streams"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Teachers Tab -->
            <TabPanel header="Class Teachers">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Class Teachers</h6>
                        <span class="text-600 text-sm">Manage class teacher assignments and subject responsibilities</span>
                    </div>
                    <Button
                        label="Add Teacher"
                        icon="pi pi-plus"
                        @click="openTeacherDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <TeachersTable
                    :teachers="teachers"
                    :loading="loading"
                    @edit="openTeacherDialog"
                    @delete="deleteTeacher" />
            </TabPanel>

            <!-- Compass Tab -->
            <TabPanel header="Compass">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Compass Management</h6>
                        <span class="text-600 text-sm">Manage compass sections with room assignments and supervisors</span>
                    </div>
                    <Button
                        label="Add Compass"
                        icon="pi pi-plus"
                        @click="openCompassDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <!-- Class Form -->
                <CompassForm
                    v-model:visible="showCompassForm"
                    @submit="submitCompass"
                    @close="closeCompassForm"
                />

                <CompassTable
                    :compass="compass"
                    :rooms="rooms"
                    :loading="loading"
                />
            </TabPanel>
        </TabView>
    </div>
</template>
