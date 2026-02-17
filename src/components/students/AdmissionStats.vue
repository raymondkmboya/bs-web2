<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const stats = ref([
    {
        title: 'Total Admitted',
        value: '0',
        description: 'All admitted students',
        percentage: '100%',
        icon: 'pi pi-users',
        color: 'blue'
    },
    {
        title: 'Enrolled',
        value: '0',
        description: 'Successfully enrolled',
        percentage: '0%',
        icon: 'pi pi-check-circle',
        color: 'green'
    },
    {
        title: 'Pending Enrollment',
        value: '0',
        description: 'Awaiting enrollment',
        percentage: '0%',
        icon: 'pi pi-clock',
        color: 'orange'
    },
    {
        title: 'Rejected',
        value: '0',
        description: 'Admission denied',
        percentage: '0%',
        icon: 'pi pi-times-circle',
        color: 'red'
    }
]);

onMounted(async () => {
    try {
        const statsData = await RegistrationService.getAdmissionStats();
        const total = statsData.total;
        
        stats.value[0].value = statsData.total.toLocaleString();
        stats.value[1].value = statsData.enrolled.toLocaleString();
        stats.value[2].value = statsData.pendingEnrollment.toLocaleString();
        stats.value[3].value = statsData.rejected.toLocaleString();
        
        // Calculate percentages
        stats.value[0].percentage = '100%';
        stats.value[1].percentage = total > 0 ? Math.round((statsData.enrolled / total) * 100) + '%' : '0%';
        stats.value[2].percentage = total > 0 ? Math.round((statsData.pendingEnrollment / total) * 100) + '%' : '0%';
        stats.value[3].percentage = total > 0 ? Math.round((statsData.rejected / total) * 100) + '%' : '0%';
    } catch (error) {
        console.error('Failed to load admission stats:', error);
    }
});
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
            v-for="stat in stats"
            :key="stat.title"
            class="card p-4 border-round h-full flex flex-col"
            :class="`bg-${stat.color}-50 border-${stat.color}-200`"
        >
            <div class="flex items-center justify-between flex-1">
                <div class="flex-1">
                    <div class="text-600 mb-1">{{ stat.title }}</div>
                    <div class="text-2xl font-bold text-900">{{ stat.value }}</div>
                    <div class="text-sm text-500 mt-1">{{ stat.description }}</div>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs font-medium" :class="`text-${stat.color}-600`">{{ stat.percentage }}</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                                class="h-1.5 rounded-full transition-all duration-500"
                                :class="`bg-${stat.color}-500`"
                                :style="{ width: stat.percentage }"
                            ></div>
                        </div>
                    </div>
                </div>
                <div :class="`text-4xl text-${stat.color}-500 ml-4`">
                    <i :class="stat.icon"></i>
                </div>
            </div>
        </div>
    </div>
</template>
