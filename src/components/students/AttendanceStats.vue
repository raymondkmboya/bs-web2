<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    present: {
        type: Number,
        default: 0
    },
    late: {
        type: Number,
        default: 0
    },
    absent: {
        type: Number,
        default: 0
    }
});

const attendanceRate = computed(() => {
    if (props.total === 0) return 0;
    return ((props.present / props.total) * 100).toFixed(1);
});

const lateRate = computed(() => {
    if (props.total === 0) return 0;
    return ((props.late / props.total) * 100).toFixed(1);
});
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Scans -->
        <div class="card">
            <div class="flex align-items-center justify-content-between mb-3">
                <div class="text-900 font-medium text-xl">Total Scans</div>
                <div class="text-blue-500">
                    <i class="pi pi-clock text-2xl"></i>
                </div>
            </div>
            <div class="text-900 font-bold text-3xl mb-2">{{ total }}</div>
            <div class="text-600 text-sm">All attendance records</div>
            <div class="mt-3">
                <ProgressBar :value="100" class="h-1" />
            </div>
        </div>

        <!-- Present -->
        <div class="card">
            <div class="flex align-items-center justify-content-between mb-3">
                <div class="text-900 font-medium text-xl">Present</div>
                <div class="text-green-500">
                    <i class="pi pi-check-circle text-2xl"></i>
                </div>
            </div>
            <div class="text-900 font-bold text-3xl mb-2">{{ present }}</div>
            <div class="text-600 text-sm">{{ attendanceRate }}% attendance rate</div>
            <div class="mt-3">
                <ProgressBar :value="attendanceRate" class="h-1" :pt="{ value: { class: 'bg-green-500' } }" />
            </div>
        </div>

        <!-- Late -->
        <div class="card">
            <div class="flex align-items-center justify-content-between mb-3">
                <div class="text-900 font-medium text-xl">Late</div>
                <div class="text-orange-500">
                    <i class="pi pi-exclamation-triangle text-2xl"></i>
                </div>
            </div>
            <div class="text-900 font-bold text-3xl mb-2">{{ late }}</div>
            <div class="text-600 text-sm">{{ lateRate }}% late rate</div>
            <div class="mt-3">
                <ProgressBar :value="lateRate" class="h-1" :pt="{ value: { class: 'bg-orange-500' } }" />
            </div>
        </div>

        <!-- Absent -->
        <div class="card">
            <div class="flex align-items-center justify-content-between mb-3">
                <div class="text-900 font-medium text-xl">Absent</div>
                <div class="text-red-500">
                    <i class="pi pi-times-circle text-2xl"></i>
                </div>
            </div>
            <div class="text-900 font-bold text-3xl mb-2">{{ absent }}</div>
            <div class="text-600 text-sm">Not present</div>
            <div class="mt-3">
                <ProgressBar :value="absent > 0 ? (absent / total) * 100 : 0" class="h-1" :pt="{ value: { class: 'bg-red-500' } }" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 1024px) {
    .grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .grid-cols-4 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}
</style>
