<script setup>
import { ref, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const stats = ref([
    {
        title: 'Total Adverts',
        value: '0',
        description: 'All prospective enquiries',
        percentage: '100%',
        icon: 'pi pi-bullhorn',
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
        title: 'Road Posters',
        value: '0',
        description: 'Campus visits recorded',
        percentage: '0%',
        icon: 'pi pi-map',
        color: 'orange'
    },
    {
        title: 'Car Posters',
        value: '0',
        description: 'WhatsApp messages',
        percentage: '0%',
        icon: 'pi pi-car',
        color: 'teal'
    },
    {
        title: 'Radio',
        value: '0',
        description: 'Social media enquiries',
        percentage: '0%',
        icon: 'pi pi-broadcast',
        color: 'indigo'
    },
     {
        title: 'TV',
        value: '0',
        description: 'Social media enquiries',
        percentage: '0%',
        icon: 'pi pi-tv',
        color: 'purple'
    },
     {
        title: 'SMS',
        value: '0',
        description: 'Social media enquiries',
        percentage: '0%',
        icon: 'pi pi-comment',
        color: 'pink'
    },
    {
        title: 'Total Cost',
        value: '0',
        description: 'Total advertisement spend',
        percentage: '100%',
        icon: 'pi pi-money-bill',
        color: 'cyan'
    }

]);

onMounted(async () => {
    try {
        const adverts = await RegistrationService.getAdverts();

        // Calculate total cost from adverts
        const totalCost = adverts.reduce((sum, advert) => {
            const cost = parseFloat(advert.cost?.replace(/,/g, '') || '0');
            return sum + cost;
        }, 0);

        // Calculate metrics for each medium
        const mediumStats = {
            'Road Posters': adverts.filter(a => a.medium === 'road_posters'),
            'Car Posters': adverts.filter(a => a.medium === 'car_posters'),
            'Radio': adverts.filter(a => a.medium === 'radio'),
            'TV': adverts.filter(a => a.medium === 'tv'),
            'SMS': adverts.filter(a => a.medium === 'sms'),
            'Phone Calls': adverts.filter(a => a.medium === 'phone_call')
        };

        // Update medium stats with cost, BSE count, and CPA
        Object.keys(mediumStats).forEach((mediumName, index) => {
            const mediumAdverts = mediumStats[mediumName];
            const mediumCost = mediumAdverts.reduce((sum, advert) => {
                const cost = parseFloat(advert.cost?.replace(/,/g, '') || '0');
                return sum + cost;
            }, 0);
            const mediumBseCount = mediumAdverts.filter(advert => advert.source === 'BSE').length;
            const mediumCpa = mediumAdverts.length > 0 ? Math.round(mediumCost / mediumAdverts.length) : 0;

            // Update corresponding stat card (index 1-6 for mediums)
            const statIndex = index + 1;
            if (stats.value[statIndex]) {
                stats.value[statIndex].value = mediumAdverts.length.toLocaleString();
                stats.value[statIndex].description = `Cost: TZS ${mediumCost.toLocaleString()} | BSE: ${mediumBseCount} | CPA: TZS ${mediumCpa.toLocaleString()}`;
            }
        });

        // Update total adverts
        stats.value[0].value = adverts.length.toLocaleString();

        // Calculate percentages
        const total = adverts.length;
        stats.value[0].percentage = '100%';
        stats.value[1].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'phone_call').length / total) * 100) + '%' : '0%';
        stats.value[2].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'road_posters').length / total) * 100) + '%' : '0%';
        stats.value[3].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'car_posters').length / total) * 100) + '%' : '0%';
        stats.value[4].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'radio').length / total) * 100) + '%' : '0%';
        stats.value[5].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'tv').length / total) * 100) + '%' : '0%';
        stats.value[6].percentage = total > 0 ? Math.round((adverts.filter(a => a.medium === 'sms').length / total) * 100) + '%' : '0%';
    } catch (error) {
        console.error('Failed to load advert stats:', error);
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
