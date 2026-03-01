<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FrontOfficeService from '@/service/FrontOfficeService.js';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    enquiry: {
        type: Object,
        default: null
    },
    viewMode: {
        type: Boolean,
        default: false
    },
    followUpData: {
        type: Object,
        default: null
    },
    followUpType: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:visible', 'submit', 'cancel']);

const loading = ref(false);
const errors = ref({});
const formData = ref({
    school_enquiry_id: '',
    follow_up_date: new Date(),
    medium_used: '',
    message_content: '',
    next_follow_up_date: null,
    status: 'pending',
    notes: ''
});

const mediumOptions = [
    { label: 'Phone Call', value: 'phone' },
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'In Person', value: 'in_person' },
    { label: 'Social Media', value: 'social_media' }
];

const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Interested', value: 'interested' },
    { label: 'Not Interested', value: 'not_interested' },
    { label: 'Enrolled', value: 'enrolled' },
    { label: 'Stop Follow-up', value: 'stop_follow_up' }
];

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

function resetForm() {
    errors.value = {};
    formData.value = {
        school_enquiry_id: props.enquiry?.id || '',
        follow_up_date: new Date(),
        medium_used: '',
        message_content: '',
        next_follow_up_date: null,
        status: 'pending',
        notes: ''
    };
}

async function handleSubmit() {
    loading.value = true;
    errors.value = {};

    try {
        // Create a copy of form data to format dates
        const payload = { ...formData.value };

        // Format dates to YYYY-MM-DD to avoid timezone shifting
        if (payload.follow_up_date instanceof Date) {
            payload.follow_up_date = formatDateForServer(payload.follow_up_date);
        }

        if (payload.next_follow_up_date instanceof Date) {
            payload.next_follow_up_date = formatDateForServer(payload.next_follow_up_date);
        }

        console.log('Sending enquiry follow up payload:', JSON.stringify(payload, null, 2));
        const response = await FrontOfficeService.addEnquiryFollowUp(payload);
        emit('submit', response);
        emit('update:visible', false);
        resetForm();
    } catch (error) {
        console.error('Failed to create enquiry follow-up:', error);

        // Handle validation errors
        if (error.response?.status === 422 && error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else {
            // Handle other errors
            errors.value = {
                general: [error.response?.data?.message || 'Failed to create enquiry follow-up. Please try again.']
            };
        }
    } finally {
        loading.value = false;
    }
}

function handleCancel() {
    emit('cancel');
    emit('update:visible', false);
    resetForm();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Add this helper function at the bottom of your script
function formatDateForServer(date) {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatMedium(medium) {
    const options = {
        'phone': 'Phone Call',
        'email': 'Email',
        'sms': 'SMS',
        'whatsapp': 'WhatsApp',
        'in_person': 'In Person',
        'social_media': 'Social Media'
    };
    return options[medium] || medium || 'N/A';
}

function formatStatus(status) {
    const options = {
        'pending': 'Pending',
        'contacted': 'Contacted',
        'interested': 'Interested',
        'not_interested': 'Not Interested',
        'enrolled': 'Enrolled',
        'stop_follow_up': 'Stop Follow-up'
    };
    return options[status] || status || 'N/A';
}
</script>

<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal :header="viewMode ? 'Follow-up Details' : 'Student Follow-Up'" :style="{ width: '600px' }">
        <div class="space-y-4">
            <!-- View Mode - Show Details -->
            <div v-if="viewMode && followUpData">
                <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="font-semibold text-gray-600">Student:</span>
                            <p class="text-gray-900">{{ followUpData.student?.first_name }} {{ followUpData.student?.last_name }}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Follow-up Date:</span>
                            <p class="text-gray-900">{{ formatDate(followUpData.follow_up_date) }}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Contact Method:</span>
                            <p class="text-gray-900">{{ formatMedium(followUpData.medium_used) }}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Status:</span>
                            <p class="text-gray-900">{{ formatStatus(followUpData.status) }}</p>
                        </div>
                    </div>
                    <div v-if="followUpData.next_follow_up_date">
                        <span class="font-semibold text-gray-600">Next Follow-up:</span>
                        <p class="text-gray-900">{{ formatDate(followUpData.next_follow_up_date) }}</p>
                    </div>
                    <div v-if="followUpData.message_content">
                        <span class="font-semibold text-gray-600">Message:</span>
                        <p class="text-gray-900 bg-white p-3 rounded border">{{ followUpData.message_content }}</p>
                    </div>
                    <div v-if="followUpData.notes">
                        <span class="font-semibold text-gray-600">Notes:</span>
                        <p class="text-gray-900 bg-white p-3 rounded border">{{ followUpData.notes }}</p>
                    </div>
                </div>
            </div>
            <!-- General Error Messages -->
            <div v-if="errors.general && errors.general.length > 0" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div v-for="(error, index) in errors.general" :key="index" class="text-red-600 text-sm">
                    {{ error }}
                </div>
            </div>

            <!-- Follow-up Form (only show when not in view mode) -->
            <form v-if="!viewMode" @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Follow-up Date -->
                    <div>
                        <label for="follow_up_date" class="block text-900 font-semibold mb-2">Follow-up Date *</label>
                        <Calendar
                            id="follow_up_date"
                            v-model="formData.follow_up_date"
                            :showIcon="true"
                            dateFormat="yy-mm-dd"
                            class="w-full"
                            :class="{ 'p-invalid': errors.follow_up_date }"
                            required
                        />
                        <div v-if="errors.follow_up_date" class="text-red-600 text-sm mt-1">
                            {{ errors.follow_up_date[0] }}
                        </div>
                    </div>

                    <!-- Medium Used -->
                    <div>
                        <label for="medium_used" class="block text-900 font-semibold mb-2">Contact Method *</label>
                        <Dropdown
                            id="medium_used"
                            v-model="formData.medium_used"
                            :options="mediumOptions"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Select method"
                            class="w-full"
                            :class="{ 'p-invalid': errors.medium_used }"
                            required
                        />
                        <div v-if="errors.medium_used" class="text-red-600 text-sm mt-1">
                            {{ errors.medium_used[0] }}
                        </div>
                    </div>
                </div>

                <!-- Message Content -->
                <div>
                    <label for="message_content" class="block text-900 font-semibold mb-2">Message Content</label>
                    <Textarea
                        id="message_content"
                        v-model="formData.message_content"
                        rows="3"
                        placeholder="Enter the message sent to the student/parent..."
                        class="w-full"
                        :class="{ 'p-invalid': errors.message_content }"
                    />
                    <div v-if="errors.message_content" class="text-red-600 text-sm mt-1">
                        {{ errors.message_content[0] }}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Next Follow-up Date -->
                    <div>
                        <label for="next_follow_up_date" class="block text-900 font-semibold mb-2">Next Follow-up Date</label>
                        <Calendar
                            id="next_follow_up_date"
                            v-model="formData.next_follow_up_date"
                            :showIcon="true"
                            dateFormat="yy-mm-dd"
                            class="w-full"
                            :class="{ 'p-invalid': errors.next_follow_up_date }"
                        />
                        <div v-if="errors.next_follow_up_date" class="text-red-600 text-sm mt-1">
                            {{ errors.next_follow_up_date[0] }}
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <label for="status" class="block text-900 font-semibold mb-2">Status *</label>
                        <Dropdown
                            id="status"
                            v-model="formData.status"
                            :options="statusOptions"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="Select status"
                            class="w-full"
                            :class="{ 'p-invalid': errors.status }"
                            required
                        />
                        <div v-if="errors.status" class="text-red-600 text-sm mt-1">
                            {{ errors.status[0] }}
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div>
                    <label for="notes" class="block text-900 font-semibold mb-2">Additional Notes</label>
                    <Textarea
                        id="notes"
                        v-model="formData.notes"
                        rows="2"
                        placeholder="Any additional notes about this follow-up..."
                        class="w-full"
                        :class="{ 'p-invalid': errors.notes }"
                    />
                    <div v-if="errors.notes" class="text-red-600 text-sm mt-1">
                        {{ errors.notes[0] }}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-2 pt-4">
                    <Button
                        v-if="!viewMode"
                        label="Cancel"
                        severity="secondary"
                        @click="handleCancel"
                        type="button"
                    />
                    <Button
                        v-if="!viewMode"
                        label="Save Follow-up"
                        :loading="loading"
                        type="submit"
                    />
                    <Button
                        v-if="viewMode"
                        label="Close"
                        severity="secondary"
                        @click="handleCancel"
                        type="button"
                    />
                </div>
            </form>
        </div>
    </Dialog>
</template>
