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
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'new',
    message: '',
    enquiryDate: new Date(),
    followUpDate: null,
    assignedTo: '',
    notes: ''
});

const sourceOptions = [
    { label: 'Phone Call', value: 'phone_call' },
    { label: 'Walk In', value: 'walk_in' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Email', value: 'email' },
    { label: 'Website', value: 'website' },
    { label: 'Referral', value: 'referral' },
    { label: 'Other', value: 'other' }
];

const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Followed Up', value: 'followed_up' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' }
];

const assignedToOptions = [
    { label: 'Unassigned', value: '' },
    { label: 'John Smith', value: 'john_smith' },
    { label: 'Mary Johnson', value: 'mary_johnson' },
    { label: 'David Wilson', value: 'david_wilson' },
    { label: 'Sarah Brown', value: 'sarah_brown' }
];

// Watch for visibility changes to reset form
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        name: '',
        email: '',
        phone: '',
        source: '',
        status: 'new',
        message: '',
        enquiryDate: new Date(),
        followUpDate: null,
        assignedTo: '',
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
                        <label for="name">Full Name</label>
                        <InputText id="name" v-model="formData.name" required class="w-full" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="phone">Phone Number</label>
                        <InputText id="phone" v-model="formData.phone" required class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">Email Address</label>
                        <InputText id="email" v-model="formData.email" type="email" class="w-full" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="source">Enquiry Source</label>
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
                        <label for="enquiryDate">Enquiry Date</label>
                        <Calendar id="enquiryDate" v-model="formData.enquiryDate" dateFormat="dd/mm/yy" class="w-full" />
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
                        <label for="assignedTo">Assigned To</label>
                        <Dropdown 
                            id="assignedTo" 
                            v-model="formData.assignedTo" 
                            :options="assignedToOptions" 
                            optionValue="value" 
                            optionLabel="label" 
                            placeholder="Assign To" 
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
