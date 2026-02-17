<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { layoutConfig, isDarkTheme } = useLayout();
const genderPieData = ref(null);
const genderPieOptions = ref(null);
const religionDoughnutData = ref(null);
const religionDoughnutOptions = ref(null);

onMounted(() => {
    setColorOptions();
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Gender Pie Chart
    genderPieData.value = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [450, 380],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-blue-500'),
                    documentStyle.getPropertyValue('--p-pink-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-blue-400'),
                    documentStyle.getPropertyValue('--p-pink-400')
                ]
            }
        ]
    };

    genderPieOptions.value = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    color: textColor,
                    padding: 20
                }
            }
        }
    };

    // Religion Doughnut Chart
    religionDoughnutData.value = {
        labels: ['Christian', 'Muslim', 'Hindu', 'Other'],
        datasets: [
            {
                data: [320, 280, 150, 80],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-green-500'),
                    documentStyle.getPropertyValue('--p-orange-500'),
                    documentStyle.getPropertyValue('--p-purple-500'),
                    documentStyle.getPropertyValue('--p-cyan-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-green-400'),
                    documentStyle.getPropertyValue('--p-orange-400'),
                    documentStyle.getPropertyValue('--p-purple-400'),
                    documentStyle.getPropertyValue('--p-cyan-400')
                ]
            }
        ]
    };

    religionDoughnutOptions.value = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    color: textColor,
                    padding: 20
                }
            }
        }
    };
}

watch(
    [() => layoutConfig.primary, () => layoutConfig.surface, isDarkTheme],
    () => {
        setColorOptions();
    },
    { immediate: true }
);
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Student Demographics</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h6 class="text-center font-medium mb-3">Gender Distribution</h6>
                <Chart type="pie" :data="genderPieData" :options="genderPieOptions"></Chart>
            </div>
            <div>
                <h6 class="text-center font-medium mb-3">Religion Distribution</h6>
                <Chart type="doughnut" :data="religionDoughnutData" :options="religionDoughnutOptions"></Chart>
            </div>
        </div>
    </div>
</template>
