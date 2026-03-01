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
            <div class="flex justify-between">
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

        <Column field="subject_name" header="Subject Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.subject_name }}</span>
                        <div class="text-600 text-sm">{{ data.subject_code }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="class_level.class_level_name" header="Class Level" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-sitemap mr-2"></i>
                    <span class="font-semibold">{{ data.class_level.class_level_name }}</span>
                </div>
            </template>
        </Column>

        <Column field="students_count" header="Total Students" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-users mr-2"></i>
                    <Tag 
                        :value="formatNumber(data.students_count)" 
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
                    <span class="font-semibold">{{ data.subject_teacher.first_name }} {{ data.subject_teacher.last_name }}</span>
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
