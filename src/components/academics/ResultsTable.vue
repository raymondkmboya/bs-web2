<script setup>
const props = defineProps({
    results: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-result', 'edit-result', 'delete-result', 'publish-results']);

function getGradeSeverity(grade) {
    // Custom severity based on grade
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'primary';
    if (grade.includes('C')) return 'warning';
    if (grade.includes('D')) return 'danger';
    return 'secondary';
}

function getRemarksSeverity(remarks) {
    const severityMap = {
        'Excellent': 'success',
        'Very Good': 'primary',
        'Good': 'info',
        'Fair': 'warning',
        'Poor': 'danger'
    };
    return severityMap[remarks] || 'secondary';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function getScoreColor(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
}
</script>

<template>
    <DataTable 
        :value="results" 
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
                    <InputText placeholder="Search results..." />
                </span>
                <Button 
                    label="Publish Results" 
                    icon="pi pi-upload" 
                    class="p-button-success"
                    size="small"
                    @click="$emit('publish-results')"
                />
            </div>
        </template>

        <Column field="studentName" header="Student Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.studentName }}</span>
                        <div class="text-600 text-sm">{{ data.level }} - {{ data.stream }}</div>
                    </div>
                </div>
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

        <Column field="score" header="Score" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <span 
                        class="font-bold text-lg"
                        :class="getScoreColor(data.score, data.maxScore)"
                    >
                        {{ data.score }}/{{ data.maxScore }}
                    </span>
                </div>
            </template>
        </Column>

        <Column field="grade" header="Grade" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.grade" 
                    :severity="getGradeSeverity(data.grade)"
                    class="font-bold"
                />
            </template>
        </Column>

        <Column field="remarks" header="Remarks" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.remarks" 
                    :severity="getRemarksSeverity(data.remarks)"
                />
            </template>
        </Column>

        <Column field="date" header="Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.date) }}</span>
                </div>
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-result', data)"
                    v-tooltip="'Edit Result'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-result', data)"
                    v-tooltip="'Delete Result'"
                />
            </template>
        </Column>
    </DataTable>
</template>
