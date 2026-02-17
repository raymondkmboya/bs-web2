<script setup>
const emit = defineEmits(['click']);

function handleClick() {
    emit('click');
}
</script>

<template>
    <Button 
        label="Add Registration" 
        icon="pi pi-plus" 
        @click="handleClick"
        class="p-button-raised"
    />
</template>
