<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { layoutConfig, isDarkTheme } = useLayout();
const lineData = ref(null);
const lineOptions = ref(null);

onMounted(() => {
    setColorOptions();
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    lineData.value = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Registrations',
                data: [65, 78, 90, 81, 56, 85, 70, 88, 95, 102, 88, 76],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
                borderColor: documentStyle.getPropertyValue('--p-blue-500'),
                tension: 0.4
            },
            {
                label: 'Admissions',
                data: [28, 48, 40, 59, 86, 67, 90, 73, 85, 90, 95, 88],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
                borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                tension: 0.4
            }
        ]
    };

    lineOptions.value = {
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
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
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
        <div class="font-semibold text-xl mb-4">Student Registrations & Admissions</div>
        <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
    </div>
</template>
