<script setup>
import { ref, computed, onMounted } from 'vue';
import RegistrationService from '@/services/RegistrationService.js';

const loading = ref(false);
const stats = ref([
    {
        title: 'Total Expected',
        value: '0',
        description: 'Total fees expected from all students',
        percentage: '100%',
        icon: 'pi pi-money-bill',
        color: 'blue'
    },
    {
        title: 'Total Paid',
        value: '0',
        description: 'Total amount collected from students',
        percentage: '0%',
        icon: 'pi pi-check-circle',
        color: 'green'
    },
    {
        title: 'Total Balance',
        value: '0',
        description: 'Outstanding fees from all students',
        percentage: '0%',
        icon: 'pi pi-exclamation-triangle',
        color: 'orange'
    },
    {
        title: 'Daily Collections',
        value: '0',
        description: 'Total collections for today',
        percentage: '0%',
        icon: 'pi pi-calendar',
        color: 'purple'
    }
]);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
};

async function loadStats() {
    try {
        loading.value = true;

        // Get fee collections data
        const collections = await RegistrationService.getFeeCollections();

        // Calculate stats
        stats.value.totalExpected = collections.reduce((sum, item) => sum + item.totalAmount, 0);
        stats.value.totalPaid = collections.reduce((sum, item) => sum + item.totalPaid, 0);
        stats.value.totalBalance = collections.reduce((sum, item) => sum + item.balance, 0);

        // Calculate today's collections (simplified - in real app would filter by today's date)
        const today = new Date().toDateString();
        const todayPayments = collections
            .filter(item => {
                if (!item.lastPaymentDate) return false;
                return new Date(item.lastPaymentDate).toDateString() === today;
            })
            .reduce((sum, item) => sum + item.totalPaid, 0);
        stats.value.dailyCollections = todayPayments;

    } catch (error) {
        console.error('Failed to load fee collection stats:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadStats();
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
                    <div class="text-2xl font-bold text-900">{{ formatCurrency(stat.value) }}</div>
                    <div class="text-sm text-500 mt-1">{{ stat.description }}</div>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <i :class="`pi ${stat.icon} text-2xl text-${stat.color}-500`"></i>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                            class="h-1.5 rounded-full transition-all duration-500"
                            :class="`bg-${stat.color}-500`"
                            :style="{ width: stat.percentage }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
