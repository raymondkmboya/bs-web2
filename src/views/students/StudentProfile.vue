<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import StudentService from '@/service/StudentService.js';
import PaymentService from '@/service/PaymentService';
import StudentTransactionTable from '@/components/students/StudentTransactionTable.vue';
import StudentPaymentTable from '@/components/students/StudentPaymentTable.vue';
import StudentPaymentTransactionTable from '@/components/students/StudentPaymentTransactionTable.vue';
import AddTransactionDialog from '@/components/fees/AddTransactionDialog.vue';
import PaymentInvoiceForm from '@/components/fees/PaymentInvoiceForm.vue';
import AddPaymentDialog from '@/components/fees/AddPaymentDialog.vue';
import EditStudentForm from '@/components/students/EditStudentForm.vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
    transactions: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const route = useRoute();
const studentId = route.params.id;

// const student = ref(null);
// const studentData = ref(null);
const studentData = ref([]);
const parentData = ref([]);
const payments = ref([]);
const transactions = ref([]);
const loading = ref(false);
const activeTab = ref(0);

// Add Transaction Dialog State
const showAddTransactionDialog = ref(false);

// Rejection Dialog State
const showRejectionDialog = ref(false);
const rejectingTransaction = ref(null);
const rejectionReason = ref('');

// Add Payment Invoice Dialog State
const showAddPaymentDialog = ref(false);
const addPaymentDialogRef = ref(null);

// Edit Student State
const isEditingStudent = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    student_name: { value: null, matchMode: 'contains' },
    invoice_number: { value: null, matchMode: 'contains' },
    fee_group_name: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' }
});

const globalFilterFields = ['student_name', 'invoice_number', 'fee_group_name', 'status', 'totalAmount', 'totalPaid', 'balance'];

// Edit Student Functions
const startEditingStudent = () => {
    isEditingStudent.value = true;
};

const cancelEditingStudent = () => {
    isEditingStudent.value = false;
};

const handleStudentUpdate = async (formData) => {
    // Refresh student data after update
    await loadStudent();
    isEditingStudent.value = false;
};

function clearFilter() {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        student_name: { value: null, matchMode: 'contains' },
        invoice_number: { value: null, matchMode: 'contains' },
        fee_group_name: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' }
    };
}

const selectedPayment = ref(null);

onMounted(async () => {
    loading.value = true;
    loadStudentPayments()
    loadStudentInfo()
    loadStudentTransactions()

});

async function loadStudentPayments() {
    try {
        const response = await PaymentService.getStudentPayment(studentId);
        console.log(response)
        payments.value = response.map(payment => {
            // 1. Calculate Total Paid (Sum of transactions)
            const totalPaid = payment.transactions.reduce((sum, txn) => {
                // Integrity Check: Only count verified or completed money
                return sum + parseFloat(txn.amount_paid || 0);
            }, 0);

            // 2. Get the expected amount from fee structure
            const totalDue = parseFloat(payment.fee_structure?.amount || 0);
            const balance = totalDue - totalPaid;

            // 3. Determine Status
            let statusLabel = 'Pending';
            let statusClass = 'status-pending';

            if (balance <= 0) {
                statusLabel = 'Fully Paid';
                statusClass = 'status-paid';
            } else if (totalPaid > 0) {
                statusLabel = 'Partial';
                statusClass = 'status-partial';
            }

            return {
                ...payment,
                totalPaid,
                balance,
                statusLabel,
                statusClass
            };
        });
        // console.log('Payments', payments.value)
    } catch (error) {
        console.error('Failed to load payments:', error);
    } finally {
        loading.value = false;
    }
}

async function loadStudentInfo() {
    try {
        // Load actual student data from backend
        const response = await StudentService.getStudent(studentId);
        studentData.value = response;
        // student.value = mockStudent;
        console.log('Student data loaded:', response);
    } catch (error) {
        console.error('Failed to load student profile:', error);
        // Fallback to mock data if backend fails
        // student.value = mockStudent;
    } finally {
        loading.value = false;
    }
}

async function loadParentData() {
    try {
        // Load actual student data from backend
        parentData.value = await StudentService.getStudent(studentId);
        console.log('Parent data loaded:', parentData.value);
    } catch (error) {
        console.error('Failed to load parent data:', error);
        // Fallback to mock data if backend fails
        // student.value = mockStudent;
    } finally {
        loading.value = false;
    }
}

async function loadStudentTransactions() {
    try {
        transactions.value = await PaymentService.getStudentTransaction(studentId);
        console.log('Set transactions:', transactions.value);
    } catch (error) {
        console.error('Failed to load transactions:', error);
    } finally {
        loading.value = false;
    }
}

const age = computed(() => {
    if (!studentData.value?.date_of_birth) return '';
    const birthYear = new Date(studentData.value.date_of_birth).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
});

const processedPayments = computed(() => {
        return payments.value.map(payment => {
            // 1. Calculate Total Paid (Sum of transactions)
            const totalPaid = payment.transactions.reduce((sum, txn) => {
                // Integrity Check: Only count verified or completed money
                return sum + parseFloat(txn.amount_paid || 0);
            }, 0);

            // 2. Get the expected amount from fee structure
            const totalDue = parseFloat(payment.fee_structure?.amount || 0);
            const balance = totalDue - totalPaid;

            // 3. Determine Status
            let statusLabel = 'Pending';
            let statusClass = 'status-pending';

            if (balance <= 0) {
                statusLabel = 'Fully Paid';
                statusClass = 'status-paid';
            } else if (totalPaid > 0) {
                statusLabel = 'Partial';
                statusClass = 'status-partial';
            }

            return {
                ...payment,
                totalPaid,
                balance,
                statusLabel,
                statusClass
            };
        });
});

const feeStatus = computed(() => {
    if (!studentData.value?.fees?.total || !studentData.value?.fees?.paid) return 'N/A';
    const percentage = (studentData.value.fees.paid / studentData.value.fees.total) * 100;
    if (percentage === 100) return 'Paid';
    if (percentage >= 75) return 'Mostly Paid';
    if (percentage >= 50) return 'Partially Paid';
    return 'Outstanding';
});

const attendanceStatus = computed(() => {
    if (!studentData.value?.attendance_records || !studentData.value?.attendance_records.length) return { text: 'N/A', color: 'secondary' };
    // For now, we'll calculate basic attendance from records
    const totalRecords = studentData.value.attendance_records.length;
    const presentRecords = studentData.value.attendance_records.filter(record => record.status === 'present').length;
    const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

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

// Handle Add Payment Inovice
function handleAddPayment() {
    studentData.value = studentData.value;
    showAddPaymentDialog.value = true;
}

// Handle Add Transaction
function handleAddTransaction(paymentData) {
    selectedPayment.value = paymentData;
    showAddTransactionDialog.value = true;
}

// Handle View Receipt
function handleViewReceipt(transactionData) {
    console.log('Viewing receipt for transaction:', transactionData);
    // Open receipt dialog or generate statement
    // You can implement the receipt viewing logic here
    // For now, we'll just log it
}

// Handle View Bank Receipt
function viewBankReceipt(transaction) {
    // Open bank receipt file in new window
    if (transaction.transaction_reciept) {
        const receiptUrl = `http://localhost:8080/storage/${transaction.transaction_reciept}`;
        window.open(receiptUrl, '_blank');
    }
}

// Handle Print System Receipt
function printSystemReceipt(transaction) {
    // Generate and print system receipt from backend
    PaymentService.generateReceipt(transaction.id)
        .then(response => {
            const receiptContent = response.receipt_html; // PaymentService already returns response.data.data
            const printWindow = window.open('', '_blank');
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.print();
        })
        .catch(error => {
            console.error('Failed to generate receipt:', error);
        });
}

// Handle Approve Transaction
function handleApproveTransaction(transactionData) {
    console.log('Approving transaction:', transactionData);
    PaymentService.approveTransaction(transactionData.id)
        .then(response => {
            console.log('Transaction approved:', response);
            // Refresh payments data to show updated status
            loadStudentPayments();
        })
        .catch(error => {
            console.error('Failed to approve transaction:', error);
        });
}

// Handle Reject Transaction
function handleRejectTransaction(transactionData) {
    rejectingTransaction.value = transactionData;
    rejectionReason.value = '';
    showRejectionDialog.value = true;
}

// Confirm Rejection
function confirmRejection() {
    if (!rejectionReason.value.trim()) {
        // You can add toast notification here
        return;
    }

    PaymentService.rejectTransaction(rejectingTransaction.value.id, rejectionReason.value)
        .then(response => {
            console.log('Transaction rejected:', response);
            showRejectionDialog.value = false;
            rejectingTransaction.value = null;
            rejectionReason.value = '';
            // Refresh payments data to show updated status
            loadStudentPayments();
        })
        .catch(error => {
            console.error('Failed to reject transaction:', error);
        });
}

// Cancel Rejection
function cancelRejection() {
    showRejectionDialog.value = false;
    rejectingTransaction.value = null;
    rejectionReason.value = '';
}

// Handle Transaction Submit
function handleTransactionSubmit(transactionData) {
    console.log('Adding transaction:', transactionData);
    loading.value = true;

    PaymentService.addTransaction(transactionData)
        .then(response => {
            console.log('Transaction added successfully:', response);
            // Refresh payments data
            loadStudentPayments();
            loadStudentTransactions();
            // Show success message
            // You can add toast notification here if you have toast service
            showAddTransactionDialog.value = false;
            selectedPayment.value = null;
        })
        .catch(error => {
            console.error('Error adding transaction:', error);
            // Show error message
            // You can add error toast here if you have toast service
        })
        .finally(() => {
            loading.value = false;
        });
}

// Handle Payment Submit (for new payment invoices)
function handlePaymentSubmit(paymentData) {
    console.log('Adding payment invoice/transaction:', paymentData);
    loading.value = true;

    PaymentService.addTransaction(paymentData)
        .then(response => {
            console.log('Payment/transaction added successfully:', response);
            // Refresh payments data
            loadStudentPayments();
            loadStudentTransactions();
            // Show success message
            // You can add toast notification here if you have toast service
            showAddPaymentDialog.value = false;
            // Notify dialog of success
            if (addPaymentDialogRef.value) {
                addPaymentDialogRef.value.handleSuccess(response);
            }
        })
        .catch(error => {
            console.error('Error adding payment/transaction:', error);
            // Notify dialog of error
            if (addPaymentDialogRef.value) {
                addPaymentDialogRef.value.handleError(error);
            }
        })
        .finally(() => {
            loading.value = false;
        });
}

</script>


<template>
    <div>
        <div class="flex align-items-center mb-4">
            <Button icon="pi pi-arrow-left" label="Back to Admissions" class="p-button-text" @click="$router.go(-1)" />
            <!-- <h5 class="m-0">Student Profile</h5> -->
        </div>

        <div v-if="!studentData" class="flex justify-content-center">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>

        <div v-else>
            <!-- Show Edit Form when editing -->
            <div v-if="isEditingStudent">
                <div class="flex align-items-center mb-4">
                    <Button icon="pi pi-arrow-left" label="Back to Profile" class="p-button-text" @click="cancelEditingStudent" />
                </div>
                <EditStudentForm
                    :studentData="studentData"
                    @save="handleStudentUpdate"
                    @close="cancelEditingStudent"
                />
            </div>

            <!-- Show Profile when not editing -->
            <div v-else>
                <!-- Student Basic Info Card (Full Width) -->
                <div class="col-12 mb-6">
                    <div class="card p-fluid">
                        <div class="flex flex-column md:flex-row align-items-start md:align-items-start text-center md:text-left mb-4">
                            <div class="flex flex-column align-items-center text-center md:mr-6">
                                <OverlayBadge :value="studentData.status" severity="success">
                                    <img :src="studentData.profile_image || '/demo/images/logo.svg'" alt="Student" style="border-radius: 20px;" class="w-10rem h-10rem shadow-2 border-circle mb-3" />
                                    <span class="text-900 font-bold text-sm block mb-1">{{ `${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}` }}</span>
                                    <!-- <span class="text-900 font-bold text-lgd">{{ student.student_number }}</span> -->
                                </OverlayBadge>
                            </div>
                            <div class="flex flex-column flex-1">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-id-card text-2xl text-primary mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Student Number</span>
                                        <span class="text-900 font-bold text-lg">{{ studentData.student_number }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-user text-2xl text-primary mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Gender</span>
                                        <span class="text-900 font-bold text-lg">{{ studentData.gender }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-calendar text-2xl text-primary mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Age</span>
                                        <span class="text-900 font-bold text-lg">{{ age }} years</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-book text-2xl text-primary mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Class</span>
                                        <span class="text-900 font-bold text-lg">{{ studentData.class_level?.class_level_name || 'N/A' }} - {{ studentData.class_level_stream?.class_level_stream_name || 'N/A' }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-home text-2xl text-primary mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">House</span>
                                        <span class="text-900 font-bold text-lg">{{ studentData.house|| 'N/A' }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-money-bill text-2xl text-green-500 mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Total Fees</span>
                                        <span class="text-900 font-bold text-lg">TZS {{ studentData.fees?.total?.toLocaleString() || 'N/A' }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-check-circle text-2xl text-green-500 mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Fees Paid</span>
                                        <span class="text-900 font-bold text-lg">TZS {{ studentData.fees?.paid?.toLocaleString() || 'N/A' }}</span>
                                    </div>
                                    <div class="text-center p-4 border-1 surface-border border-round">
                                        <i class="pi pi-exclamation-triangle text-2xl text-orange-500 mb-2"></i>
                                        <span class="text-500 font-medium text-sm block mb-1">Balance</span>
                                        <span class="text-900 font-bold text-lg">TZS {{ studentData.fees?.balance?.toLocaleString() || 'N/A' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ml-auto">
                                <Button label="Edit Profile" icon="pi pi-user" class="p-button-outlined p-button-sm" @click="startEditingStudent" />
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

                                    <div v-for="parent in parentData" :key="parent.name" class="col-12">
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
                                            {{ studentData.address?.street || 'N/A' }}<br>
                                            {{ studentData.address?.city || 'N/A' }}, {{ studentData.address?.region || 'N/A' }}
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
                                                <span class="text-red-600 font-bold text-xl">{{ studentData.medical?.bloodGroup || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Allergies</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-exclamation-triangle text-orange-500"></i>
                                                <span class="text-900 font-bold">{{ studentData.medical?.allergies || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Medical Conditions</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-notes text-blue-500"></i>
                                                <span class="text-900 font-bold">{{ studentData.medical?.conditions || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Emergency Contact</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-phone text-green-500"></i>
                                                <span class="text-900 font-bold">{{ studentData.medical?.emergencyContact || 'N/A' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel header="Academic Information" class="p-4">
                            <div class="bg-surface-50 dark:bg-surface-950 mb-6">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Admission Details</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Enrollment and registration history</div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div class="p-3 border-1 surface-border border-round">
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Admission Number</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-id-card text-primary"></i>
                                                <span class="text-900 font-bold">{{ studentData.admission_number || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div class="p-3 border-1 surface-border border-round">
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Admission Date</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-calendar text-primary"></i>
                                                <span class="text-900 font-bold">{{ studentData.admission_date || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div class="p-3 border-1 surface-border border-round">
                                            <label class="text-500 font-bold text-xs uppercase block mb-1">Previous School</label>
                                            <div class="flex align-items-center gap-2">
                                                <i class="pi pi-building text-primary"></i>
                                                <span class="text-900 font-bold">{{ studentData.academic?.previousSchool || 'N/A' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-surface-50 dark:bg-surface-950 mb-6">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Class & Stream</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Current academic placement and year</div>
                                        </div>
                                    </div>

                                    <div class="flex flex-column md:flex-row gap-4">
                                        <div class="flex-1 p-4 bg-primary-50 border-round border-left-3 border-primary">
                                            <div class="text-primary font-bold text-xs uppercase mb-1">Current Grade</div>
                                            <div class="text-2xl font-bold text-primary-900">{{ studentData.currentClass }} - {{ studentData.stream }}</div>
                                        </div>
                                        <div class="flex-1 p-4 bg-blue-50 border-round border-left-3 border-blue-500">
                                            <div class="text-blue-500 font-bold text-xs uppercase mb-1">Academic Year</div>
                                            <div class="text-2xl font-bold text-blue-900">{{ studentData.academic?.year || '2026' }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-surface-50 dark:bg-surface-950">
                                <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-2xl flex flex-col gap-4">
                                    <div class="flex gap-4">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">Performance Overview</div>
                                            <div class="text-base leading-tight text-surface-500 dark:text-surface-300">Term-wise GPA and individual subject scores</div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                        <div v-for="(term, index) in ['Term 1', 'Term 2', 'Term 3']" :key="index" 
                                            class="flex justify-content-between align-items-center p-3 border-1 surface-border border-round bg-white">
                                            <span class="font-bold text-700">{{ term }}</span>
                                            <div class="text-right">
                                                <div class="text-xl font-bold text-primary">GPA: {{ studentData.academic?.performance?.[`term${index + 1}`]?.gpa || '0.0' }}</div>
                                                <div class="text-xs text-500">Rank: {{ studentData.academic?.performance?.[`term${index + 1}`]?.rank || '-' }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-column gap-2">
                                        <div v-for="exam in studentData.academic?.exams || []" :key="exam.subject" 
                                            class="flex align-items-center justify-content-between p-3 surface-50 border-round border-1 surface-border hover:surface-100 transition-colors">
                                            <div class="flex align-items-center gap-3">
                                                <i class="pi pi-file-edit text-xl text-primary"></i>
                                                <div>
                                                    <div class="text-900 font-bold">{{ exam.subject }}</div>
                                                    <div class="text-xs text-500">{{ exam.date }} | {{ exam.remarks }}</div>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xl font-bold" :class="exam.grade >= 70 ? 'text-green-600' : 'text-orange-500'">{{ exam.grade }}%</span>
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
                                <div class="flex justify-between items-center mb-4">
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Payments</h6>
                                    <div class="flex gap-2">
                                        <Button label="Add Payment Invoice" @click="handleAddPayment" icon="pi pi-plus" class="p-button-primary" size="small" />
                                        <!-- <Button label="Print Receipt" icon="pi pi-print" class="p-button-outlined" size="small" /> -->
                                    </div>
                                </div>

                                <!-- Combined Payment & Transaction Table -->
                                <div v-if="loading" class="flex justify-content-center p-4">
                                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                </div>
                                <StudentPaymentTransactionTable
                                    v-else
                                    :payments="payments"
                                    :transactions="transactions"
                                    :loading="loading"
                                    :filters="filters"
                                    :global-filter-fields="globalFilterFields"
                                    @add-transaction="handleAddTransaction"
                                    @view-bank-receipt="viewBankReceipt"
                                    @print-system-receipt="printSystemReceipt"
                                    @approve-transaction="handleApproveTransaction"
                                    @reject-transaction="handleRejectTransaction"
                                    @clear-filter="clearFilter"
                                />

                                <!-- Payment Invoice Dialog -->
                                <AddPaymentDialog
                                    :studentData="studentData"
                                    :visible="showAddPaymentDialog"
                                    @update:visible="showAddPaymentDialog = $event"
                                    @submit="handlePaymentSubmit"
                                    ref="addPaymentDialogRef"
                                />

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

                                <DataTable :value="studentData.timetable" :paginator="false" class="p-datatable-sm">
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
                                <div v-for="book in studentData.library?.booksIssued || []" :key="book.id" class="col-span-full">
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
                                        <div class="text-4xl font-bold" :class="`text-${attendanceStatus.color}`">{{ studentData.attendance?.percentage || 0 }}%</div>
                                        <div class="text-lg font-semibold">{{ attendanceStatus.text }}</div>
                                        <div class="text-sm text-500">Attendance Rate</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-900">{{ studentData.attendance?.present || 0 }}</div>
                                        <div class="text-lg font-semibold">Days Present</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-500">{{ studentData.attendance?.absent || 0 }}</div>
                                        <div class="text-lg font-semibold">Days Absent</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-center p-4 border-round bg-white shadow-1">
                                        <div class="text-4xl font-bold text-orange-500">{{ studentData.attendance?.late || 0 }}</div>
                                        <div class="text-lg font-semibold">Days Late</div>
                                        <div class="text-sm text-500">This Term</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Attendance Calendar -->
                            <div class="bg-surface-50 dark:bg-surface-950 p-6 rounded-2xl">
                                <div class="flex items-center gap-3 mb-4">
                                    <i class="pi pi-calendar text-2xl text-primary"></i>
                                    <h6 class="m-0 text-xl font-semibold text-surface-900 dark:text-surface-0">Attendance Calendar</h6>
                                </div>

                                <div class="grid grid-cols-7 gap-2">
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Sun</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Mon</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Tue</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Wed</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Thu</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Fri</div>
                                    <div class="text-center font-bold text-sm p-2 bg-surface-100 border-round">Sat</div>
                                </div>

                                <div class="grid grid-cols-7 gap-2">
                                    <div v-for="day in studentData.attendance?.calendar" :key="day.date"
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
    </div>

    <!-- Add Transaction Dialog -->
    <AddTransactionDialog
        v-model:visible="showAddTransactionDialog"
        :payment="selectedPayment"
        @submit="handleTransactionSubmit"
    />

    <!-- Rejection Dialog -->
    <Dialog
        v-model:visible="showRejectionDialog"
        :style="{ width: '450px' }"
        header="Reject Transaction"
        :modal="true"
        :dismissableMask="true"
    >
        <div class="p-4">
            <div class="mb-4">
                <label for="rejectionReason" class="block text-900 font-medium mb-2">
                    Rejection Reason
                </label>
                <Textarea
                    id="rejectionReason"
                    v-model="rejectionReason"
                    rows="4"
                    cols="30"
                    class="w-full"
                    placeholder="Please provide a reason for rejecting this transaction..."
                    :class="{ 'p-invalid': !rejectionReason.trim() }"
                />
                <small v-if="!rejectionReason.trim()" class="p-error">
                    Rejection reason is required.
                </small>
            </div>

            <div class="flex justify-end gap-2">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="cancelRejection"
                />
                <Button
                    label="Reject Transaction"
                    icon="pi pi-check"
                    class="p-button-danger"
                    @click="confirmRejection"
                    :disabled="!rejectionReason.trim()"
                />
            </div>
        </div>
    </Dialog>
</template>
