<script setup>
import { ref, onMounted } from 'vue';
import VisitorsTable from '@/components/frontoffice/VisitorsTable.vue';
import PostalTable from '@/components/frontoffice/PostalTable.vue';
import AppointmentsTable from '@/components/frontoffice/AppointmentsTable.vue';

const activeTab = ref(0);
const loading = ref(false);

// Mock data for demonstration
const visitors = ref([]);
const postal = ref([]);
const appointments = ref([]);

onMounted(() => {
    loadVisitors();
    loadPostal();
    loadAppointments();
});

async function loadVisitors() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        visitors.value = [
            { id: 1, name: 'John Parent', purpose: 'Parent Meeting', studentName: 'Mary Smith', visitDate: '2024-01-15', checkIn: '09:30', checkOut: '10:45', idNumber: 'ID123456789', phone: '+255 123 456 789', status: 'completed' },
            { id: 2, name: 'Sarah Teacher', purpose: 'Job Interview', department: 'Academics', visitDate: '2024-01-15', checkIn: '10:00', checkOut: '11:30', idNumber: 'ID987654321', phone: '+255 123 456 790', status: 'completed' },
            { id: 3, name: 'Michael Supplier', purpose: 'Supply Delivery', company: 'Office Supplies Ltd', visitDate: '2024-01-15', checkIn: '11:15', checkOut: '', idNumber: 'ID456789123', phone: '+255 123 456 791', status: 'active' },
            { id: 4, name: 'Emma Parent', purpose: 'Student Inquiry', studentName: 'James Johnson', visitDate: '2024-01-14', checkIn: '14:00', checkOut: '15:00', idNumber: 'ID789123456', phone: '+255 123 456 792', status: 'completed' },
            { id: 5, name: 'Robert Inspector', purpose: 'School Inspection', organization: 'Ministry of Education', visitDate: '2024-01-14', checkIn: '09:00', checkOut: '16:00', idNumber: 'ID321654987', phone: '+255 123 456 793', status: 'completed' }
        ];
    } catch (error) {
        console.error('Failed to load visitors:', error);
    } finally {
        loading.value = false;
    }
}

async function loadPostal() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        postal.value = [
            { id: 1, type: 'Outgoing', recipient: 'Ministry of Education', address: 'P.O. Box 12345, Dar es Salaam', item: 'Academic Reports', dispatchDate: '2024-01-15', dispatchTime: '10:30', dispatchedBy: 'Admin Staff', status: 'dispatched', trackingNumber: 'TRK001' },
            { id: 2, type: 'Incoming', sender: 'Examination Council', address: 'P.O. Box 54321, Dodoma', item: 'Exam Materials', receiveDate: '2024-01-15', receiveTime: '09:15', receivedBy: 'John Smith', status: 'received', trackingNumber: 'TRK002' },
            { id: 3, type: 'Outgoing', recipient: 'Parent Association', address: 'P.O. Box 98765, Dar es Salaam', item: 'Meeting Minutes', dispatchDate: '2024-01-14', dispatchTime: '15:45', dispatchedBy: 'Mary Johnson', status: 'dispatched', trackingNumber: 'TRK003' },
            { id: 4, type: 'Incoming', sender: 'Book Supplier', address: 'P.O. Box 24680, Arusha', item: 'Textbooks', receiveDate: '2024-01-14', receiveTime: '11:30', receivedBy: 'Sarah Brown', status: 'received', trackingNumber: 'TRK004' },
            { id: 5, type: 'Outgoing', recipient: 'Bank', address: 'P.O. Box 11111, Dar es Salaam', item: 'Fee Statements', dispatchDate: '2024-01-13', dispatchTime: '14:20', dispatchedBy: 'David Wilson', status: 'dispatched', trackingNumber: 'TRK005' }
        ];
    } catch (error) {
        console.error('Failed to load postal:', error);
    } finally {
        loading.value = false;
    }
}

async function loadAppointments() {
    try {
        loading.value = true;
        // Mock data - replace with actual API call
        appointments.value = [
            { id: 1, title: 'Parent-Teacher Meeting', visitorName: 'John Parent', purpose: 'Discuss Student Progress', appointmentDate: '2024-01-16', appointmentTime: '10:00', staffName: 'Ms. Johnson', location: 'Staff Room', status: 'scheduled', contactPhone: '+255 123 456 789' },
            { id: 2, title: 'Job Interview', visitorName: 'Sarah Candidate', purpose: 'Teaching Position Interview', appointmentDate: '2024-01-16', appointmentTime: '14:00', staffName: 'Mr. Smith', location: 'Conference Room', status: 'scheduled', contactPhone: '+255 123 456 790' },
            { id: 3, title: 'Supplier Meeting', visitorName: 'Michael Supplier', purpose: 'Supply Contract Discussion', appointmentDate: '2024-01-17', appointmentTime: '09:30', staffName: 'Admin Staff', location: 'Principal Office', status: 'scheduled', contactPhone: '+255 123 456 791' },
            { id: 4, title: 'School Tour', visitorName: 'Emma Parent', purpose: 'New Student Enrollment Tour', appointmentDate: '2024-01-17', appointmentTime: '11:00', staffName: 'Admission Staff', location: 'School Campus', status: 'scheduled', contactPhone: '+255 123 456 792' },
            { id: 5, title: 'Inspection Visit', visitorName: 'Robert Inspector', purpose: 'Routine School Inspection', appointmentDate: '2024-01-18', appointmentTime: '08:00', staffName: 'Principal', location: 'Principal Office', status: 'scheduled', contactPhone: '+255 123 456 793' }
        ];
    } catch (error) {
        console.error('Failed to load appointments:', error);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">Front Office Management</h5>
            <span class="text-600">Manage visitors, postal dispatch, and appointments</span>
        </div>

        <TabView v-model:activeIndex="activeTab">
            <!-- Visitors Tab -->
            <TabPanel header="Visitor Book">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Visitor Management</h6>
                        <span class="text-600 text-sm">Track and manage school visitors with check-in/out records</span>
                    </div>
                    <Button 
                        label="Check In Visitor" 
                        icon="pi pi-plus" 
                        @click="openVisitorDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <VisitorsTable
                    :visitors="visitors"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Postal Dispatch Tab -->
            <TabPanel header="Postal Dispatch">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Postal Management</h6>
                        <span class="text-600 text-sm">Manage incoming and outgoing mail and packages</span>
                    </div>
                    <Button 
                        label="Add Postal Item" 
                        icon="pi pi-plus" 
                        @click="openPostalDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <PostalTable
                    :postal="postal"
                    :loading="loading"
                />
            </TabPanel>

            <!-- Appointments Tab -->
            <TabPanel header="Appointments">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h6 class="mb-1">Appointment Scheduling</h6>
                        <span class="text-600 text-sm">Manage and track scheduled appointments and meetings</span>
                    </div>
                    <Button 
                        label="Schedule Appointment" 
                        icon="pi pi-plus" 
                        @click="openAppointmentDialog()"
                        class="p-button-outlined"
                        size="small"
                    />
                </div>

                <AppointmentsTable
                    :appointments="appointments"
                    :loading="loading"
                />
            </TabPanel>
        </TabView>
    </div>
</template>
