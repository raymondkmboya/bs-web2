<script setup>
import { computed } from 'vue';

const emit = defineEmits(['close', 'update:visible']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Object,
        default: null
    }
});

const formattedPaymentDate = computed(() => {
    if (!props.payment?.paymentDate) return '-';
    return new Date(props.payment.paymentDate).toLocaleDateString();
});

const formattedAmount = computed(() => {
    if (!props.payment?.amount) return 'TZS 0';
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(props.payment.amount);
});

const getPaymentMethodLabel = (method) => {
    const methodMap = {
        'cash': 'Cash',
        'bank_transfer': 'Bank Transfer',
        'mobile_money': 'Mobile Money',
        'cheque': 'Cheque'
    };
    return methodMap[method] || method;
};

function handleClose() {
    emit('close');
}

function handlePrint() {
    window.print();
}
</script>

<template>
    <Dialog
        :visible="visible"
        header="Payment Receipt"
        :modal="true"
        :style="{ width: '400px' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div v-if="payment" class="receipt-content">
            <div class="text-center mb-4">
                <h4 class="mb-2">Payment Receipt</h4>
                <p class="text-600">Receipt #: {{ payment.receiptNumber }}</p>
            </div>

            <div class="grid">
                <div class="col-12">
                    <div class="flex justify-content-between mb-2">
                        <span class="text-600">Student:</span>
                        <span class="font-semibold">{{ payment.studentName }}</span>
                    </div>
                    <div class="flex justify-content-between mb-2">
                        <span class="text-600">Fee Type:</span>
                        <span>{{ payment.feeGroupName }}</span>
                    </div>
                    <div class="flex justify-content-between mb-2">
                        <span class="text-600">Amount Paid:</span>
                        <span class="font-bold text-green-600">{{ formattedAmount }}</span>
                    </div>
                    <div class="flex justify-content-between mb-2">
                        <span class="text-600">Payment Method:</span>
                        <span>{{ getPaymentMethodLabel(payment.paymentMethod) }}</span>
                    </div>
                    <div class="flex justify-content-between mb-2">
                        <span class="text-600">Payment Date:</span>
                        <span>{{ formattedPaymentDate }}</span>
                    </div>
                    <div v-if="payment.notes" class="flex justify-content-between mb-2">
                        <span class="text-600">Notes:</span>
                        <span>{{ payment.notes }}</span>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <Button
                    label="Print Receipt"
                    icon="pi pi-print"
                    class="p-button-outlined"
                    @click="handlePrint()"
                />
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.receipt-content {
    padding: 1rem;
}

@media print {
    .receipt-content {
        padding: 2rem;
    }

    .p-dialog-header,
    .p-dialog-footer {
        display: none !important;
    }
}
</style>
