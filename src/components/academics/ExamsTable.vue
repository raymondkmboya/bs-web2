<script setup>
const props = defineProps({
    exams: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-exam', 'edit-exam', 'delete-exam']);

function getStatusSeverity(status) {
    const statusMap = {
        'completed': 'success',
        'upcoming': 'info',
        'ongoing': 'warning',
        'cancelled': 'danger',
        'planned': 'secondary'
    };
    return statusMap[status] || 'info';
}

function getTypeSeverity(type) {
    const typeMap = {
        'Mid-Term': 'primary',
        'End-Term': 'success',
        'Mock': 'warning',
        'National': 'danger',
        'Quiz': 'info'
    };
    return typeMap[type] || 'secondary';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatNumber(num) {
    return num.toLocaleString();
}
</script>

<template>
    <DataTable 
        :value="exams" 
        :paginator="true" 
        :rows="10" 
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-content-between">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear Filters" 
                    class="p-button-outlined" 
                    size="small"
                />
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText placeholder="Search exams..." />
                </span>
            </div>
        </template>

        <Column field="title" header="Exam Title" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-file-edit mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.title }}</span>
                        <div class="text-600 text-sm">{{ data.level }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="type" header="Type" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.type" 
                    :severity="getTypeSeverity(data.type)"
                />
            </template>
        </Column>

        <Column field="subject" header="Subject" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <span class="text-600">{{ data.subject }}</span>
                </div>
            </template>
        </Column>

        <Column field="date" header="Exam Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.date) }}</span>
                </div>
            </template>
        </Column>

        <Column field="duration" header="Duration" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-clock mr-2"></i>
                    <span class="text-600">{{ data.duration }}</span>
                </div>
            </template>
        </Column>

        <Column field="totalStudents" header="Students" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-users mr-2"></i>
                    <Tag 
                        :value="formatNumber(data.totalStudents)" 
                        severity="info"
                        class="mr-2"
                    />
                    <span class="text-600 text-sm">students</span>
                </div>
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.status.toUpperCase()" 
                    :severity="getStatusSeverity(data.status)"
                />
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-exam', data)"
                    v-tooltip="'Edit Exam'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-exam', data)"
                    v-tooltip="'Delete Exam'"
                />
            </template>
        </Column>
    </DataTable>
</template>
