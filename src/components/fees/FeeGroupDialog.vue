<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['save', 'cancel', 'update:visible']);

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    feeGroup: {
        type: Object,
        default: null
    },
    feeTypes: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const formData = ref({
    name: '',
    description: '',
    type: 'mandatory',
    isActive: true
});

const isFormValid = computed(() => {
    return formData.value.name && formData.value.name.trim() !== '';
});

// Watch for prop changes
watch(() => props.feeGroup, (newFeeGroup) => {
    if (newFeeGroup) {
        formData.value = { ...newFeeGroup };
    } else {
        resetForm();
    }
});

// Watch for visibility changes
watch(() => props.visible, (isVisible) => {
    if (!isVisible) {
        resetForm();
    }
});

function resetForm() {
    formData.value = {
        name: '',
        description: '',
        type: 'mandatory',
        isActive: true
    };
}

function handleSave() {
    if (!isFormValid.value) return;
    
    const saveData = {
        ...formData.value,
        id: props.feeGroup?.id || null
    };
    
    emit('save', saveData);
}

function handleCancel() {
    emit('cancel');
}

function handleUpdateVisible(visible) {
    emit('update:visible', visible);
}
</script>

<template>
    <Dialog 
        :visible="visible" 
        :header="feeGroup ? 'Edit Fee Group' : 'Add Fee Group'"
        :modal="true" 
        :style="{ width: '450px' }"
        :closable="false"
        @update:visible="handleUpdateVisible"
    >
        <div class="field">
            <label for="name">Fee Group Name *</label>
            <InputText 
                id="name" 
                v-model="formData.name" 
                required="true" 
                :class="{ 'p-invalid': !formData.name }"
                autofocus
                class="w-full"
            />
            <small class="p-error" v-if="!formData.name">Name is required.</small>
        </div>

        <div class="field">
            <label for="type">Type *</label>
            <Dropdown 
                id="type" 
                v-model="formData.type" 
                :options="feeTypes" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select fee type"
                class="w-full"
            />
        </div>

        <div class="field">
            <label for="description">Description</label>
            <Textarea 
                id="description" 
                v-model="formData.description" 
                rows="3" 
                placeholder="Enter fee group description..."
                class="w-full"
            />
        </div>

        <div class="field-checkbox">
            <Checkbox 
                id="isActive" 
                v-model="formData.isActive" 
                binary
            />
            <label for="isActive">Active</label>
        </div>

        <template #footer>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                class="p-button-text" 
                @click="handleCancel()"
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                @click="handleSave()" 
                :loading="loading"
                :disabled="!isFormValid"
            />
        </template>
    </Dialog>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.field-checkbox {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.field-checkbox label {
    margin-bottom: 0;
}
</style>
