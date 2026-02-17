<script setup>
import { onMounted, ref } from 'vue';

const feeCollections = ref(null);

function formatCurrency(value) {
    return value.toLocaleString('en-TZ', { style: 'currency', currency: 'TZS' });
}

onMounted(() => {
    // Mock data for today's fee collections
    feeCollections.value = [
        {
            id: 'STU001',
            name: 'John Smith',
            class: 'Form 4A',
            amount: 450000,
            type: 'School Fees',
            time: '08:30 AM',
            status: 'Paid'
        },
        {
            id: 'STU002',
            name: 'Mary Johnson',
            class: 'Form 3B',
            amount: 450000,
            type: 'School Fees',
            time: '09:15 AM',
            status: 'Paid'
        },
        {
            id: 'STU003',
            name: 'David Wilson',
            class: 'Form 2C',
            amount: 120000,
            type: 'Exam Fees',
            time: '10:45 AM',
            status: 'Paid'
        },
        {
            id: 'STU004',
            name: 'Sarah Brown',
            class: 'Form 1A',
            amount: 450000,
            type: 'School Fees',
            time: '11:30 AM',
            status: 'Paid'
        },
        {
            id: 'STU005',
            name: 'Michael Davis',
            class: 'Form 5A',
            amount: 85000,
            type: 'Lab Fees',
            time: '02:15 PM',
            status: 'Paid'
        }
    ];
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Today's Fee Collections</div>
        <DataTable :value="feeCollections" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="id" header="Student ID" style="width: 15%"></Column>
            <Column field="name" header="Name" :sortable="true" style="width: 25%"></Column>
            <Column field="class" header="Class" style="width: 15%"></Column>
            <Column field="type" header="Fee Type" style="width: 15%"></Column>
            <Column field="amount" header="Amount" :sortable="true" style="width: 15%">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.amount) }}
                </template>
            </Column>
            <Column field="time" header="Time" style="width: 10%">
                <template #body="slotProps">
                    <span class="text-muted-color text-sm">{{ slotProps.data.time }}</span>
                </template>
            </Column>
        </DataTable>

        <div class="mt-4">
            <div class="flex justify-between items-center">
                <span class="font-semibold">Today's Total Collection:</span>
                <span class="text-xl font-bold text-green-500">{{ formatCurrency(1555000) }}</span>
            </div>
        </div>
    </div>
</template>
