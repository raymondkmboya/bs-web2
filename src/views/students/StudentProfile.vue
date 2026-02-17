<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import RegistrationService from '@/services/RegistrationService.js';

const route = useRoute();
const studentId = route.params.id;

const student = ref(null);
const loading = ref(false);
const activeTab = ref(0);

// Mock student data
const mockStudent = {
    id: 'AD1256589',
    name: 'Janet Daniel',
    studentNumber: '2026-0001',
    email: 'janet.daniel@school.edu',
    phone: '+255 765 432 198',
    rollNumber: '35013',
    gender: 'Female',
    religion: 'Christianity',
    motherTongue: 'English',
    dateOfBirth: '2008-03-15',
    age: 16,
    admissionDate: '2024-01-15',
    currentClass: 'Form 2',
    stream: 'Science',
    house: 'Red House',
    status: 'Active',
    parentInfo: {
        fatherName: 'John Daniel',
        fatherPhone: '+255 765 432 197',
        fatherEmail: 'john.daniel@email.com',
        motherName: 'Mary Daniel',
        motherPhone: '+255 765 432 196',
        motherEmail: 'mary.daniel@email.com',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: ''
    },
    parentInfo: [
        {
        name: 'John Daniel',
        phone: '+255 765 432 197',
        email: 'john.daniel@email.com',
        relation: 'Father',
    },
    {
        name: 'Jane Daniel',
        phone: '+255 765 432 198',
        email: 'jane.daniel@email.com',
        relation: 'Mother',
    },

],
    address: {
        street: '123 Education Street',
        city: 'Dar es Salaam',
        region: 'Kinondoni',
        postalCode: '12345',
        country: 'Tanzania'
    },
    medical: {
        bloodGroup: 'O+',
        allergies: 'Penicillin',
        conditions: 'None',
        emergencyContact: '+255 765 432 199'
    },
    academic: {
        previousSchool: 'St. Mary\'s Primary',
        admissionNumber: 'AD1256589',
        admissionDate: '2024-01-15',
        examNumber: 'PS202400123',
        year: '2024',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kiswahili'],
        performance: {
            term1: { gpa: 3.8, rank: 5 },
            term2: { gpa: 3.9, rank: 3 },
            term3: { gpa: 4.1, rank: 2 }
        },
        exams: [
            { subject: 'Mathematics', grade: 85, date: '2024-03-15', remarks: 'Excellent performance' },
            { subject: 'Physics', grade: 78, date: '2024-03-18', remarks: 'Good understanding' },
            { subject: 'Chemistry', grade: 82, date: '2024-03-20', remarks: 'Needs improvement' },
            { subject: 'Biology', grade: 88, date: '2024-03-22', remarks: 'Very good' },
            { subject: 'English', grade: 90, date: '2024-03-25', remarks: 'Outstanding' },
            { subject: 'Kiswahili', grade: 75, date: '2024-03-28', remarks: 'Satisfactory' }
        ]
    },
    fees: {
        feeGroups: [
            {
                name: 'Tuition Fee',
                description: 'Regular tuition fees for all classes',
                type: 'mandatory',
                totalExpected: 1500000,
                totalPaid: 1200000,
                balance: 300000,
                status: 'Partially Paid'
            },
            {
                name: 'Examination Fee',
                description: 'Fees for internal and external examinations',
                type: 'mandatory',
                totalExpected: 500000,
                totalPaid: 500000,
                balance: 0,
                status: 'Paid'
            },
            {
                name: 'Library Fee',
                description: 'Library access and book borrowing fees',
                type: 'mandatory',
                totalExpected: 100000,
                totalPaid: 100000,
                balance: 0,
                status: 'Paid'
            },
            {
                name: 'Sports Fee',
                description: 'Sports equipment and facility fees',
                type: 'optional',
                totalExpected: 75000,
                totalPaid: 0,
                balance: 75000,
                status: 'Outstanding'
            },
            {
                name: 'Transport Fee',
                description: 'School bus transportation fees',
                type: 'optional',
                totalExpected: 200000,
                totalPaid: 200000,
                balance: 0,
                status: 'Paid'
            },
            {
                name: 'Lab Fee',
                description: 'Laboratory equipment and materials fee',
                type: 'mandatory',
                totalExpected: 150000,
                totalPaid: 150000,
                balance: 0,
                status: 'Paid'
            }
        ],
        total: 2025000,
        paid: 1750000,
        balance: 275000,
        lastPayment: '2024-01-10',
        nextDue: '2024-02-10',
        paymentHistory: [
            { date: '2024-01-10', description: 'Tuition Fee - Term 1', amount: 500000, method: 'Bank Transfer', status: 'Completed' },
            { date: '2023-12-15', description: 'Examination Fee - Term 3', amount: 200000, method: 'Cash', status: 'Completed' },
            { date: '2024-01-05', description: 'Library Fee - Annual', amount: 100000, method: 'Mobile Money', status: 'Completed' },
            { date: '2023-10-20', description: 'Transport Fee - Term 1', amount: 200000, method: 'Bank Transfer', status: 'Completed' }
        ]
    },
    library: {
        booksIssued: [
            { id: 1, title: 'Biology Textbook Form 2', author: 'Ministry of Education', issueDate: '2024-01-15', dueDate: '2024-04-15', image: '/demo/images/product/blue-t-shirt.jpg' },
            { id: 2, title: 'Chemistry Lab Manual', author: 'Dr. Smith', issueDate: '2024-01-20', dueDate: '2024-04-20', image: '/demo/images/product/game-controller.jpg' },
            { id: 3, title: 'Mathematics Workbook', author: 'Various Authors', issueDate: '2024-01-25', dueDate: '2024-04-25', image: '/demo/images/product/gold-zipper-container.jpg' }
        ]
    },
    attendance: {
        present: 145,
        absent: 8,
        late: 5,
        percentage: 92,
        calendar: [
            { date: '2024-02-01', day: 1, status: 'present' },
            { date: '2024-02-02', day: 2, status: 'present' },
            { date: '2024-02-03', day: 3, status: 'present' },
            { date: '2024-02-04', day: 4, status: 'weekend' },
            { date: '2024-02-05', day: 5, status: 'weekend' },
            { date: '2024-02-06', day: 6, status: 'present' },
            { date: '2024-02-07', day: 7, status: 'present' },
            { date: '2024-02-08', day: 8, status: 'late' },
            { date: '2024-02-09', day: 9, status: 'present' },
            { date: '2024-02-10', day: 10, status: 'present' },
            { date: '2024-02-11', day: 11, status: 'weekend' },
            { date: '2024-02-12', day: 12, status: 'weekend' },
            { date: '2024-02-13', day: 13, status: 'present' },
            { date: '2024-02-14', day: 14, status: 'present' },
            { date: '2024-02-15', day: 15, status: 'absent' },
            { date: '2024-02-16', day: 16, status: 'present' },
            { date: '2024-02-17', day: 17, status: 'present' },
            { date: '2024-02-18', day: 18, status: 'weekend' },
            { date: '2024-02-19', day: 19, status: 'weekend' },
            { date: '2024-02-20', day: 20, status: 'present' },
            { date: '2024-02-21', day: 21, status: 'present' },
            { date: '2024-02-22', day: 22, status: 'late' },
            { date: '2024-02-23', day: 23, status: 'present' },
            { date: '2024-02-24', day: 24, status: 'present' },
            { date: '2024-02-25', day: 25, status: 'weekend' },
            { date: '2024-02-26', day: 26, status: 'weekend' },
            { date: '2024-02-27', day: 27, status: 'present' },
            { date: '2024-02-28', day: 28, status: 'present' },
            { date: '2024-02-29', day: 29, status: 'present' }
        ]
    },
    timetable: [
        {
            time: '07:30 - 08:30',
            monday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
            tuesday: { subject: 'Physics', teacher: 'Dr. Smith', room: 'Lab 201' },
            wednesday: { subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 202' },
            thursday: { subject: 'Biology', teacher: 'Mrs. Brown', room: 'Lab 203' },
            friday: { subject: 'English', teacher: 'Mr. Wilson', room: 'Room 102' }
        },
        {
            time: '08:45 - 09:45',
            monday: { subject: 'English', teacher: 'Mr. Wilson', room: 'Room 102' },
            tuesday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
            wednesday: { subject: 'Physics', teacher: 'Dr. Smith', room: 'Lab 201' },
            thursday: { subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 202' },
            friday: { subject: 'Kiswahili', teacher: 'Ms. Kimaro', room: 'Room 103' }
        },
        {
            time: '10:00 - 11:00',
            monday: { subject: 'Biology', teacher: 'Mrs. Brown', room: 'Lab 203' },
            tuesday: { subject: 'History', teacher: 'Mr. Anderson', room: 'Room 104' },
            wednesday: { subject: 'Geography', teacher: 'Ms. Taylor', room: 'Room 105' },
            thursday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
            friday: { subject: 'Physics', teacher: 'Dr. Smith', room: 'Lab 201' }
        },
        {
            time: '11:15 - 12:15',
            monday: { subject: 'Physical Education', teacher: 'Mr. Martinez', room: 'Sports Field' },
            tuesday: { subject: 'Biology', teacher: 'Mrs. Brown', room: 'Lab 203' },
            wednesday: { subject: 'English', teacher: 'Mr. Wilson', room: 'Room 102' },
            thursday: { subject: 'Computer Studies', teacher: 'Ms. Lee', room: 'Computer Lab' },
            friday: { subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 202' }
        },
        {
            time: '13:30 - 14:30',
            monday: { subject: 'Kiswahili', teacher: 'Ms. Kimaro', room: 'Room 103' },
            tuesday: { subject: 'Computer Studies', teacher: 'Ms. Lee', room: 'Computer Lab' },
            wednesday: { subject: 'Physical Education', teacher: 'Mr. Martinez', room: 'Sports Field' },
            thursday: { subject: 'History', teacher: 'Mr. Anderson', room: 'Room 104' },
            friday: { subject: 'Biology', teacher: 'Mrs. Brown', room: 'Lab 203' }
        },
        {
            time: '14:45 - 15:45',
            monday: { subject: 'Geography', teacher: 'Ms. Taylor', room: 'Room 105' },
            tuesday: { subject: 'Kiswahili', teacher: 'Ms. Kimaro', room: 'Room 103' },
            wednesday: { subject: 'Computer Studies', teacher: 'Ms. Lee', room: 'Computer Lab' },
            thursday: { subject: 'Physical Education', teacher: 'Mr. Martinez', room: 'Sports Field' },
            friday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' }
        }
    ]
};

onMounted(async () => {
    loading.value = true;
    try {
        // In real app, fetch student data
        // const studentData = await RegistrationService.getStudentProfile(studentId);
        // student.value = studentData;

        // For now, use mock data
        student.value = mockStudent;
    } catch (error) {
        console.error('Failed to load student profile:', error);
    } finally {
        loading.value = false;
    }
});

const age = computed(() => {
    if (!student.value?.dateOfBirth) return '';
    const birthYear = new Date(student.value.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
});

const feeStatus = computed(() => {
    if (!student.value?.fees) return '';
    const percentage = (student.value.fees.paid / student.value.fees.total) * 100;
    if (percentage === 100) return 'Paid';
    if (percentage >= 75) return 'Mostly Paid';
    if (percentage >= 50) return 'Partially Paid';
    return 'Outstanding';
});

const attendanceStatus = computed(() => {
    if (!student.value?.attendance) return '';
    const percentage = student.value.attendance.percentage;
    if (percentage >= 95) return { text: 'Excellent', color: 'success' };
    if (percentage >= 85) return { text: 'Good', color: 'info' };
    if (percentage >= 75) return { text: 'Fair', color: 'warning' };
    return { text: 'Poor', color: 'danger' };
});

const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'danger';
        case 'pending':
            return 'warning';
        case 'graduated':
            return 'info';
        default:
            return 'secondary';
    }
};
</script>


<template>
    <div>
        <div class="flex align-items-center mb-4">
            <Button icon="pi pi-arrow-left" label="Back to Admissions" class="p-button-text" @click="$router.go(-1)" />
            <!-- <h5 class="m-0">Student Profile</h5> -->
        </div>

        <div v-if="loading" class="flex justify-content-center">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>

        <div v-else-if="student">
            <!-- Student Basic Info Card (Full Width) -->
            <div class="col-12 mb-6">
                <div class="card p-fluid">
                    <div class="flex flex-column md:flex-row align-items-start md:align-items-start text-center md:text-left mb-4">
                        <div class="flex flex-column align-items-center text-center md:mr-6">
                            <OverlayBadge :value="student.status" severity="success">
                                <img src="/public/demo/images/logo.svg" alt="Student" style="border-radius: 20px;" class="w-10rem h-10rem shadow-2 border-circle mb-3" />
                                <span class="text-900 font-bold text-sm block mb-1">{{ student.name }}</span>
                                <span class="text-900 font-bold text-lgd">{{ student.studentNumber }}</span>
                            </OverlayBadge>
                        </div>
                        <div class="flex flex-column flex-1">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-id-card text-2xl text-primary mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Roll No</span>
                                    <span class="text-900 font-bold text-lg">{{ student.rollNumber }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-user text-2xl text-primary mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Gender</span>
                                    <span class="text-900 font-bold text-lg">{{ student.gender }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-calendar text-2xl text-primary mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Age</span>
                                    <span class="text-900 font-bold text-lg">{{ age }} years</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-book text-2xl text-primary mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Class</span>
                                    <span class="text-900 font-bold text-lg">{{ student.currentClass }} - {{ student.stream }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-home text-2xl text-primary mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">House</span>
                                    <span class="text-900 font-bold text-lg">{{ student.house }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-money-bill text-2xl text-green-500 mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Total Fees</span>
                                    <span class="text-900 font-bold text-lg">TZS {{ student.fees.total.toLocaleString() }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-check-circle text-2xl text-green-500 mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Fees Paid</span>
                                    <span class="text-900 font-bold text-lg">TZS {{ student.fees.paid.toLocaleString() }}</span>
                                </div>
                                <div class="text-center p-4 border-1 surface-border border-round">
                                    <i class="pi pi-exclamation-triangle text-2xl text-orange-500 mb-2"></i>
                                    <span class="text-500 font-medium text-sm block mb-1">Balance</span>
                                    <span class="text-900 font-bold text-lg">TZS {{ student.fees.balance.toLocaleString() }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ml-auto">
                            <Button label="Edit Profile" icon="pi pi-user" class="p-button-outlined p-button-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Information Tabs (Full Width) -->
            <div class="col-12">
                <div class="card h-full">
                    <TabView v-model:activeTab="activeTab" class="h-full">
                        <!-- Personal Information Tab -->
                        <TabPanel header="Personal Information" class="p-4">
                            <!-- Parents Information Section (Full Width) -->
                            <div class="bg-surface-50 dark:bg-surface-950 mb-6">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Parents Information</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Parent and guardian contact details</div>
                                        </div>
                                    </div>

                                    <div v-for="parent in student.parentInfo" :key="parent.name" class="col-12">
                                        <div class="flex flex-col md:flex-row align-items-start md:align-items-center justify-content-between p-4 border-1 surface-border border-round mb-3 bg-white hover:surface-100 transition-colors">
                                            <!-- Parent Name and Relation -->
                                            <div class="flex align-items-center mb-3 md:mb-0 md:mr-6">
                                                <Avatar icon="pi pi-user" size="large" shape="circle" class="bg-primary-100 text-primary mr-3" />
                                                <div>
                                                    <div class="text-900 font-bold text-lg">{{ parent.name }}</div>
                                                    <div class="text-primary font-medium">{{ parent.relation }}</div>
                                                </div>
                                            </div>

                                            <!-- Phone Section -->
                                            <div class="flex align-items-center mb-3 md:mb-0 md:mr-6">
                                                <div class="flex align-items-center gap-3">
                                                    <Button icon="pi pi-phone" class="p-button-rounded p-button-text p-button-secondary" />
                                                    <div>
                                                        <div class="text-500 font-bold text-xs uppercase">Phone Number</div>
                                                        <div class="text-900 font-semibold">{{ parent.phone }}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Email Section -->
                                            <div class="flex align-items-center mb-3 md:mb-0">
                                                <div class="flex align-items-center gap-3">
                                                    <Button icon="pi pi-envelope" class="p-button-rounded p-button-text p-button-secondary" />
                                                    <div>
                                                        <div class="text-500 font-bold text-xs uppercase">Email Address</div>
                                                        <div class="text-900 font-semibold">{{ parent.email }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Documents Section (Full Width) -->
                            <div class="bg-surface-50 dark:bg-surface-950 mb-6">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Documents</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Student official documents</div>
                                        </div>
                                    </div>

                                    <div class="flex flex-column gap-3">
                                        <div class="flex align-items-center justify-content-between p-3 border-round bg-blue-50 border-1 border-blue-100">
                                            <div class="flex align-items-center">
                                                <i class="pi pi-file-pdf text-red-500 text-2xl mr-3"></i>
                                                <span class="text-900 font-bold">BirthCertificate.pdf</span>
                                            </div>
                                            <Button icon="pi pi-download" class="p-button-rounded p-button-primary p-button-sm" />
                                        </div>
                                        <div class="flex align-items-center justify-content-between p-3 border-round bg-blue-50 border-1 border-blue-100">
                                            <div class="flex align-items-center">
                                                <i class="pi pi-file-pdf text-red-500 text-2xl mr-3"></i>
                                                <span class="text-900 font-bold">Transfer_Certificate.pdf</span>
                                            </div>
                                            <Button icon="pi pi-download" class="p-button-rounded p-button-primary p-button-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Address Section (Full Width) -->
                            <div class="bg-surface-50 dark:bg-surface-950 mb-6">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Address Information</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Current residential address</div>
                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <label class="text-500 font-bold text-xs uppercase block mb-2">Current Address</label>
                                        <div class="p-3 bg-gray-100 border-round text-900 line-height-3">
                                            {{ student.address.street }}<br>
                                            {{ student.address.city }}, {{ student.address.region }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Medical Section (Full Width) -->
                            <div class="bg-surface-50 dark:bg-surface-950">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Medical Information</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Health and medical details</div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Blood Group</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-heart text-red-500"></i>
                                                <span class="text-red-600 font-bold text-xl">{{ student.medical.bloodGroup }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Allergies</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-exclamation-triangle text-orange-500"></i>
                                                <span class="text-900 font-bold">{{ student.medical.allergies }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Academic Information Tab -->
                        <TabPanel header="Academic Information" class="p-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <!-- Admission Details -->
                                <div class="bg-surface-50 dark:bg-surface-950 p-6 rounded-2xl">
                                    <div class="flex items-center gap-3 mb-4">
                                        <i class="pi pi-id-card text-2xl text-primary"></i>
                                        <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Admission Details</h6>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex justify-content-between">
                                            <span class="text-500 font-medium">Admission Number:</span>
                                            <span class="text-900 font-bold">{{ student.admissionNumber }}</span>
                                        </div>
                                        <div class="flex justify-content-between">
                                            <span class="text-500 font-medium">Admission Date:</span>
                                            <span class="text-900 font-bold">{{ student.admissionDate }}</span>
                                        </div>
                                        <div class="flex justify-content-between">
                                            <span class="text-500 font-medium">Previous School:</span>
                                            <span class="text-900 font-bold">{{ student.academic.previousSchool }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Current Class -->
                                <div class="bg-surface-50 dark:bg-surface-950 p-6 rounded-2xl">
                                    <div class="flex items-center gap-3 mb-4">
                                        <i class="pi pi-book text-2xl text-primary"></i>
                                        <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Current Class</h6>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex justify-content-between">
                                            <span class="text-500 font-medium">Class:</span>
                                            <span class="text-900 font-bold">{{ student.currentClass }} - {{ student.stream }}</span>
                                        </div>
                                        <div class="flex justify-content-between">
                                            <span class="text-500 font-medium">Academic Year:</span>
                                            <span class="text-900 font-bold">{{ student.academic.year }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Performance -->
                                <div class="bg-surface-50 dark:bg-surface-950 p-6 rounded-2xl">
                                    <div class="flex items-center gap-3 mb-4">
                                        <i class="pi pi-chart-line text-2xl text-primary"></i>
                                        <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Performance</h6>
                                    </div>
                                    <div class="space-y-3">
                                        <div v-for="(term, index) in ['Term 1', 'Term 2', 'Term 3']" :key="index" class="border-1 surface-border border-round p-3">
                                            <div class="flex justify-content-between mb-2">
                                                <span class="text-500 font-medium">{{ term }}</span>
                                                <div class="flex gap-4">
                                                    <span class="text-sm">GPA: <strong>{{ student.academic.performance[`term${index + 1}`].gpa }}</strong></span>
                                                    <span class="text-sm">Rank: <strong>{{ student.academic.performance[`term${index + 1}`].rank }}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Exams -->
                                <div class="bg-surface-50 dark:bg-surface-950 p-6 rounded-2xl">
                                    <div class="flex items-center gap-3 mb-4">
                                        <i class="pi pi-file-edit text-2xl text-primary"></i>
                                        <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Exams</h6>
                                    </div>
                                    <div class="space-y-3">
                                        <div v-for="exam in student.academic.exams" :key="exam.subject" class="border-1 surface-border border-round p-3">
                                            <div class="flex justify-content-between mb-2">
                                                <span class="text-500 font-medium">{{ exam.subject }}</span>
                                                <span class="font-bold" :class="exam.grade >= 70 ? 'text-green-600' : 'text-orange-500'">{{ exam.grade }}%</span>
                                            </div>
                                            <div class="text-sm text-500">
                                                <span>Date: {{ exam.date }}</span>
                                                <span class="ml-4">Remarks: {{ exam.remarks }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Fees Information Tab -->
                        <TabPanel header="Fees & Payments" class="p-4">
                            <!-- Fee Groups Table -->
                            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl mb-6">
                                <div class="flex justify-content-between align-items-center mb-4">
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Fee Groups</h6>
                                    <div class="flex gap-2">
                                        <Button label="Add Payment" icon="pi pi-plus" class="p-button-primary" size="small" />
                                        <Button label="Print Receipt" icon="pi pi-print" class="p-button-outlined" size="small" />
                                    </div>
                                </div>

                                <DataTable :value="student.fees.feeGroups" class="p-datatable-sm">
                                    <Column field="name" header="Fee Group" sortable>
                                        <template #body="{ data }">
                                            <div class="flex align-items-center">
                                                <i class="pi pi-money-bill mr-2"></i>
                                                <span class="font-semibold">{{ data.name }}</span>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="description" header="Description" sortable>
                                        <template #body="{ data }">
                                            <span class="text-600 text-sm">{{ data.description }}</span>
                                        </template>
                                    </Column>
                                    <Column field="type" header="Type" sortable>
                                        <template #body="{ data }">
                                            <Tag
                                                :value="data.type === 'mandatory' ? 'Mandatory' : 'Optional'"
                                                :severity="data.type === 'mandatory' ? 'danger' : 'info'"
                                            />
                                        </template>
                                    </Column>
                                    <Column field="totalExpected" header="Total Expected" sortable>
                                        <template #body="{ data }">
                                            <span class="font-bold text-blue-600">TZS {{ data.totalExpected.toLocaleString() }}</span>
                                        </template>
                                    </Column>
                                    <Column field="totalPaid" header="Total Paid" sortable>
                                        <template #body="{ data }">
                                            <span class="font-bold text-green-600">TZS {{ data.totalPaid.toLocaleString() }}</span>
                                        </template>
                                    </Column>
                                    <Column field="balance" header="Balance" sortable>
                                        <template #body="{ data }">
                                            <span
                                                class="font-bold"
                                                :class="data.balance === 0 ? 'text-green-600' : 'text-orange-600'"
                                            >
                                                TZS {{ data.balance.toLocaleString() }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="status" header="Status" sortable>
                                        <template #body="{ data }">
                                            <Tag
                                                :value="data.status"
                                                :severity="data.status === 'Paid' ? 'success' : data.status === 'Partially Paid' ? 'warning' : 'danger'"
                                            />
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>

                            <!-- Payment History Table -->
                            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl">
                                <div class="flex justify-content-between align-items-center mb-4">
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Payment History</h6>
                                    <Button label="View All" icon="pi pi-external-link" class="p-button-outlined" size="small" />
                                </div>

                                <DataTable :value="student.fees.paymentHistory" :paginator="true" class="p-datatable-sm">
                                    <Column field="date" header="Date" sortable>
                                        <template #body="{ data }">
                                            {{ data.date }}
                                        </template>
                                    </Column>
                                    <Column field="description" header="Description" sortable>
                                        <template #body="{ data }">
                                            {{ data.description }}
                                        </template>
                                    </Column>
                                    <Column field="amount" header="Amount" sortable>
                                        <template #body="{ data }">
                                            TZS {{ data.amount.toLocaleString() }}
                                        </template>
                                    </Column>
                                    <Column field="method" header="Payment Method" sortable>
                                        <template #body="{ data }">
                                            {{ data.method }}
                                        </template>
                                    </Column>
                                    <Column field="status" header="Status" sortable>
                                        <template #body="{ data }">
                                            <Tag :value="data.status" :severity="data.status === 'Completed' ? 'success' : 'warning'" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </TabPanel>

                        <!-- Timetable Tab -->
                        <TabPanel header="Timetable" class="p-4">
                            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl">
                                <div class="flex justify-content-between align-items-center mb-4">
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Weekly Timetable</h6>
                                    <div class="flex gap-2">
                                        <Button label="Previous Week" icon="pi pi-chevron-left" class="p-button-outlined p-button-sm" />
                                        <Button label="Current Week" class="p-button-primary p-button-sm" />
                                        <Button label="Next Week" icon="pi pi-chevron-right" class="p-button-outlined p-button-sm" />
                                    </div>
                                </div>

                                <DataTable :value="student.timetable" :paginator="false" class="p-datatable-sm">
                                    <Column field="time" header="Time" frozen style="min-width: 120px">
                                        <template #body="{ data }">
                                            <span class="font-bold">{{ data.time }}</span>
                                        </template>
                                    </Column>
                                    <Column field="monday" header="Monday" style="min-width: 150px">
                                        <template #body="{ data }">
                                            <div class="p-2 border-round" :class="data.monday.subject ? 'bg-primary-50 text-primary-700' : 'bg-surface-100'">
                                                <div class="font-bold text-sm">{{ data.monday.subject || '-' }}</div>
                                                <div class="text-xs">{{ data.monday.teacher || '' }}</div>
                                                <div class="text-xs">{{ data.monday.room || '' }}</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="tuesday" header="Tuesday" style="min-width: 150px">
                                        <template #body="{ data }">
                                            <div class="p-2 border-round" :class="data.tuesday.subject ? 'bg-primary-50 text-primary-700' : 'bg-surface-100'">
                                                <div class="font-bold text-sm">{{ data.tuesday.subject || '-' }}</div>
                                                <div class="text-xs">{{ data.tuesday.teacher || '' }}</div>
                                                <div class="text-xs">{{ data.tuesday.room || '' }}</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="wednesday" header="Wednesday" style="min-width: 150px">
                                        <template #body="{ data }">
                                            <div class="p-2 border-round" :class="data.wednesday.subject ? 'bg-primary-50 text-primary-700' : 'bg-surface-100'">
                                                <div class="font-bold text-sm">{{ data.wednesday.subject || '-' }}</div>
                                                <div class="text-xs">{{ data.wednesday.teacher || '' }}</div>
                                                <div class="text-xs">{{ data.wednesday.room || '' }}</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="thursday" header="Thursday" style="min-width: 150px">
                                        <template #body="{ data }">
                                            <div class="p-2 border-round" :class="data.thursday.subject ? 'bg-primary-50 text-primary-700' : 'bg-surface-100'">
                                                <div class="font-bold text-sm">{{ data.thursday.subject || '-' }}</div>
                                                <div class="text-xs">{{ data.thursday.teacher || '' }}</div>
                                                <div class="text-xs">{{ data.thursday.room || '' }}</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="friday" header="Friday" style="min-width: 150px">
                                        <template #body="{ data }">
                                            <div class="p-2 border-round" :class="data.friday.subject ? 'bg-primary-50 text-primary-700' : 'bg-surface-100'">
                                                <div class="font-bold text-sm">{{ data.friday.subject || '-' }}</div>
                                                <div class="text-xs">{{ data.friday.teacher || '' }}</div>
                                                <div class="text-xs">{{ data.friday.room || '' }}</div>
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </TabPanel>

                        <!-- Library Tab -->
                        <TabPanel header="Library Records" class="p-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div v-for="book in student.library.booksIssued" :key="book.id" class="col-span-full">
                                    <div class="card p-4 border-1 surface-border border-round hover:shadow-3 transition-all">
                                        <div class="flex justify-content-center mb-3">
                                            <img :src="book.image" :alt="book.title" class="w-full shadow-2 border-round" style="max-height: 150px; object-fit: cover"/>
                                        </div>
                                        <div class="font-bold mb-2 text-lg">{{ book.title }}</div>
                                        <div class="text-sm text-500 mb-1">Author: {{ book.author }}</div>
                                        <div class="text-sm text-500 mb-1">Issued: {{ book.issueDate }}</div>
                                        <div class="text-sm text-500 mb-1">Due: {{ book.dueDate }}</div>
                                        <div class="text-sm text-500">Return: {{ book.returnDate || 'Not returned' }}</div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Attendance Tab -->
                        <TabPanel header="Attendance Records" class="p-4">
                            <!-- Attendance Stats -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold" :class="`text-${attendanceStatus.color}`">{{ student.attendance.percentage }}%</div>
                                        <div class="text-lg font-semibold">{{ attendanceStatus.text }}</div>
                                        <div class="text-sm text-500">Attendance Rate</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-900">{{ student.attendance.present }}</div>
                                        <div class="text-lg font-semibold">Days Present</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-500">{{ student.attendance.absent }}</div>
                                        <div class="text-lg font-semibold">Days Absent</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-orange-500">{{ student.attendance.late }}</div>
                                        <div class="text-lg font-semibold">Days Late</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Attendance Calendar -->
                            <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl">
                                <div class="flex justify-content-between align-items-center mb-4">
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Attendance Calendar</h6>
                                    <div class="flex gap-2">
                                        <Button label="Previous Month" icon="pi pi-chevron-left" class="p-button-outlined p-button-sm" />
                                        <Button label="Current Month" class="p-button-primary p-button-sm" />
                                        <Button label="Next Month" icon="pi pi-chevron-right" class="p-button-outlined p-button-sm" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-7 gap-2 mb-4">
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Sun</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Mon</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Tue</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Wed</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Thu</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Fri</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Sat</div>
                                </div>

                                <div class="grid grid-cols-7 gap-2">
                                    <div v-for="day in student.attendance.calendar" :key="day.date"
                                         class="text-center p-3 border-round border-1 surface-border cursor-pointer hover:shadow-2 transition-all"
                                         :class="{
                                             'bg-green-100 border-green-300': day.status === 'present',
                                             'bg-red-100 border-red-300': day.status === 'absent',
                                             'bg-orange-100 border-orange-300': day.status === 'late',
                                             'bg-gray-100 border-gray-300': day.status === 'weekend' || day.status === 'holiday',
                                             'text-surface-500': day.status === 'weekend' || day.status === 'holiday'
                                         }">
                                        <div class="text-sm font-bold">{{ day.day }}</div>
                                        <div class="text-xs mt-1" v-if="day.status !== 'weekend' && day.status !== 'holiday'">
                                            <i :class="{
                                                'pi pi-check-circle text-green-600': day.status === 'present',
                                                'pi pi-times-circle text-red-600': day.status === 'absent',
                                                'pi pi-clock text-orange-600': day.status === 'late'
                                            }"></i>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-content-between align-items-center mt-4">
                                    <div class="flex gap-4">
                                        <div class="flex align-items-center gap-2">
                                            <div class="w-3 h-3 bg-green-100 border-1 border-green-300 border-round"></div>
                                            <span class="text-sm">Present</span>
                                        </div>
                                        <div class="flex align-items-center gap-2">
                                            <div class="w-3 h-3 bg-red-100 border-1 border-red-300 border-round"></div>
                                            <span class="text-sm">Absent</span>
                                        </div>
                                        <div class="flex align-items-center gap-2">
                                            <div class="w-3 h-3 bg-orange-100 border-1 border-orange-300 border-round"></div>
                                            <span class="text-sm">Late</span>
                                        </div>
                                        <div class="flex align-items-center gap-2">
                                            <div class="w-3 h-3 bg-gray-100 border-1 border-gray-300 border-round"></div>
                                            <span class="text-sm">Weekend/Holiday</span>
                                        </div>
                                    </div>
                                    <Button label="Export Attendance Report" icon="pi pi-download" class="p-button-outlined" />
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    </div>
</template>
