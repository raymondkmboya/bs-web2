<script setup>
import { ref, watch, onMounted } from 'vue';
import AcademicService from '@/service/AcademicService.js';
import HumanResourceService from '@/service/HumanResourceService';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'submit', 'close']);

const formData = ref({
    name: '',
    description: '',
    supervisor: '',
    status: 'active'
});

const loading = ref(false);
const error = ref('');
const staffMembers = ref([]);

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Maintenance', value: 'maintenance' }
];

// Fetch staff members when component mounts or dialog opens
async function fetchStaffMembers() {
    try {
        const staff = await HumanResourceService.getStaffMembers();
        staffMembers.value = staff.map(member => ({
            label: member.name || `${member.first_name} ${member.last_name}`,
            value: member.name || `${member.first_name} ${member.last_name}`
        }));
    } catch (err) {
        console.error('Failed to fetch staff members:', err);
        staffMembers.value = [];
    }
}

watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetForm();
    } else {
        fetchStaffMembers();
    }
});

onMounted(() => {
    fetchStaffMembers();
});

function resetForm() {
    formData.value = {
        name: '',
        description: '',
        supervisor: '',
        status: 'active'
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
        error.value = err.response?.data?.message || 'Failed to save compass. Please try again.';
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
        header="Add Compass"
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
                <!-- Compass Name -->
                <div>
                    <label for="name" class="block text-900 font-semibold mb-2">Compass Name *</label>
                    <InputText
                        id="name"
                        v-model="formData.name"
                        placeholder="e.g., North Wing"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-900 font-semibold mb-2">Description</label>
                    <Textarea
                        id="description"
                        v-model="formData.description"
                        placeholder="e.g., Academic block for science classes"
                        class="w-full"
                        rows="3"
                    />
                </div>

                <!-- Supervisor -->
                <div>
                    <label for="supervisor" class="block text-900 font-semibold mb-2">Supervisor *</label>
                    <Dropdown
                        id="supervisor"
                        v-model="formData.supervisor"
                        :options="staffMembers"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select supervisor"
                        class="w-full"
                        :loading="staffMembers.length === 0"
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
                    label="Save Compass"
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
