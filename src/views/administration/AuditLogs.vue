<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(false);
const auditLogs = ref([]);
const selectedAction = ref(null);
const selectedUser = ref(null);
const dateRange = ref([]);

const actions = ['All', 'Login', 'Logout', 'Create', 'Update', 'Delete', 'View', 'Export'];
const users = ['All', 'admin', 'jsmith', 'mjohnson', 'sbrown', 'dwilson'];

onMounted(() => {
    loadAuditLogs();
});

async function loadAuditLogs() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        auditLogs.value = [
            { id: 1, user: 'admin', action: 'Login', module: 'Authentication', details: 'User logged in successfully', ipAddress: '192.168.1.100', timestamp: '2024-01-15 09:30:15', status: 'success' },
            { id: 2, user: 'jsmith', action: 'Create', module: 'Students', details: 'Created new student record: John Doe', ipAddress: '192.168.1.101', timestamp: '2024-01-15 09:45:22', status: 'success' },
            { id: 3, user: 'mjohnson', action: 'Update', module: 'Fees', details: 'Updated fee payment for student STU001', ipAddress: '192.168.1.102', timestamp: '2024-01-15 10:15:33', status: 'success' },
            { id: 4, user: 'sbrown', action: 'Delete', module: 'Attendance', details: 'Deleted attendance record for Form 1A', ipAddress: '192.168.1.103', timestamp: '2024-01-15 10:30:45', status: 'success' },
            { id: 5, user: 'admin', action: 'Export', module: 'Reports', details: 'Exported student attendance report', ipAddress: '192.168.1.100', timestamp: '2024-01-15 11:00:12', status: 'success' },
            { id: 6, user: 'dwilson', action: 'Login', module: 'Authentication', details: 'Failed login attempt - invalid password', ipAddress: '192.168.1.104', timestamp: '2024-01-15 11:15:28', status: 'failed' },
            { id: 7, user: 'jsmith', action: 'View', module: 'Results', details: 'Viewed exam results for Form 2A', ipAddress: '192.168.1.101', timestamp: '2024-01-15 11:30:40', status: 'success' },
            { id: 8, user: 'mjohnson', action: 'Logout', module: 'Authentication', details: 'User logged out successfully', ipAddress: '192.168.1.102', timestamp: '2024-01-15 12:00:55', status: 'success' }
        ];
    } catch (error) {
        console.error('Failed to load audit logs:', error);
    } finally {
        loading.value = false;
    }
}

function getActionSeverity(action) {
    const severityMap = {
        'Login': 'info',
        'Logout': 'secondary',
        'Create': 'success',
        'Update': 'warning',
        'Delete': 'danger',
        'View': 'info',
        'Export': 'primary'
    };
    return severityMap[action] || 'info';
}

function getStatusSeverity(status) {
    return status === 'success' ? 'success' : 'danger';
}

function exportLogs() {
    // Export functionality
    console.log('Exporting audit logs...');
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Audit Logs</h5>
            <span class="text-600">View system activity, user actions, and security events</span>
        </div>

        <!-- Filters -->
        <div class="flex gap-3 mb-4">
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Filter by Action</label>
                <Dropdown
                    v-model="selectedAction"
                    :options="actions"
                    placeholder="All Actions"
                    class="w-full"
                    showClear
                />
            </div>
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Filter by User</label>
                <Dropdown
                    v-model="selectedUser"
                    :options="users"
                    placeholder="All Users"
                    class="w-full"
                    showClear
                />
            </div>
            <div class="flex-1">
                <label class="block text-600 font-medium mb-2">Date Range</label>
                <Calendar
                    v-model="dateRange"
                    selectionMode="range"
                    placeholder="Select date range"
                    class="w-full"
                />
            </div>
        </div>

        <div class="flex justify-content-end gap-3 mb-4">
            <Button
                label="Clear Filters"
                icon="pi pi-filter-slash"
                class="p-button-outlined"
                size="small"
                @click="selectedAction = null; selectedUser = null; dateRange = []"
            />
            <Button
                label="Export Logs"
                icon="pi pi-download"
                class="p-button-outlined"
                size="small"
                @click="exportLogs"
            />
        </div>

        <DataTable
            :value="auditLogs"
            :paginator="true"
            :rows="15"
            dataKey="id"
            :loading="loading"
            responsiveLayout="scroll"
            stripedRows
            showGridlines
        >
            <Column field="timestamp" header="Timestamp" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-clock mr-2"></i>
                        <span class="text-600">{{ data.timestamp }}</span>
                    </div>
                </template>
            </Column>

            <Column field="user" header="User" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-user mr-2"></i>
                        <span class="font-semibold">{{ data.user }}</span>
                    </div>
                </template>
            </Column>

            <Column field="action" header="Action" sortable>
                <template #body="{ data }">
                    <Tag
                        :value="data.action"
                        :severity="getActionSeverity(data.action)"
                    />
                </template>
            </Column>

            <Column field="module" header="Module" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-cog mr-2"></i>
                        <span class="text-600">{{ data.module }}</span>
                    </div>
                </template>
            </Column>

            <Column field="details" header="Details" sortable>
                <template #body="{ data }">
                    <span class="text-600">{{ data.details }}</span>
                </template>
            </Column>

            <Column field="ipAddress" header="IP Address" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center">
                        <i class="pi pi-globe mr-2"></i>
                        <span class="text-600">{{ data.ipAddress }}</span>
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
                        icon="pi pi-eye"
                        class="p-button-rounded p-button-text mr-2"
                        v-tooltip="'View Details'"
                    />
                    <Button
                        icon="pi pi-download"
                        class="p-button-rounded p-button-text"
                        v-tooltip="'Export Entry'"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
