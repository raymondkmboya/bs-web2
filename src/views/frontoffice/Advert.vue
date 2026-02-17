<script setup>
import { ref, onMounted } from 'vue';
import AdvertStats from '@/components/frontoffice/AdvertStats.vue';
import AdvertTable from '@/components/frontoffice/AdvertTable.vue';
import AdvertForm from '@/components/frontoffice/AdvertForm.vue';
import RegistrationService from '@/services/RegistrationService.js';

// Table data
const adverts = ref([]);
const loading = ref(false);

// Form dialog
const showAddDialog = ref(false);

onMounted(() => {
    loadAdverts();
});

async function loadAdverts() {
    loading.value = true;
    try {
        adverts.value = await RegistrationService.getAdverts();
    } catch (error) {
        console.error('Failed to load adverts:', error);
    } finally {
        loading.value = false;
    }
}

function openAddDialog() {
    showAddDialog.value = true;
}

function closeForm() {
    showAddDialog.value = false;
}

async function submitAdvert(data) {
    try {
        await RegistrationService.addAdvert(data);
        await loadAdverts(); // Refresh the table
    } catch (error) {
        console.error('Failed to submit advert:', error);
    }
}

function handleView(data) {
    console.log('View:', data);
    // Implement view logic
}

function handleEdit(data) {
    console.log('Edit:', data);
    // Implement edit logic
}

function handleFollowUp(data) {
    console.log('Follow Up:', data);
    // Implement follow up logic
}
</script>

<template>
    <!-- Advert Stats Component -->
    <AdvertStats />

    <!-- Form Component - Always visible -->
    <AdvertForm
        v-model:visible="showAddDialog"
        @submit="submitAdvert"
        @close="closeForm"
    />

    <!-- Table Component - Always visible -->
    <div class="card mt-6">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Advertisements</div>
            <Button
                label="Add Advert"
                icon="pi pi-plus"
                @click="openAddDialog"
                class="p-button-raised"
            />
        </div>

        <!-- Table Component -->
        <AdvertTable
            :enquiries="adverts"
            :loading="loading"
            @view="handleView"
            @edit="handleEdit"
            @followUp="handleFollowUp"
        />
    </div>
</template>
