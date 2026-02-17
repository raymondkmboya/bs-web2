<script setup>
const props = defineProps({
    analytics: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['generate-report']);

function getPerformanceColor(average) {
    if (average >= 80) return 'text-green-600';
    if (average >= 70) return 'text-blue-600';
    if (average >= 60) return 'text-orange-600';
    return 'text-red-600';
}

function getPassRateColor(passRate) {
    if (passRate >= 85) return 'text-green-600';
    if (passRate >= 75) return 'text-blue-600';
    if (passRate >= 65) return 'text-orange-600';
    return 'text-red-600';
}

function getOccupancyColor(rate) {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 80) return 'text-orange-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-green-600';
}

function formatNumber(num) {
    return num.toLocaleString();
}

function generateReport() {
    emit('generate-report');
}
</script>

<template>
    <div class="analytics-container">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- Total Students Card -->
            <div class="card p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <i class="pi pi-users text-white text-xl"></i>
                        </div>
                        <div>
                            <h6 class="text-blue-600 font-semibold">Total Students</h6>
                            <p class="text-600 text-sm">{{ formatNumber(props.analytics.totalStudents || 0) }}</p>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <span class="text-600 text-sm">+5% from last month</span>
                </div>
            </div>

            <!-- Total Classes Card -->
            <div class="card p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <i class="pi pi-sitemap text-white text-xl"></i>
                        </div>
                        <div>
                            <h6 class="text-green-600 font-semibold">Total Classes</h6>
                            <p class="text-600 text-sm">{{ formatNumber(props.analytics.totalClasses || 0) }}</p>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <span class="text-600 text-sm">+2 new this term</span>
                </div>
            </div>

            <!-- Average Class Size Card -->
            <div class="card p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <i class="pi pi-calculator text-white text-xl"></i>
                        </div>
                        <div>
                            <h6 class="text-purple-600 font-semibold">Avg Class Size</h6>
                            <p class="text-600 text-sm">{{ props.analytics.averageClassSize || 0 }} students</p>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <span class="text-600 text-sm">Optimal: 25-30</span>
                </div>
            </div>

            <!-- Occupancy Rate Card -->
            <div class="card p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <i class="pi pi-home text-white text-xl"></i>
                        </div>
                        <div>
                            <h6 class="text-orange-600 font-semibold">Occupancy Rate</h6>
                            <p class="text-600 text-sm">{{ props.analytics.occupancyRate || 0 }}%</p>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <span 
                        class="text-600 text-sm"
                        :class="getOccupancyColor(props.analytics.occupancyRate || 0)"
                    >
                        {{ props.analytics.occupancyRate >= 80 ? 'High' : props.analytics.occupancyRate >= 60 ? 'Good' : 'Low' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Performance by Level -->
        <div class="card mb-6">
            <h6 class="mb-4">Performance by Level</h6>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    v-for="(performance, level) in props.analytics.performanceByLevel" 
                    :key="level"
                    class="text-center p-4 border-round"
                >
                    <h6 class="font-semibold mb-2">{{ level }}</h6>
                    <div class="mb-2">
                        <p class="text-600 text-sm">Average Score</p>
                        <p 
                            class="text-2xl font-bold"
                            :class="getPerformanceColor(performance.average)"
                        >
                            {{ performance.average }}%
                        </p>
                    </div>
                    <div>
                        <p class="text-600 text-sm">Pass Rate</p>
                        <p 
                            class="text-2xl font-bold"
                            :class="getPassRateColor(performance.passRate)"
                        >
                            {{ performance.passRate }}%
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top & At Risk Classes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Top Performing Classes -->
            <div class="card">
                <h6 class="mb-4 text-green-600">Top Performing Classes</h6>
                <div class="space-y-2">
                    <div 
                        v-for="className in props.analytics.topPerformingClasses" 
                        :key="className"
                        class="flex items-center justify-between p-3 bg-green-50 border-round"
                    >
                        <span class="font-semibold">{{ className }}</span>
                        <Tag value="Excellent" severity="success" />
                    </div>
                </div>
            </div>

            <!-- At Risk Classes -->
            <div class="card">
                <h6 class="mb-4 text-red-600">Classes Needing Attention</h6>
                <div class="space-y-2">
                    <div 
                        v-for="className in props.analytics.atRiskClasses" 
                        :key="className"
                        class="flex items-center justify-between p-3 bg-red-50 border-round"
                    >
                        <span class="font-semibold">{{ className }}</span>
                        <Tag value="At Risk" severity="danger" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Subject Distribution -->
        <div class="card mb-6">
            <h6 class="mb-4">Subject Distribution</h6>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                    v-for="(count, subject) in props.analytics.subjectDistribution" 
                    :key="subject"
                    class="text-center p-4 border-round"
                >
                    <h6 class="font-semibold mb-2">{{ subject }}</h6>
                    <p class="text-3xl font-bold text-blue-600">{{ formatNumber(count) }}</p>
                    <p class="text-600 text-sm">students enrolled</p>
                </div>
            </div>
        </div>

        <!-- Gender Distribution -->
        <div class="card mb-6">
            <h6 class="mb-4">Gender Distribution</h6>
            <div class="flex items-center justify-around">
                <div class="text-center">
                    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <i class="pi pi-user text-blue-600 text-2xl"></i>
                    </div>
                    <p class="font-semibold text-blue-600">Male</p>
                    <p class="text-2xl font-bold">{{ props.analytics.genderDistribution?.male || 0 }}%</p>
                </div>
                <div class="text-center">
                    <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                        <i class="pi pi-user text-pink-600 text-2xl"></i>
                    </div>
                    <p class="font-semibold text-pink-600">Female</p>
                    <p class="text-2xl font-bold">{{ props.analytics.genderDistribution?.female || 0 }}%</p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-content-end gap-3">
            <Button 
                label="Export Analytics" 
                icon="pi pi-download" 
                class="p-button-outlined"
                @click="generateReport"
            />
            <Button 
                label="Print Report" 
                icon="pi pi-print" 
                class="p-button-outlined"
                @click="window.print()"
            />
        </div>
    </div>
</template>

<style scoped>
.analytics-container {
    padding: 1rem;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.border-round {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
}

.bg-green-50 {
    background-color: #f0fdf4;
}

.bg-red-50 {
    background-color: #fef2f2;
}

.bg-blue-100 {
    background-color: #dbeafe;
}

.bg-pink-100 {
    background-color: #fce7f3;
}

/* Print styles */
@media print {
    .analytics-container {
        padding: 0;
    }
    
    .card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #000;
    }
}
</style>
