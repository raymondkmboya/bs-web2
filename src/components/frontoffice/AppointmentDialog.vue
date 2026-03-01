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
    title: '',
    visitorName: '',
    purpose: '',
    appointmentDate: new Date(),
    appointmentTime: '',
    staffName: '',
    location: ''
});

function saveAppointment() {
    emit('save', { ...formData.value });
    resetForm();
    emit('update:visible', false);
}

function cancelAppointment() {
    emit('update:visible', false);
}

function resetForm() {
    formData.value = {
        title: '',
        visitorName: '',
        purpose: '',
        appointmentDate: new Date(),
        appointmentTime: '',
        staffName: '',
        location: ''
    };
}
</script>

<template>
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '450px' }"
        :modal="true"
        header="Schedule Appointment"
        @update:visible="cancelAppointment"
    >
        <form @submit.prevent="saveAppointment" class="p-fluid">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="field">
                    <label for="title">Title</label>
                    <InputText
                        id="title"
                        v-model="formData.title"
                        placeholder="Enter appointment title"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="visitorName">Visitor Name</label>
                    <InputText
                        id="visitorName"
                        v-model="formData.visitorName"
                        placeholder="Enter visitor name"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="purpose">Purpose</label>
                    <InputText
                        id="purpose"
                        v-model="formData.purpose"
                        placeholder="Enter purpose"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="appointmentDate">Date</label>
                    <Calendar
                        id="appointmentDate"
                        v-model="formData.appointmentDate"
                        placeholder="Select date"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="appointmentTime">Time</label>
                    <InputText
                        id="appointmentTime"
                        v-model="formData.appointmentTime"
                        placeholder="Enter time"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="staffName">Staff Name</label>
                    <InputText
                        id="staffName"
                        v-model="formData.staffName"
                        placeholder="Enter staff name"
                        class="w-full"
                    />
                </div>
                <div class="field md:col-span-2">
                    <label for="location">Location</label>
                    <InputText
                        id="location"
                        v-model="formData.location"
                        placeholder="Enter location"
                        class="w-full"
                    />
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Schedule"
                    icon="pi pi-check"
                    type="submit"
                    class="w-full md:w-auto"
                />
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text md:w-auto"
                    @click="cancelAppointment"
                />
            </div>
        </form>
    </Dialog>
</template>
