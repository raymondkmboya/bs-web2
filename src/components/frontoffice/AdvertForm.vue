<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:visible', 'submit', 'close']);

const formData = ref({
    cost: '',
    medium: 'Phone Call',
    advert_date: new Date(),
    description: '',
    notes: ''
});

const mediumOptions = [
    { label: 'Phone Call', value: 'Phone Call' },
    { label: 'Road Posters', value: 'Road Posters' },
    { label: 'Car Posters', value: 'Car Posters' },
    { label: 'Radio', value: 'Radio' },
    { label: 'TV', value: 'TV' },
    { label: 'Email', value: 'Email' },
    { label: 'SMS', value: 'SMS' },
    { label: 'Social Media', value: 'Social Media' },
    { label: 'Website', value: 'Website' },
    { label: 'Newspaper', value: 'Newspaper' },
    { label: 'Walk In', value: 'Walk In' },
    { label: 'Referral', value: 'Referral' }
];

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Completed', value: 'completed' }
];

// Validation
const isFormValid = computed(() => {
    return formData.value.cost &&
           formData.value.cost > 0 &&
           formData.value.medium &&
           formData.value.advert_date;
});

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        cost: '',
        medium: 'Phone Call',
        advert_date: new Date(),
        description: '',
        notes: ''
    };
}

function closeDialog() {
    emit('update:visible', false);
}

function submitForm() {
    if (!isFormValid.value) {
        return; // Don't submit if form is invalid
    }

    // Format data for submission
    const submissionData = {
        ...formData.value,
        cost: parseFloat(formData.value.cost),
        advert_date: formData.value.advert_date.toISOString().split('T')[0]
    };

    emit('submit', submissionData);
    // Don't reset form or close dialog here - let parent handle success
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '500px' }"
        :modal="true"
        :dismissableMask="true"
        header="Add Advertisement"
        @update:visible="closeDialog"
    >
        <!-- Error Message -->
        <Message v-if="props.error" severity="error" :closable="false" class="mb-3">
            {{ props.error }}
        </Message>

        <form @submit.prevent="submitForm" class="p-fluid">
            <div class="grid grid-cols-1 gap-4">
                <!-- Medium -->
                <div>
                    <label for="medium" class="block text-900 font-semibold mb-2">Medium *</label>
                    <Dropdown
                        id="medium"
                        v-model="formData.medium"
                        :options="mediumOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select medium"
                        class="w-full"
                        :class="{ 'p-invalid': !formData.medium }"
                        required
                    />
                    <small class="p-error" v-if="!formData.medium">Medium is required.</small>
                </div>

                <!-- Cost -->
                <div>
                    <label for="cost" class="block text-900 font-semibold mb-2">Cost (TZS) *</label>
                    <InputNumber
                        id="cost"
                        v-model="formData.cost"
                        mode="decimal"
                        :min="0"
                        :maxFractionDigits="2"
                        placeholder="Enter cost"
                        class="w-full"
                        :class="{ 'p-invalid': !formData.cost || formData.cost <= 0 }"
                        required
                    />
                    <small class="p-error" v-if="!formData.cost || formData.cost <= 0">Valid cost is required.</small>
                </div>

                <!-- Advert Date -->
                <div>
                    <label for="advert_date" class="block text-900 font-semibold mb-2">Advert Date *</label>
                    <Calendar
                        id="advert_date"
                        v-model="formData.advert_date"
                        :showIcon="true"
                        :showButtonBar="true"
                        dateFormat="yy-mm-dd"
                        placeholder="Select advert date"
                        class="w-full"
                        :class="{ 'p-invalid': !formData.advert_date }"
                        required
                    />
                    <small class="p-error" v-if="!formData.advert_date">Advert date is required.</small>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-900 font-semibold mb-2">Description</label>
                    <Textarea
                        id="description"
                        v-model="formData.description"
                        rows="3"
                        placeholder="Enter advert description"
                        class="w-full"
                        maxlength="1000"
                    />
                </div>

                <!-- Notes -->
                <div>
                    <label for="notes" class="block text-900 font-semibold mb-2">Notes</label>
                    <Textarea
                        id="notes"
                        v-model="formData.notes"
                        rows="2"
                        placeholder="Enter additional notes"
                        class="w-full"
                        maxlength="500"
                    />
                </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    @click="closeDialog"
                    class="p-button-text"
                />
                <Button
                    label="Submit"
                    icon="pi pi-check"
                    type="submit"
                    :disabled="!isFormValid"
                    autofocus
                />
            </div>
        </form>
    </Dialog>
</template>
