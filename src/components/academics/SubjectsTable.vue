<script setup>
const props = defineProps({
    subjects: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-subject', 'edit-subject', 'delete-subject']);

function getCategorySeverity(category) {
    const severityMap = {
        'Core': 'primary',
        'Science': 'success',
        'Humanities': 'warning',
        'Technical': 'info'
    };
    return severityMap[category] || 'secondary';
}

function formatNumber(num) {
    return num.toLocaleString();
}
</script>

<template>
    <DataTable 
        :value="subjects" 
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
                    <InputText placeholder="Search subjects..." />
                </span>
            </div>
        </template>

        <Column field="name" header="Subject Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.code }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="category" header="Category" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.category" 
                    :severity="getCategorySeverity(data.category)"
                />
            </template>
        </Column>

        <Column field="totalClasses" header="Classes" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-sitemap mr-2"></i>
                    <span class="font-semibold">{{ data.totalClasses }}</span>
                    <span class="text-600 text-sm ml-1">classes</span>
                </div>
            </template>
        </Column>

        <Column field="totalStudents" header="Total Students" sortable>
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

        <Column field="teachers" header="Teachers" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user-edit mr-2"></i>
                    <span class="font-semibold">{{ data.teachers }}</span>
                    <span class="text-600 text-sm ml-1">teachers</span>
                </div>
            </template>
        </Column>

        <Column field="avgStudentsPerTeacher" header="Avg/Teacher" sortable>
            <template #body="{ data }">
                <div class="text-center">
                    <span class="font-bold text-blue-600">
                        {{ Math.round(data.totalStudents / data.teachers) }}
                    </span>
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-subject', data)"
                    v-tooltip="'Edit Subject'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-subject', data)"
                    v-tooltip="'Delete Subject'"
                />
            </template>
        </Column>
    </DataTable>
</template>
