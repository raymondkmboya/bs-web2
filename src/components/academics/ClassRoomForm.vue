<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});
// 0773259579 mtn kaaya nurman
const emit = defineEmits(['update:visible', 'submit', 'close']);

const formData = ref({
    name: '',
    room_number: '',
    capacity: '',
    building: '',
    floor: '',
    classroom_type: 'classroom',
    status: 'available'
});

const loading = ref(false);
const error = ref('');

const roomTypeOptions = [
    { label: 'Classroom', value: 'classroom' },
    { label: 'Laboratory', value: 'laboratory' },
    { label: 'Library', value: 'library' },
    { label: 'Computer Lab', value: 'computer_lab' },
    { label: 'Science Lab', value: 'science_lab' },
    { label: 'Art Room', value: 'art_room' },
    { label: 'Music Room', value: 'music_room' },
    { label: 'Staff Room', value: 'staff_room' },
    { label: 'Conference Room', value: 'conference_room' },
    { label: 'Storage Room', value: 'storage_room' }
];

const statusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Under Construction', value: 'under_construction' }
];

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        name: '',
        room_number: '',
        capacity: '',
        building: '',
        floor: '',
        classroom_type: 'classroom',
        status: 'available'
    };
    error.value = '';
}

function closeDialog() {
    emit('update:visible', false);
}

async function submitForm() {
    loading.value = true;
    error.value = '';

    try {
        await emit('submit', { ...formData.value });
        resetForm();
        closeDialog();
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to save room. Please try again.';
        console.error('Form submission error:', err);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '500px' }"
        :modal="true"
        :dismissableMask="!loading"
        header="Add Room"
        @update:visible="closeDialog"
    >
        <form @submit.prevent="submitForm" class="p-fluid">
            <!-- Error Display -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div class="flex items-center">
                    <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
                    <span class="text-red-700">{{ error }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
                <!-- Room Name -->
                <div>
                    <label for="name" class="block text-900 font-semibold mb-2">Room Name *</label>
                    <InputText
                        id="name"
                        v-model="formData.name"
                        placeholder="e.g., God's House"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Room Number -->
                <div>
                    <label for="room_number" class="block text-900 font-semibold mb-2">Room Number *</label>
                    <InputText
                        id="room_number"
                        v-model="formData.room_number"
                        placeholder="e.g., 101"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Capacity -->
                <div>
                    <label for="capacity" class="block text-900 font-semibold mb-2">Capacity *</label>
                    <InputNumber
                        id="capacity"
                        v-model="formData.capacity"
                        placeholder="Enter capacity"
                        class="w-full"
                        :min="1"
                        required
                    />
                </div>

                <!-- Building -->
                <div>
                    <label for="building" class="block text-900 font-semibold mb-2">Building</label>
                    <InputText
                        id="building"
                        v-model="formData.building"
                        placeholder="e.g., Main Block"
                        class="w-full"
                    />
                </div>

                <!-- Floor -->
                <div>
                    <label for="floor" class="block text-900 font-semibold mb-2">Floor</label>
                    <InputText
                        id="floor"
                        v-model="formData.floor"
                        placeholder="e.g., Ground Floor"
                        class="w-full"
                    />
                </div>

                <!-- Room Type -->
                <div>
                    <label for="classroom_type" class="block text-900 font-semibold mb-2">Room Type *</label>
                    <Dropdown
                        id="classroom_type"
                        v-model="formData.classroom_type"
                        :options="roomTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select room type"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Status -->
                <div>
                    <label for="status" class="block text-900 font-semibold mb-2">Status *</label>
                    <Dropdown
                        id="status"
                        v-model="formData.status"
                        :options="statusOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select status"
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
                    :disabled="loading"
                />
                <Button
                    label="Save Room"
                    icon="pi pi-save"
                    type="submit"
                    class="p-button-primary"
                    :loading="loading"
                    :disabled="loading"
                />
            </div>
        </form>
    </Dialog>
</template>
