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
    name: '',
    purpose: '',
    studentName: '',
    idNumber: '',
    phone: ''
});

function saveVisitor() {
    emit('save', { ...formData.value });
    resetForm();
    emit('update:visible', false);
}

function cancelVisitor() {
    emit('update:visible', false);
}

function resetForm() {
    formData.value = {
        name: '',
        purpose: '',
        studentName: '',
        idNumber: '',
        phone: ''
    };
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '450px' }"
        :modal="true"
        header="Check In Visitor"
        @update:visible="cancelVisitor"
    >
        <form @submit.prevent="saveVisitor" class="p-fluid">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field">
                    <label for="visitorName">Visitor Name</label>
                    <InputText
                        id="visitorName"
                        v-model="formData.name"
                        placeholder="Enter visitor name"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="purpose">Purpose</label>
                    <InputText
                        id="purpose"
                        v-model="formData.purpose"
                        placeholder="Enter visit purpose"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="studentName">Student Name</label>
                    <InputText
                        id="studentName"
                        v-model="formData.studentName"
                        placeholder="Enter student name"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="idNumber">ID Number</label>
                    <InputText
                        id="idNumber"
                        v-model="formData.idNumber"
                        placeholder="Enter ID number"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="phone">Phone</label>
                    <InputText
                        id="phone"
                        v-model="formData.phone"
                        placeholder="Enter phone number"
                        class="w-full"
                    />
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Check In"
                    icon="pi pi-check"
                    type="submit"
                    class="w-full md:w-auto"
                />
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text md:w-auto"
                    @click="cancelVisitor"
                />
            </div>
        </form>
    </Dialog>
</template>
