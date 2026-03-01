<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'submit', 'close']);

const formData = ref({
    full_name: '',
    email: '',
    phone: '',
    source: '',
    status: 'new',
    message: '',
    level_interested: '',
    enquiryDate: new Date(),
    followUpDate: null,
    notes: ''
});

const sourceOptions = [
    { label: 'Phone Call', value: 'Phone' },
    { label: 'Walk In', value: 'Walk in' },
    { label: 'WhatsApp', value: 'Whatsapp' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Email', value: 'Email' },
    { label: 'Website', value: 'Website' },
    { label: 'Referral', value: 'Referral' },
    { label: 'Other', value: 'Other' }
];

const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Followed Up', value: 'followed_up' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' }
];

const interestLevelOptions = [
    { label: 'QT', value: 'QT' },
    { label: 'CSEE', value: 'CSEE' },
    { label: 'ACSEE', value: 'ACSEE' },
    { label: 'English Course', value: 'English Course' },
    { label: 'Computer Course', value: 'Computer Course' }
];

// Watch for visibility changes to reset form
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        full_name: '',
        email: '',
        phone: '',
        source: '',
        status: 'new',
        message: '',
        level_interested: '',
        enquiryDate: new Date(),
        followUpDate: null,
        notes: ''
    };
}

function submitForm() {
    // Format dates for submission
    const submissionData = {
        ...formData.value,
        enquiryDate: formData.value.enquiryDate ? formData.value.enquiryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        followUpDate: formData.value.followUpDate ? formData.value.followUpDate.toISOString().split('T')[0] : null
    };

    emit('submit', submissionData);
    resetForm();
    emit('close'); // Hide form after submission
}

function cancelForm() {
    resetForm();
    emit('close'); // Hide form when cancelled
}
</script>

<template>
    <div v-if="visible" class="card">
        <div class="font-semibold text-xl mb-4">Add New Enquiry</div>
        <form @submit.prevent="submitForm">
            <div class="flex flex-col gap-4">
                <!-- Enquirer Information -->
                <div class="font-semibold text-lg">Enquirer Information</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="full_name">Full Name *</label>
                        <InputText id="full_name" v-model="formData.full_name" required class="w-full" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="phone">Phone Number *</label>
                        <InputText id="phone" maxlength="10" v-model="formData.phone" required class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">Email Address</label>
                        <InputText id="email" v-model="formData.email" type="email" class="w-full" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="source">Enquiry Source *</label>
                        <Dropdown
                            id="source"
                            v-model="formData.source"
                            :options="sourceOptions"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Select Source"
                            required
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Enquiry Details -->
                <div class="font-semibold text-lg mt-4">Enquiry Details</div>

                <div class="flex flex-wrap">
                    <label for="message">Message/Query</label>
                    <Textarea id="message" v-model="formData.message" rows="3" class="w-full" required />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="enquiryDate">Enquiry Date *</label>
                        <Calendar id="enquiryDate" required v-model="formData.enquiryDate" dateFormat="dd/mm/yy" class="w-full" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="followUpDate">Follow Up Date</label>
                        <Calendar id="followUpDate" v-model="formData.followUpDate" dateFormat="dd/mm/yy" class="w-full" />
                    </div>
                </div>

                <!-- Assignment & Status -->
                <div class="font-semibold text-lg mt-4">Assignment & Status</div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <Dropdown
                            id="status"
                            v-model="formData.status"
                            :options="statusOptions"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Select Status"
                            class="w-full"
                        />
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="level_interested">Interested</label>
                        <Dropdown
                            id="level_interested"
                            v-model="formData.level_interested"
                            :options="interestLevelOptions"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Interested In"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="notes">Additional Notes</label>
                    <Textarea id="notes" v-model="formData.notes" rows="2" class="w-full" />
                </div>

                <div class="flex justify-content-end gap-2 mt-4">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        @click="cancelForm"
                        class="p-button-text"
                    />
                    <Button
                        label="Submit Enquiry"
                        icon="pi pi-check"
                        type="submit"
                        autofocus
                    />
                </div>
            </div>
        </form>
    </div>
</template>
