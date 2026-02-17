<script setup>
const props = defineProps({
    teachers: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-teacher', 'edit-teacher', 'delete-teacher']);

function getSeverity(teacher) {
    // Custom severity based on student load
    if (teacher.totalStudents > 35) return 'warning';
    if (teacher.totalStudents < 20) return 'info';
    return 'success';
}

function getStatusSeverity(status) {
    const statusMap = {
        'active': 'success',
        'inactive': 'danger',
        'on-leave': 'warning'
    };
    return statusMap[status] || 'info';
}

function formatNumber(num) {
    return num.toLocaleString();
}
</script>

<template>
    <DataTable 
        :value="teachers" 
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
                    <InputText placeholder="Search teachers..." />
                </span>
            </div>
        </template>

        <Column field="name" header="Teacher Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.name }}</span>
                        <div class="text-600 text-sm">{{ data.email }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="phone" header="Contact" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-phone mr-2"></i>
                    <span class="text-600">{{ data.phone }}</span>
                </div>
            </template>
        </Column>

        <Column field="subjects" header="Subjects" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-book mr-2"></i>
                    <span class="text-600 text-sm">{{ data.subjects }}</span>
                </div>
            </template>
        </Column>

        <Column field="streams" header="Assigned Streams" sortable>
            <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                    <Tag 
                        v-for="stream in data.streams" 
                        :key="stream"
                        :value="stream" 
                        severity="info"
                        class="mr-1 mb-1"
                    />
                </div>
            </template>
        </Column>

        <Column field="totalStudents" header="Total Students" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <Tag 
                        :value="formatNumber(data.totalStudents)" 
                        :severity="getSeverity(data)"
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
                    @click="$emit('edit-teacher', data)"
                    v-tooltip="'Edit Teacher'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-teacher', data)"
                    v-tooltip="'Delete Teacher'"
                />
            </template>
        </Column>
    </DataTable>
</template>
