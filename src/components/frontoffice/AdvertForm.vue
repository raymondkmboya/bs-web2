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
    cost: '',
    medium: 'phone_call',
    advertDate: new Date(),
    user: ''
});

const mediumOptions = [
    { label: 'Phone Call', value: 'phone_call' },
    { label: 'Road Posters', value: 'road_posters' },
    { label: 'Car Posters', value: 'car_posters' },
    { label: 'Radio', value: 'radio' },
    { label: 'TV', value: 'tv' },
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Website', value: 'website' },
    { label: 'Newspaper', value: 'newspaper' }
];

const userOptions = [
    { label: 'Alice Johnson', value: 'alice_johnson' },
    { label: 'Bob Smith', value: 'bob_smith' },
    { label: 'Carol Davis', value: 'carol_davis' },
    { label: 'David Wilson', value: 'david_wilson' },
    { label: 'Eve Brown', value: 'eve_brown' },
    { label: 'Frank Miller', value: 'frank_miller' },
    { label: 'Grace Taylor', value: 'grace_taylor' },
    { label: 'Henry Anderson', value: 'henry_anderson' }
];

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        cost: '',
        medium: 'phone_call',
        advertDate: new Date(),
        user: ''
    };
}

function closeDialog() {
    emit('update:visible', false);
}

function submitForm() {
    emit('submit', { ...formData.value });
    resetForm();
    closeDialog();
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
                        required
                    />
                </div>
                <!-- Cost -->
                <div>
                    <label for="cost" class="block text-900 font-semibold mb-2">Cost (TZS) *</label>
                    <InputText
                        id="cost"
                        v-model="formData.cost"
                        placeholder="Enter cost"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Date -->
                <div>
                    <label for="advertDate" class="block text-900 font-semibold mb-2">Date *</label>
                    <Calendar
                        id="advertDate"
                        v-model="formData.advertDate"
                        placeholder="Select date"
                        class="w-full"
                        required
                    />
                </div>

                <!-- User -->
                <div>
                    <label for="user" class="block text-900 font-semibold mb-2">User *</label>
                    <Dropdown
                        id="user"
                        v-model="formData.user"
                        :options="userOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select user"
                        class="w-full"
                        required
                    />
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-content-end gap-2 mt-6">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-outlined"
                    @click="closeDialog"
                />
                <Button
                    label="Save Advertisement"
                    icon="pi pi-save"
                    type="submit"
                    class="p-button-primary"
                />
            </div>
        </form>
    </Dialog>
</template>
