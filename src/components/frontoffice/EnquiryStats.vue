<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const stats = ref([
    {
        title: 'Total Enquiries',
        value: '0',
        description: 'All prospective enquiries',
        percentage: '100%',
        icon: 'pi pi-phone',
        color: 'blue'
    },
    {
        title: 'Phone Calls',
        value: '0',
        description: 'Incoming calls logged',
        percentage: '0%',
        icon: 'pi pi-phone',
        color: 'green'
    },
    {
        title: 'Walk Ins',
        value: '0',
        description: 'Campus visits recorded',
        percentage: '0%',
        icon: 'pi pi-users',
        color: 'orange'
    },
    {
        title: 'WhatsApp',
        value: '0',
        description: 'WhatsApp messages',
        percentage: '0%',
        icon: 'pi pi-whatsapp',
        color: 'teal'
    },
    {
        title: 'Facebook',
        value: '0',
        description: 'Social media enquiries',
        percentage: '0%',
        icon: 'pi pi-facebook',
        color: 'indigo'
    }
]);

onMounted(async () => {
    try {
        const statsData = await RegistrationService.getEnquiryStats();
        const total = statsData.total;
        
        stats.value[0].value = statsData.total.toLocaleString();
        stats.value[1].value = statsData.phoneCalls.toLocaleString();
        stats.value[2].value = statsData.walkIns.toLocaleString();
        stats.value[3].value = statsData.whatsapp.toLocaleString();
        stats.value[4].value = statsData.facebook.toLocaleString();
        
        // Calculate percentages
        stats.value[0].percentage = '100%';
        stats.value[1].percentage = total > 0 ? Math.round((statsData.phoneCalls / total) * 100) + '%' : '0%';
        stats.value[2].percentage = total > 0 ? Math.round((statsData.walkIns / total) * 100) + '%' : '0%';
        stats.value[3].percentage = total > 0 ? Math.round((statsData.whatsapp / total) * 100) + '%' : '0%';
        stats.value[4].percentage = total > 0 ? Math.round((statsData.facebook / total) * 100) + '%' : '0%';
    } catch (error) {
        console.error('Failed to load enquiry stats:', error);
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
