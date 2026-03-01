<script setup>
import { ref, onMounted } from 'vue';
import FrontOfficeService from '@/service/FrontOfficeService.js';

const stats = ref([
    {
        title: 'Total Cost',
        value: '0',
        description: 'Total advertisement spend',
        percentage: '100%',
        icon: 'pi pi-money-bill',
        color: 'cyan'
    },
    {
        title: 'Phone Call',
        value: '0',
        description: 'Phone call advertisements',
        percentage: '0%',
        icon: 'pi pi-phone',
        color: 'blue'
    },
    {
        title: 'Road Posters',
        value: '0',
        description: 'Road poster advertisements',
        percentage: '0%',
        icon: 'pi pi-map',
        color: 'green'
    },
    {
        title: 'Car Posters',
        value: '0',
        description: 'Car poster advertisements',
        percentage: '0%',
        icon: 'pi pi-car',
        color: 'orange'
    },
    {
        title: 'Radio',
        value: '0',
        description: 'Radio advertisements',
        percentage: '0%',
        icon: 'pi pi-broadcast',
        color: 'indigo'
    },
    {
        title: 'TV',
        value: '0',
        description: 'TV advertisements',
        percentage: '0%',
        icon: 'pi pi-tv',
        color: 'purple'
    },
    {
        title: 'SMS',
        value: '0',
        description: 'SMS advertisements',
        percentage: '0%',
        icon: 'pi pi-comment',
        color: 'pink'
    }
]);

onMounted(async () => {
    try {
        const response = await FrontOfficeService.getAdvertStats();
        const advertData = await FrontOfficeService.getAdverts();

        // Handle different response structures
        const statsData = response.data || response;

        // Update total cost
        const totalCost = statsData.total_cost || statsData.data?.total_cost || 0;
        const totalAdverts = statsData.total || statsData.data?.total || advertData.length || 0;

        // Get performance data (students per medium)
        const performanceData = statsData.performance || statsData.data?.performance || {};

        // Calculate metrics for each medium
        const mediumStats = {
            'Phone Call': advertData.filter(a => a.medium === 'Phone Call'),
            'Road Posters': advertData.filter(a => a.medium === 'Road Posters'),
            'Car Posters': advertData.filter(a => a.medium === 'Car Posters'),
            'Radio': advertData.filter(a => a.medium === 'Radio'),
            'TV': advertData.filter(a => a.medium === 'TV'),
            'SMS': advertData.filter(a => a.medium === 'SMS')
        };

        // Update stats with actual costs and performance
        stats.value.forEach((stat) => {
            if (stat.title === 'Total Cost') {
                stat.value = totalCost.toLocaleString();
                stat.description = `Total advertisement spend across ${totalAdverts} adverts`;
            } else if (mediumStats[stat.title]) {
                const mediumAdverts = mediumStats[stat.title];
                const mediumCost = mediumAdverts.reduce((sum, advert) => {
                    return sum + parseFloat(advert.cost || 0);
                }, 0);
                const mediumCount = mediumAdverts.length;
                const studentCount = performanceData[stat.title] || 0;

                stat.value = mediumCost.toLocaleString();
                stat.description = `${mediumCount} advert(s) - ${studentCount} students`;
                stat.percentage = totalCost > 0 ? ((mediumCost / totalCost) * 100).toFixed(1) + '%' : '0%';
            }
        });
    } catch (error) {
        console.error('Failed to load advert statistics:', error);
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
