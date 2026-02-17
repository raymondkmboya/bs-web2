<script setup>
const props = defineProps({
    timetableData: {
        type: Array,
        default: () => []
    },
    timeSlots: {
        type: Array,
        default: () => []
    },
    daysOfWeek: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['edit-entry', 'delete-entry']);

function getSubjectColor(subject) {
    const colors = {
        'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
        'English': 'bg-green-100 text-green-800 border-green-200',
        'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
        'Chemistry': 'bg-orange-100 text-orange-800 border-orange-200',
        'Biology': 'bg-teal-100 text-teal-800 border-teal-200',
        'History': 'bg-brown-100 text-brown-800 border-brown-200',
        'Geography': 'bg-cyan-100 text-cyan-800 border-cyan-200',
        'Kiswahili': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function getEmptySlots(day, timeSlot) {
    return !props.timetableData.some(item => item.day === day && item.timeSlot === timeSlot);
}

function getTimetableEntry(day, timeSlot) {
    return props.timetableData.find(item => item.day === day && item.timeSlot === timeSlot);
}
</script>

<template>
    <div class="timetable-container">
        <div class="flex justify-content-between align-items-center mb-4">
            <div class="flex align-items-center gap-2">
                <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span class="text-sm font-medium">Academic Subject</span>
                </div>
                <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span class="text-sm font-medium">Regular Class</span>
                </div>
                <div class="flex items-center">
                    <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span class="text-sm font-medium">Break/Lunch</span>
                </div>
            </div>
            <Button 
                label="Print Timetable" 
                icon="pi pi-print" 
                class="p-button-outlined"
                size="small"
                @click="window.print()"
            />
        </div>

        <div class="timetable-grid">
            <!-- Header Row -->
            <div class="grid-header">
                <div class="time-header">Time</div>
                <div 
                    v-for="day in daysOfWeek" 
                    :key="day" 
                    class="day-header"
                >
                    {{ day }}
                </div>
            </div>

            <!-- Time Slot Rows -->
            <div 
                v-for="timeSlot in timeSlots" 
                :key="timeSlot" 
                class="time-row"
            >
                <div class="time-cell">
                    {{ timeSlot }}
                </div>
                <div 
                    v-for="day in daysOfWeek" 
                    :key="`${timeSlot}-${day}`" 
                    class="subject-cell"
                    :class="{ 'empty-cell': getEmptySlots(day, timeSlot) }"
                >
                    <div 
                        v-if="!getEmptySlots(day, timeSlot)"
                        class="subject-block"
                        :class="getSubjectColor(getTimetableEntry(day, timeSlot)?.subject)"
                        @click="$emit('edit-entry', getTimetableEntry(day, timeSlot))"
                    >
                        <div class="subject-header">
                            <div class="subject-name">{{ getTimetableEntry(day, timeSlot)?.subject }}</div>
                            <div class="subject-details">
                                <span class="teacher">{{ getTimetableEntry(day, timeSlot)?.teacher }}</span>
                                <span class="room">{{ getTimetableEntry(day, timeSlot)?.room }}</span>
                            </div>
                        </div>
                        <div class="subject-footer">
                            <Tag 
                                :value="getTimetableEntry(day, timeSlot)?.stream" 
                                severity="warning"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.timetable-container {
    overflow-x: auto;
}

.timetable-grid {
    min-width: 1200px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.grid-header {
    display: grid;
    grid-template-columns: 120px repeat(5, 1fr);
    background: #f8f9fa;
    border-bottom: 2px solid #e5e7eb;
}

.time-header {
    padding: 12px 8px;
    font-weight: 600;
    color: #495057;
    border-right: 1px solid #e5e7eb;
    background: #f8f9fa;
}

.day-header {
    padding: 12px 8px;
    font-weight: 600;
    color: #495057;
    text-align: center;
    border-right: 1px solid #e5e7eb;
}

.time-row {
    display: grid;
    grid-template-columns: 120px repeat(5, 1fr);
    border-bottom: 1px solid #e5e7eb;
}

.time-cell {
    padding: 12px 8px;
    font-weight: 500;
    color: #6c757d;
    border-right: 1px solid #e5e7eb;
    background: #f8f9fa;
    font-size: 0.875rem;
}

.subject-cell {
    padding: 4px;
    border-right: 1px solid #e5e7eb;
    min-height: 80px;
    position: relative;
}

.empty-cell {
    background: #fafafa;
}

.subject-block {
    height: 100%;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.subject-block:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.subject-header {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 4px;
    line-height: 1.2;
}

.subject-name {
    color: #1a1a1a;
    margin-bottom: 2px;
}

.subject-details {
    font-size: 0.75rem;
    opacity: 0.8;
}

.teacher {
    color: #495057;
    display: block;
    margin-bottom: 1px;
}

.room {
    color: #6c757d;
    display: block;
}

.subject-footer {
    position: absolute;
    bottom: 4px;
    right: 4px;
}

/* Print styles */
@media print {
    .timetable-container {
        overflow: visible;
    }
    
    .timetable-grid {
        min-width: auto;
        box-shadow: none;
        border: 2px solid #000;
    }
    
    .subject-block:hover {
        transform: none;
        box-shadow: none;
    }
}
</style>
