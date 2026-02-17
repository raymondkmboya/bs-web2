<script setup>
const props = defineProps({
    staff: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-staff', 'edit-staff', 'delete-staff']);

function getStatusSeverity(status) {
    const statusMap = {
        'active': 'success',
        'inactive': 'danger',
        'on-leave': 'warning',
        'suspended': 'secondary'
    };
    return statusMap[status] || 'info';
}

function getDepartmentSeverity(department) {
    const deptMap = {
        'Teaching': 'primary',
        'Administration': 'success',
        'Support': 'info',
        'Finance': 'warning'
    };
    return deptMap[department] || 'secondary';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatSalary(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}
</script>

<template>
    <DataTable
        :value="staff"
        :paginator="true"
        :rows="10"
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-between items-center" >
                <h3 class="m-0">Staff Directory</h3>
                <div class="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear Filters"
                        class="p-button-outlined"
                        size="small"
                    />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Search staff..." />
                    </span>
                </div>
            </div>
        </template>

        <Column field="name" header="Staff Name" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.first_name }} {{ data.last_name }}</span>
                        <div class="text-600 text-sm">{{ data.staff_id }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="department" header="Department" sortable>
            <template #body="{ data }">
                <Tag
                    :value="data.department.department_name"
                    :severity="getDepartmentSeverity(data.department.department_name)"
                />
            </template>
        </Column>

        <Column field="position" header="Position" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-briefcase mr-2"></i>
                    <span class="text-600">{{ data.position }}</span>
                </div>
            </template>
        </Column>

        <Column field="level" header="Level" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-sitemap mr-2"></i>
                    <span class="text-600">{{ data.level }}</span>
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

        <Column field="salary" header="Salary" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-money-bill mr-2"></i>
                    <span class="font-semibold text-green-600">{{ formatSalary(data.salary) }}</span>
                </div>
            </template>
        </Column>

        <Column field="joinDate" header="Join Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ formatDate(data.joinDate) }}</span>
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
                    @click="$emit('edit-staff', data)"
                    v-tooltip="'Edit Staff'"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="$emit('delete-staff', data)"
                    v-tooltip="'Delete Staff'"
                />
            </template>
        </Column>
    </DataTable>
</template>
