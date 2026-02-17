<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
    { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
    { label: 'Export', icon: 'pi pi-fw pi-download' }
]);
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Student Categories by Numbers</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="min-w-40!"></Menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="mb-6">
                <div class="mb-3">
                    <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg">Form 1</span>
                    <div class="text-sm text-muted-color">Class Level 1</div>
                </div>

                <div class="ml-4 space-y-4">
                    <div class="border-l-2 border-blue-200 pl-3">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-surface-800 dark:text-surface-100 font-medium text-sm">Stream A</span>
                            <span class="text-blue-500 text-sm font-medium">60</span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Active</span>
                                <span class="text-green-500">52</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-green-500 h-full rounded-full" style="width: 34px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Inactive</span>
                                <span class="text-orange-500">4</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-orange-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Completed</span>
                                <span class="text-purple-500">48</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-purple-500 h-full rounded-full" style="width: 32px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Incomplete</span>
                                <span class="text-red-500">3</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-red-500 h-full rounded-full" style="width: 2px"></div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-2 border-green-200 pl-3">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-surface-800 dark:text-surface-100 font-medium text-sm">Stream B</span>
                            <span class="text-blue-500 text-sm font-medium">60</span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Active</span>
                                <span class="text-green-500">53</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-green-500 h-full rounded-full" style="width: 35px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Inactive</span>
                                <span class="text-orange-500">4</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-orange-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Completed</span>
                                <span class="text-purple-500">47</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-purple-500 h-full rounded-full" style="width: 31px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Incomplete</span>
                                <span class="text-red-500">4</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-red-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <li class="mb-6">
                <div class="mb-3">
                    <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg">Form 2</span>
                    <div class="text-sm text-muted-color">Class Level 2</div>
                </div>

                <div class="ml-4 space-y-4">
                    <div class="border-l-2 border-purple-200 pl-3">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-surface-800 dark:text-surface-100 font-medium text-sm">Stream A</span>
                            <span class="text-blue-500 text-sm font-medium">48</span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Active</span>
                                <span class="text-green-500">41</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-green-500 h-full rounded-full" style="width: 34px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Inactive</span>
                                <span class="text-orange-500">3</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-orange-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Completed</span>
                                <span class="text-purple-500">39</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-purple-500 h-full rounded-full" style="width: 32px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Incomplete</span>
                                <span class="text-red-500">2</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-red-500 h-full rounded-full" style="width: 1.5px"></div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-2 border-orange-200 pl-3">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-surface-800 dark:text-surface-100 font-medium text-sm">Stream B</span>
                            <span class="text-blue-500 text-sm font-medium">47</span>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Active</span>
                                <span class="text-green-500">41</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-green-500 h-full rounded-full" style="width: 34px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Inactive</span>
                                <span class="text-orange-500">3</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-orange-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Completed</span>
                                <span class="text-purple-500">39</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-purple-500 h-full rounded-full" style="width: 33px"></div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-surface-600">Incomplete</span>
                                <span class="text-red-500">3</span>
                            </div>
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-full overflow-hidden h-1 ml-auto" style="width: 40px">
                                <div class="bg-red-500 h-full rounded-full" style="width: 2.5px"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
