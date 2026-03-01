<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    timetableData: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    selectedLevel: {
        type: Object,
        default: null
    },
    selectedStream: {
        type: Object,
        default: null
    },
    selectedDay: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['clear-filters', 'filter-change']);

// Computed property for filtered data
const filteredTimetable = computed(() => {
    let filtered = props.timetableData;

    if (props.selectedLevel) {
        filtered = filtered.filter(item => item.level === props.selectedLevel.name);
    }

    if (props.selectedStream) {
        filtered = filtered.filter(item => item.stream === props.selectedStream.name);
    }

    if (props.selectedDay) {
        filtered = filtered.filter(item => item.day === props.selectedDay);
    }

    return filtered;
});

// Methods
function getSubjectColor(subject) {
    const colors = {
        'Mathematics': 'blue',
        'English': 'green',
        'Physics': 'purple',
        'Chemistry': 'orange',
        'Biology': 'teal',
        'History': 'brown',
        'Geography': 'cyan',
        'Kiswahili': 'pink',
        'Civics': 'pink'
    };
    return colors[subject] || 'grey';
}

function clearFilters() {
    emit('clear-filters');
}
</script>

<template>
    <DataTable
        :value="filteredTimetable"
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
                    @click="clearFilters"
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
</template>

<style scoped>
/* Add any specific styles for the list view if needed */
</style>
