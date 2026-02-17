<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { layoutConfig, isDarkTheme } = useLayout();
const barData = ref(null);
const barOptions = ref(null);

onMounted(() => {
    setColorOptions();
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    barData.value = {
        labels: ['QT', 'CSEE', 'ASCEE', 'Computer Course', 'ECDE', 'English Course'],
        datasets: [
            {
                label: 'All',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                // borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: [120, 95, 110, 85, 75, 60, 50]
            },
            {
                label: 'Active',
                backgroundColor: documentStyle.getPropertyValue('--p-green-500'),
                // borderColor: documentStyle.getPropertyValue('--p-green-500'),
                data: [115, 90, 105, 80, 70, 55, 40]
            },
             {
                label: 'InActive',
                backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
                // borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                data: [120, 95, 110, 85, 75, 60, 50]
            },
            {
                label: 'Completed',
                backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
                // borderColor: documentStyle.getPropertyValue('--p-blue-500'),
                data: [115, 90, 105, 80, 70, 55, 40]
            },
             {
                label: 'InComplete',
                backgroundColor: documentStyle.getPropertyValue('--p-purple-500'),
                // borderColor: documentStyle.getPropertyValue('--p-purple-500'),
                data: [115, 90, 105, 80, 70, 55, 40]
            }
        ]
    };

    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
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
        <div class="font-semibold text-xl mb-4">Students by Form Level</div>
        <Chart type="bar" :data="barData" :options="barOptions"></Chart>
    </div>
</template>
