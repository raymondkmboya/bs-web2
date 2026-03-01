<script setup>
import { ref } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
    type: 'Incoming',
    recipient: '',
    address: '',
    item: '',
    trackingNumber: ''
});

function savePostal() {
    emit('save', { ...formData.value });
    resetForm();
    emit('update:visible', false);
}

function cancelPostal() {
    emit('update:visible', false);
}

function resetForm() {
    formData.value = {
        type: 'Incoming',
        recipient: '',
        address: '',
        item: '',
        trackingNumber: ''
    };
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '450px' }"
        :modal="true"
        header="Add Postal Item"
        @update:visible="cancelPostal"
    >
        <form @submit.prevent="savePostal" class="p-fluid">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field">
                    <label for="type">Type</label>
                    <Dropdown
                        id="type"
                        v-model="formData.type"
                        :options="[
                            { label: 'Incoming', value: 'Incoming' },
                            { label: 'Outgoing', value: 'Outgoing' }
                        ]"
                        placeholder="Select type"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="recipient">Recipient/Sender</label>
                    <InputText
                        id="recipient"
                        v-model="formData.recipient"
                        placeholder="Enter recipient or sender"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="address">Address</label>
                    <InputText
                        id="address"
                        v-model="formData.address"
                        placeholder="Enter address"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="item">Item</label>
                    <InputText
                        id="item"
                        v-model="formData.item"
                        placeholder="Enter item description"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="trackingNumber">Tracking Number</label>
                    <InputText
                        id="trackingNumber"
                        v-model="formData.trackingNumber"
                        placeholder="Enter tracking number"
                        class="w-full"
                    />
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Save"
                    icon="pi pi-check"
                    type="submit"
                    class="w-full md:w-auto"
                />
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text md:w-auto"
                    @click="cancelPostal"
                />
            </div>
        </form>
    </Dialog>
</template>
