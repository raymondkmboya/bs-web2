<script setup>
import { ref, onMounted } from 'vue';
import TimetableView from '@/components/academics/TimetableView.vue';

const activeTab = ref(0);
const loading = ref(false);
const selectedLevel = ref(null);
const selectedStream = ref(null);
const selectedDay = ref(null);

// Mock data for demonstration
const levels = ref([]);
const streams = ref([]);
const timetableData = ref([]);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
    '07:30-08:20', '08:20-09:00', '09:00-09:40', '09:40-10:20',
    '10:20-11:00', '11:00-11:40', '11:40-12:20', '12:20-13:00',
    '13:00-13:40', '13:40-14:20', '14:20-15:00', '15:00-15:40'
];

onMounted(() => {
    loadLevels();
    loadStreams();
    loadTimetable();
});

async function loadLevels() {
    try {
        loading.value = true;
        levels.value = [
            { id: 1, name: 'Form 1', code: 'F1' },
            { id: 2, name: 'Form 2', code: 'F2' },
            { id: 3, name: 'Form 3', code: 'F3' },
            { id: 4, name: 'Form 4', code: 'F4' }
        ];
    } catch (error) {
        console.error('Failed to load levels:', error);
    } finally {
        loading.value = false;
    }
}

async function loadStreams() {
    try {
        loading.value = true;
        streams.value = [
            { id: 1, name: 'Form 1A', levelId: 1 },
            { id: 2, name: 'Form 1B', levelId: 1 },
            { id: 3, name: 'Form 1C', levelId: 1 },
            { id: 4, name: 'Form 1D', levelId: 1 },
            { id: 5, name: 'Form 2A', levelId: 2 },
            { id: 6, name: 'Form 2B', levelId: 2 },
            { id: 7, name: 'Form 3A', levelId: 3 },
            { id: 8, name: 'Form 4A', levelId: 4 }
        ];
    } catch (error) {
        console.error('Failed to load streams:', error);
    } finally {
        loading.value = false;
    }
}

async function loadTimetable() {
    try {
        loading.value = true;
        // Mock timetable data
        timetableData.value = [
            {
                day: 'Monday',
                timeSlot: '07:30-08:20',
                subject: 'Mathematics',
                teacher: 'Mr. Smith',
                room: 'Room 101',
                stream: 'Form 1A',
                level: 'Form 1'
            },
            {
                day: 'Monday',
                timeSlot: '08:20-09:00',
                subject: 'English',
                teacher: 'Ms. Johnson',
                room: 'Room 102',
                stream: 'Form 1B',
                level: 'Form 1'
            },
            {
                day: 'Monday',
                timeSlot: '09:00-09:40',
                subject: 'Physics',
                teacher: 'Mr. Brown',
                room: 'Room 103',
                stream: 'Form 1C',
                level: 'Form 1'
            },
            {
                day: 'Monday',
                timeSlot: '09:40-10:20',
                subject: 'Chemistry',
                teacher: 'Ms. Davis',
                room: 'Room 104',
                stream: 'Form 1D',
                level: 'Form 1'
            },
            {
                day: 'Tuesday',
                timeSlot: '07:30-08:20',
                subject: 'Mathematics',
                teacher: 'Mr. Smith',
                room: 'Room 101',
                stream: 'Form 1A',
                level: 'Form 1'
            },
            {
                day: 'Tuesday',
                timeSlot: '08:20-09:00',
                subject: 'Biology',
                teacher: 'Ms. Johnson',
                room: 'Room 102',
                stream: 'Form 1B',
                level: 'Form 1'
            }
        ];
    } catch (error) {
        console.error('Failed to load timetable:', error);
    } finally {
        loading.value = false;
    }
}

function getFilteredTimetable() {
    let filtered = timetableData.value;
    
    if (selectedLevel.value) {
        filtered = filtered.filter(item => item.level === selectedLevel.value.name);
    }
    
    if (selectedStream.value) {
        filtered = filtered.filter(item => item.stream === selectedStream.value.name);
    }
    
    if (selectedDay.value) {
        filtered = filtered.filter(item => item.day === selectedDay.value);
    }
    
    return filtered;
}

function getSubjectColor(subject) {
    const colors = {
        'Mathematics': 'blue',
        'English': 'green',
        'Physics': 'purple',
        'Chemistry': 'orange',
        'Biology': 'teal',
        'History': 'brown',
        'Geography': 'cyan',
        'Kiswahili': 'pink'
    };
    return colors[subject] || 'grey';
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">School Timetable</h5>
            <span class="text-600">Manage class schedules and teacher assignments across all levels and streams</span>
        </div>

        <!-- Filters -->
        <div class="flex gap-3 mb-4">
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Filter by Level</label>
                <Dropdown 
                    v-model="selectedLevel" 
                    :options="levels" 
                    optionLabel="name" 
                    placeholder="All Levels"
                    class="w-full"
                    showClear
                />
            </div>
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Filter by Stream</label>
                <Dropdown 
                    v-model="selectedStream" 
                    :options="streams" 
                    optionLabel="name" 
                    placeholder="All Streams"
                    class="w-full"
                    showClear
                />
            </div>
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Filter by Day</label>
                <Dropdown 
                    v-model="selectedDay" 
                    :options="daysOfWeek" 
                    placeholder="All Days"
                    class="w-full"
                    showClear
                />
            </div>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Timetable View Tab -->
            <TabPanel header="Timetable View">
                <TimetableView
                    :timetable-data="getFilteredTimetable()"
                    :time-slots="timeSlots"
                    :days-of-week="daysOfWeek"
                    :loading="loading"
                />
            </TabPanel>

            <!-- List View Tab -->
            <TabPanel header="List View">
                <DataTable 
                    :value="getFilteredTimetable()" 
                    :paginator="true" 
                    :rows="20" 
                    dataKey="id"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button 
                                type="button" 
                                icon="pi pi-filter-slash" 
                                label="Clear Filters" 
                                class="p-button-outlined" 
                                size="small"
                                @click="selectedLevel = null; selectedStream = null; selectedDay = null;"
                            />
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText placeholder="Search timetable..." />
                            </span>
                        </div>
                    </template>

                    <Column field="day" header="Day" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.day" 
                                severity="info"
                            />
                        </template>
                    </Column>

                    <Column field="timeSlot" header="Time" sortable>
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.timeSlot }}</span>
                        </template>
                    </Column>

                    <Column field="subject" header="Subject" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.subject" 
                                :severity="getSubjectColor(data.subject)"
                            />
                        </template>
                    </Column>

                    <Column field="teacher" header="Teacher" sortable>
                        <template #body="{ data }">
                            <div class="flex align-items-center">
                                <i class="pi pi-user mr-2"></i>
                                <span>{{ data.teacher }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="room" header="Room" sortable>
                        <template #body="{ data }">
                            <div class="flex align-items-center">
                                <i class="pi pi-home mr-2"></i>
                                <span>{{ data.room }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="stream" header="Stream" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.stream" 
                                severity="warning"
                            />
                        </template>
                    </Column>

                    <Column field="level" header="Level" sortable>
                        <template #body="{ data }">
                            <Tag 
                                :value="data.level" 
                                severity="success"
                            />
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>
        </TabView>
    </div>
</template>
