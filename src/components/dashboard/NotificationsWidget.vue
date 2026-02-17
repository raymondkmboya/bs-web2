<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
    { label: 'Add Notice', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove Notice', icon: 'pi pi-fw pi-trash' }
]);
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notice Board</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="min-w-40!"></Menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="py-3 px-4 mb-3 bg-yellow-50 dark:bg-yellow-400/10 border-l-4 border-yellow-500 rounded-r-lg">
                <div class="flex items-start">
                    <i class="pi pi-exclamation-triangle text-yellow-500 mr-3 mt-1"></i>
                    <div>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">Important Notice</span>
                        <p class="text-sm text-surface-700 dark:text-surface-100 mt-1">School will close early today at 2:00 PM due to staff meeting.</p>
                        <span class="text-xs text-muted-color mt-2 block">Posted by: Admin - 2 hours ago</span>
                    </div>
                </div>
            </li>
            <li class="py-3 px-4 mb-3 bg-blue-50 dark:bg-blue-400/10 border-l-4 border-blue-500 rounded-r-lg">
                <div class="flex items-start">
                    <i class="pi pi-calendar text-blue-500 mr-3 mt-1"></i>
                    <div>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">Exam Schedule</span>
                        <p class="text-sm text-surface-700 dark:text-surface-100 mt-1">Form 4 Mid-term exams begin next Monday. Check timetable for details.</p>
                        <span class="text-xs text-muted-color mt-2 block">Posted by: Academic Office - 4 hours ago</span>
                    </div>
                </div>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="py-3 px-4 mb-3 bg-green-50 dark:bg-green-400/10 border-l-4 border-green-500 rounded-r-lg">
                <div class="flex items-start">
                    <i class="pi pi-check-circle text-green-500 mr-3 mt-1"></i>
                    <div>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">Fee Payment Reminder</span>
                        <p class="text-sm text-surface-700 dark:text-surface-100 mt-1">Second term fees due by end of this month. Please pay on time.</p>
                        <span class="text-xs text-muted-color mt-2 block">Posted by: Finance Office - Yesterday</span>
                    </div>
                </div>
            </li>
            <li class="py-3 px-4 mb-3 bg-purple-50 dark:bg-purple-400/10 border-l-4 border-purple-500 rounded-r-lg">
                <div class="flex items-start">
                    <i class="pi pi-trophy text-purple-500 mr-3 mt-1"></i>
                    <div>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">Sports Competition</span>
                        <p class="text-sm text-surface-700 dark:text-surface-100 mt-1">Inter-house sports competition next Friday. All students must participate.</p>
                        <span class="text-xs text-muted-color mt-2 block">Posted by: Sports Department - Yesterday</span>
                    </div>
                </div>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">THIS WEEK</span>
        <ul class="p-0 m-0 list-none">
            <li class="py-3 px-4 mb-3 bg-orange-50 dark:bg-orange-400/10 border-l-4 border-orange-500 rounded-r-lg">
                <div class="flex items-start">
                    <i class="pi pi-users text-orange-500 mr-3 mt-1"></i>
                    <div>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">Parent Meeting</span>
                        <p class="text-sm text-surface-700 dark:text-surface-100 mt-1">Parent-teacher meeting scheduled for Saturday 10:00 AM.</p>
                        <span class="text-xs text-muted-color mt-2 block">Posted by: Administration - 3 days ago</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
