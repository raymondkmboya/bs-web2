<script setup>
import { ref, onMounted } from 'vue';
import StaffTable from '@/components/hrm/StaffTable.vue';
import DepartmentsTable from '@/components/hrm/DepartmentsTable.vue';
import AttendanceTable from '@/components/hrm/AttendanceTable.vue';
import LeaveManagement from '@/components/hrm/LeaveManagement.vue';
import StaffForm from '@/components/hrm/StaffForm.vue';
import HumanResourceService from '@/service/HumanResourceService.js';

const activeTab = ref(0);
const loading = ref(false);
const showStaffForm = ref(false);
const editingStaff = ref(null);

// Real data from API
const staff = ref([]);
const departments = ref([]);
const attendance = ref([]);
const leaves = ref([]);

onMounted(() => {
    loadStaff();
    loadDepartments();
    loadAttendance();
    loadLeaves();
});

async function loadStaff() {
    try {
        loading.value = true;
        const staffData = await HumanResourceService.getStaffMembers();
        staff.value = staffData;
    } catch (error) {
        console.error('Failed to load staff:', error);
    } finally {
        loading.value = false;
    }
}

async function loadDepartments() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call when departments endpoint is created
        departments.value = [
            { id: 1, name: 'Teaching', description: 'Academic teaching staff', head: 'John Smith', totalStaff: 4, budget: 8000000, status: 'active' },
            { id: 2, name: 'Administration', description: 'School administration and management', head: 'Sarah Davis', totalStaff: 2, budget: 4000000, status: 'active' },
            { id: 3, name: 'Support', description: 'Support staff and services', head: 'Michael Wilson', totalStaff: 2, budget: 3000000, status: 'active' },
            { id: 4, name: 'Finance', description: 'Financial management and accounting', head: 'Lisa Martinez', totalStaff: 1, budget: 2000000, status: 'active' }
        ];
    } catch (error) {
        console.error('Failed to load departments:', error);
    } finally {
        loading.value = false;
    }
}

async function loadAttendance() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call when attendance endpoint is created
        attendance.value = [
            { id: 1, staffId: 1, staffName: 'John Smith', date: '2024-01-15', checkIn: '07:30', checkOut: '16:30', status: 'present', overtime: 0 },
            { id: 2, staffId: 2, staffName: 'Mary Johnson', date: '2024-01-15', checkIn: '07:45', checkOut: '16:45', status: 'present', overtime: 15 },
            { id: 3, staffId: 3, staffName: 'James Brown', date: '2024-01-15', checkIn: '08:00', checkOut: '16:30', status: 'late', overtime: 0 },
            { id: 4, staffId: 4, staffName: 'Sarah Davis', date: '2024-01-15', checkIn: '07:15', checkOut: '17:00', status: 'present', overtime: 30 },
            { id: 5, staffId: 5, staffName: 'Michael Wilson', date: '2024-01-15', checkIn: '07:30', checkOut: '16:30', status: 'present', overtime: 0 },
            { id: 6, staffId: 6, staffName: 'Emma Taylor', date: '2024-01-15', checkIn: '', checkOut: '', status: 'absent', overtime: 0 },
            { id: 7, staffId: 7, staffName: 'Robert Anderson', date: '2024-01-15', checkIn: '07:30', checkOut: '16:30', status: 'present', overtime: 0 },
            { id: 8, staffId: 8, staffName: 'Lisa Martinez', date: '2024-01-15', checkIn: '07:45', checkOut: '16:45', status: 'present', overtime: 15 }
        ];
    } catch (error) {
        console.error('Failed to load attendance:', error);
    } finally {
        loading.value = false;
    }
}

async function loadLeaves() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call when leave endpoint is created
        leaves.value = [
            { id: 1, staffId: 1, staffName: 'John Smith', type: 'Annual Leave', startDate: '2024-02-01', endDate: '2024-02-05', days: 5, reason: 'Family vacation', status: 'approved', approvedBy: 'Sarah Davis' },
            { id: 2, staffId: 6, staffName: 'Emma Taylor', type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-22', days: 3, reason: 'Medical treatment', status: 'pending', approvedBy: null },
            { id: 3, staffId: 3, staffName: 'James Brown', type: 'Personal Leave', startDate: '2024-01-25', endDate: '2024-01-25', days: 1, reason: 'Personal matters', status: 'rejected', approvedBy: 'Sarah Davis', rejectionReason: 'Insufficient notice' },
            { id: 4, staffId: 2, staffName: 'Mary Johnson', type: 'Maternity Leave', startDate: '2024-03-01', endDate: '2024-05-31', days: 90, reason: 'Maternity', status: 'approved', approvedBy: 'Sarah Davis' },
            { id: 5, staffId: 5, staffName: 'Michael Wilson', type: 'Study Leave', startDate: '2024-06-01', endDate: '2024-06-15', days: 15, reason: 'Professional development', status: 'pending', approvedBy: null }
        ];
    } catch (error) {
        console.error('Failed to load leaves:', error);
    } finally {
        loading.value = false;
    }
}

const staffFormRef = ref(null);

// Staff management functions
function openStaffDialog(staffMember = null) {
    editingStaff.value = staffMember;
    showStaffForm.value = true;
}

function closeStaffForm() {
    showStaffForm.value = false;
    editingStaff.value = null;
}

async function submitStaff(staffData) {
    try {
        if (editingStaff.value) {
            // Update existing staff
            await HumanResourceService.updateStaffMember(editingStaff.value.id, staffData);
        } else {
            // Create new staff
            await HumanResourceService.createStaffMember(staffData);
        }

        // Reload staff data
        await loadStaff();

        // Call success handler on StaffForm component
        if (staffFormRef.value) {
            staffFormRef.value.handleSubmissionSuccess();
        }
    } catch (error) {
        console.error('Failed to save staff:', error);

        // Call error handler on StaffForm component
        if (staffFormRef.value) {
            staffFormRef.value.handleSubmissionError(error);
        }
    }
}

function openDepartmentDialog() {
    // TODO: Implement department dialog
    console.log('Open department dialog');
}

function openAttendanceDialog() {
    // TODO: Implement attendance dialog
    console.log('Open attendance dialog');
}

function openLeaveDialog() {
    // TODO: Implement leave dialog
    console.log('Open leave dialog');
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Human Resources Management</h5>
            <span class="text-600">Manage staff, departments, attendance, and leave records</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Staff Management Tab -->
            <TabPanel header="Staff">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Staff Management</h6>
                        <span class="text-600 text-sm">Manage employee information, positions, and employment details</span>
                    </div>
                    <Button
                        v-if="!showStaffForm"
                        label="Add Staff"
                        icon="pi pi-plus"
                        @click="openStaffDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <!-- Staff Form Component - Show when form is active, hide table -->
                <StaffForm
                    ref="staffFormRef"
                    v-if="showStaffForm"
                    v-model:visible="showStaffForm"
                    :editing-staff="editingStaff"
                    @submit="submitStaff"
                    @cancel="closeStaffForm"
                />

                <!-- Staff Table - Show when form is hidden -->
                <StaffTable
                    v-if="!showStaffForm"
                    :staff="staff"
                    :loading="loading"
                    @edit-staff="openStaffDialog"
                />
            </TabPanel>

            <!-- Departments Tab -->
            <TabPanel header="Departments">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Department Management</h6>
                        <span class="text-600 text-sm">Manage organizational structure and department assignments</span>
                    </div>
                    <Button
                        label="Add Department"
                        icon="pi pi-plus"
                        @click="openDepartmentDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <DepartmentsTable
                    :departments="departments"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Attendance Tab -->
            <TabPanel header="Attendance">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Attendance Tracking</h6>
                        <span class="text-600 text-sm">Monitor staff attendance, check-in/out times, and overtime</span>
                    </div>
                    <Button
                        label="Mark Attendance"
                        icon="pi pi-clock"
                        @click="openAttendanceDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <AttendanceTable
                    :attendance="attendance"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Leave Management Tab -->
            <TabPanel header="Leave Management">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h6 class="mb-1">Leave Management</h6>
                        <span class="text-600 text-sm">Process leave requests, approvals, and leave balance tracking</span>
                    </div>
                    <Button
                        label="Request Leave"
                        icon="pi pi-calendar-plus"
                        @click="openLeaveDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <LeaveManagement
                    :leaves="leaves"
                    :loading="loading"
                />
            </TabPanel>
        </TabView>
    </div>
</template>
