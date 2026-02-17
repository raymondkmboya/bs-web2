<script setup>
const props = defineProps({
    postal: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['add-postal', 'edit-postal', 'delete-postal']);

function getTypeSeverity(type) {
    return type === 'Outgoing' ? 'danger' : 'success';
}

function getStatusSeverity(status) {
    const statusMap = {
        'dispatched': 'success',
        'received': 'info',
        'pending': 'warning',
        'lost': 'danger'
    };
    return statusMap[status] || 'info';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(timeString) {
    return timeString || '--:--';
}
</script>

<template>
    <DataTable 
        :value="postal" 
        :paginator="true" 
        :rows="10" 
        dataKey="id"
        :loading="loading"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
    >
        <template #header>
            <div class="flex justify-content-between">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear Filters" 
                    class="p-button-outlined" 
                    size="small"
                />
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText placeholder="Search postal items..." />
                </span>
            </div>
        </template>

        <Column field="type" header="Type" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.type" 
                    :severity="getTypeSeverity(data.type)"
                />
            </template>
        </Column>

        <Column field="sender" header="Sender/Recipient" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user mr-2"></i>
                    <div>
                        <span class="font-semibold">{{ data.type === 'Outgoing' ? data.recipient : data.sender }}</span>
                        <div class="text-600 text-sm">{{ data.company || data.organization || '--' }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="address" header="Address" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-map-marker mr-2"></i>
                    <span class="text-600">{{ data.address }}</span>
                </div>
            </template>
        </Column>

        <Column field="item" header="Item Description" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-box mr-2"></i>
                    <span class="text-600">{{ data.item }}</span>
                </div>
            </template>
        </Column>

        <Column field="trackingNumber" header="Tracking Number" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-qrcode mr-2"></i>
                    <span class="font-semibold">{{ data.trackingNumber }}</span>
                </div>
            </template>
        </Column>

        <Column field="date" header="Date" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-calendar mr-2"></i>
                    <div>
                        <span>{{ formatDate(data.type === 'Outgoing' ? data.dispatchDate : data.receiveDate) }}</span>
                        <div class="text-600 text-sm">{{ formatTime(data.type === 'Outgoing' ? data.dispatchTime : data.receiveTime) }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column field="handledBy" header="Handled By" sortable>
            <template #body="{ data }">
                <div class="flex align-items-center">
                    <i class="pi pi-user-edit mr-2"></i>
                    <span class="text-600">{{ data.type === 'Outgoing' ? data.dispatchedBy : data.receivedBy }}</span>
                </div>
            </template>
        </Column>

        <Column field="status" header="Status" sortable>
            <template #body="{ data }">
                <Tag 
                    :value="data.status.toUpperCase()" 
                    :severity="getStatusSeverity(data.status)"
                />
            </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
                <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text mr-2" 
                    @click="$emit('edit-postal', data)"
                    v-tooltip="'Edit Postal Item'"
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="$emit('delete-postal', data)"
                    v-tooltip="'Delete Postal Item'"
                />
            </template>
        </Column>
    </DataTable>
</template>
