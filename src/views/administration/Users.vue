<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(false);
const users = ref([]);

onMounted(() => {
    loadUsers();
});

async function loadUsers() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        users.value = [
            { id: 1, username: 'admin', email: 'admin@school.edu', name: 'System Administrator', role: 'Super Admin', status: 'active', lastLogin: '2024-01-15 09:30', createdDate: '2023-01-01' },
            { id: 2, username: 'jsmith', email: 'jsmith@school.edu', name: 'John Smith', role: 'Teacher', status: 'active', lastLogin: '2024-01-15 08:15', createdDate: '2023-02-15' },
            { id: 3, username: 'mjohnson', email: 'mjohnson@school.edu', name: 'Mary Johnson', role: 'Teacher', status: 'active', lastLogin: '2024-01-14 16:45', createdDate: '2023-03-20' },
            { id: 4, username: 'sbrown', email: 'sbrown@school.edu', name: 'Sarah Brown', role: 'Admin', status: 'active', lastLogin: '2024-01-15 10:20', createdDate: '2023-04-10' },
            { id: 5, username: 'dwilson', email: 'dwilson@school.edu', name: 'David Wilson', role: 'Teacher', status: 'inactive', lastLogin: '2024-01-10 14:30', createdDate: '2023-05-15' }
        ];
    } catch (error) {
        console.error('Failed to load users:', error);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Users & Permissions</h5>
            <span class="text-600">Manage user accounts, roles, and system permissions</span>
        </div>

        <div class="flex justify-content-between align-items-center mb-4">
            <div>
                <h6 class="mb-1">User Management</h6>
                <span class="text-600 text-sm">Create and manage user accounts with appropriate permissions</span>
            </div>
            <Button
                label="Add User"
                icon="pi pi-plus"
                class="p-button-outlined"
                size="small"
            />
        </div>

        <DataTable
            :value="users"
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
                        <InputText placeholder="Search users..." />
                    </span>
                </div>
            </template>

            <Column field="name" header="Full Name" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-user mr-2"></i>
                        <span class="font-semibold">{{ data.name }}</span>
                    </div>
                </template>
            </Column>

            <Column field="username" header="Username" sortable>
                <template #body="{ data }">
                    <span class="text-600">{{ data.username }}</span>
                </template>
            </Column>

            <Column field="email" header="Email" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-envelope mr-2"></i>
                        <span class="text-600">{{ data.email }}</span>
                    </div>
                </template>
            </Column>

            <Column field="role" header="Role" sortable>
                <template #body="{ data }">
                    <Tag
                        :value="data.role"
                        :severity="data.role === 'Super Admin' ? 'danger' : data.role === 'Admin' ? 'warning' : 'info'"
                    />
                </template>
            </Column>

            <Column field="status" header="Status" sortable>
                <template #body="{ data }">
                    <Tag
                        :value="data.status.toUpperCase()"
                        :severity="data.status === 'active' ? 'success' : 'danger'"
                    />
                </template>
            </Column>

            <Column field="lastLogin" header="Last Login" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-clock mr-2"></i>
                        <span class="text-600">{{ data.lastLogin }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-text mr-2"
                        v-tooltip="'Edit User'"
                    />
                    <Button
                        icon="pi pi-key"
                        class="p-button-rounded p-button-text mr-2"
                        v-tooltip="'Reset Password'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text p-button-danger"
                        v-tooltip="'Delete User'"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
