<script setup>
import { ref, onMounted } from 'vue';

const treeTableValue = ref(null);

onMounted(() => {
    // Mock tree table data for 7 levels with streams
    treeTableValue.value = [
        {
            key: '0',
            data: {
                name: 'QT',
                total: 120,
                active: 105,
                inactive: 8,
                completed: 95,
                incomplete: 7
            },
            children: [
                {
                    key: '0-0',
                    data: {
                        name: 'Stream A',
                        total: 60,
                        active: 52,
                        inactive: 4,
                        completed: 48,
                        incomplete: 3
                    },
                    children: [
                        {
                            key: '0-0-0',
                            data: {
                                name: 'Class 1A',
                                total: 30,
                                active: 26,
                                inactive: 2,
                                completed: 24,
                                incomplete: 1
                            }
                        },
                        {
                            key: '0-0-1',
                            data: {
                                name: 'Class 1B',
                                total: 30,
                                active: 26,
                                inactive: 2,
                                completed: 24,
                                incomplete: 2
                            }
                        }
                    ]
                },
                {
                    key: '0-1',
                    data: {
                        name: 'Stream B',
                        total: 60,
                        active: 53,
                        inactive: 4,
                        completed: 47,
                        incomplete: 4
                    },
                    children: [
                        {
                            key: '0-1-0',
                            data: {
                                name: 'Class 1C',
                                total: 30,
                                active: 27,
                                inactive: 2,
                                completed: 23,
                                incomplete: 2
                            }
                        },
                        {
                            key: '0-1-1',
                            data: {
                                name: 'Class 1D',
                                total: 30,
                                active: 26,
                                inactive: 2,
                                completed: 24,
                                incomplete: 2
                            }
                        }
                    ]
                }
            ]
        },
        {
            key: '1',
            data: {
                name: 'CSEE',
                total: 95,
                active: 82,
                inactive: 6,
                completed: 78,
                incomplete: 5
            },
            children: [
                {
                    key: '1-0',
                    data: {
                        name: 'Stream A',
                        total: 48,
                        active: 41,
                        inactive: 3,
                        completed: 39,
                        incomplete: 2
                    },
                    children: [
                        {
                            key: '1-0-0',
                            data: {
                                name: 'Class 2A',
                                total: 24,
                                active: 21,
                                inactive: 1,
                                completed: 20,
                                incomplete: 1
                            }
                        },
                        {
                            key: '1-0-1',
                            data: {
                                name: 'Class 2B',
                                total: 24,
                                active: 20,
                                inactive: 2,
                                completed: 19,
                                incomplete: 1
                            }
                        }
                    ]
                },
                {
                    key: '1-1',
                    data: {
                        name: 'Stream B',
                        total: 47,
                        active: 41,
                        inactive: 3,
                        completed: 39,
                        incomplete: 3
                    },
                    children: [
                        {
                            key: '1-1-0',
                            data: {
                                name: 'Class 2C',
                                total: 24,
                                active: 21,
                                inactive: 1,
                                completed: 20,
                                incomplete: 2
                            }
                        },
                        {
                            key: '1-1-1',
                            data: {
                                name: 'Class 2D',
                                total: 23,
                                active: 20,
                                inactive: 2,
                                completed: 19,
                                incomplete: 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            key: '2',
            data: {
                name: 'ASCEE',
                total: 110,
                active: 98,
                inactive: 5,
                completed: 88,
                incomplete: 6
            },
            children: [
                {
                    key: '2-0',
                    data: {
                        name: 'Stream A',
                        total: 55,
                        active: 49,
                        inactive: 2,
                        completed: 44,
                        incomplete: 3
                    },
                    children: [
                        {
                            key: '2-0-0',
                            data: {
                                name: 'Class 3A',
                                total: 28,
                                active: 25,
                                inactive: 1,
                                completed: 22,
                                incomplete: 1
                            }
                        },
                        {
                            key: '2-0-1',
                            data: {
                                name: 'Class 3B',
                                total: 27,
                                active: 24,
                                inactive: 1,
                                completed: 22,
                                incomplete: 2
                            }
                        }
                    ]
                },
                {
                    key: '2-1',
                    data: {
                        name: 'Stream B',
                        total: 55,
                        active: 49,
                        inactive: 3,
                        completed: 44,
                        incomplete: 3
                    },
                    children: [
                        {
                            key: '2-1-0',
                            data: {
                                name: 'Class 3C',
                                total: 28,
                                active: 25,
                                inactive: 1,
                                completed: 22,
                                incomplete: 2
                            }
                        },
                        {
                            key: '2-1-1',
                            data: {
                                name: 'Class 3D',
                                total: 27,
                                active: 24,
                                inactive: 2,
                                completed: 22,
                                incomplete: 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            key: '3',
            data: {
                name: 'English Course',
                total: 85,
                active: 75,
                inactive: 4,
                completed: 70,
                incomplete: 5
            },
            children: [
                {
                    key: '3-0',
                    data: {
                        name: 'Stream A',
                        total: 43,
                        active: 38,
                        inactive: 2,
                        completed: 35,
                        incomplete: 2
                    },
                    children: [
                        {
                            key: '3-0-0',
                            data: {
                                name: 'Class 4A',
                                total: 22,
                                active: 19,
                                inactive: 1,
                                completed: 18,
                                incomplete: 1
                            }
                        },
                        {
                            key: '3-0-1',
                            data: {
                                name: 'Class 4B',
                                total: 21,
                                active: 19,
                                inactive: 1,
                                completed: 17,
                                incomplete: 1
                            }
                        }
                    ]
                },
                {
                    key: '3-1',
                    data: {
                        name: 'Stream B',
                        total: 42,
                        active: 37,
                        inactive: 2,
                        completed: 35,
                        incomplete: 3
                    },
                    children: [
                        {
                            key: '3-1-0',
                            data: {
                                name: 'Class 4C',
                                total: 21,
                                active: 19,
                                inactive: 1,
                                completed: 18,
                                incomplete: 1
                            }
                        },
                        {
                            key: '3-1-1',
                            data: {
                                name: 'Class 4D',
                                total: 21,
                                active: 18,
                                inactive: 1,
                                completed: 17,
                                incomplete: 2
                            }
                        }
                    ]
                }
            ]
        },
        {
            key: '4',
            data: {
                name: 'ECDE',
                total: 75,
                active: 68,
                inactive: 3,
                completed: 65,
                incomplete: 4
            },
            children: [
                {
                    key: '4-0',
                    data: {
                        name: 'Stream A',
                        total: 38,
                        active: 34,
                        inactive: 1,
                        completed: 33,
                        incomplete: 2
                    },
                    children: [
                        {
                            key: '4-0-0',
                            data: {
                                name: 'Class 5A',
                                total: 19,
                                active: 17,
                                inactive: 1,
                                completed: 16,
                                incomplete: 1
                            }
                        },
                        {
                            key: '4-0-1',
                            data: {
                                name: 'Class 5B',
                                total: 19,
                                active: 17,
                                inactive: 0,
                                completed: 17,
                                incomplete: 1
                            }
                        }
                    ]
                },
                {
                    key: '4-1',
                    data: {
                        name: 'Stream B',
                        total: 37,
                        active: 34,
                        inactive: 2,
                        completed: 32,
                        incomplete: 2
                    },
                    children: [
                        {
                            key: '4-1-0',
                            data: {
                                name: 'Class 5C',
                                total: 19,
                                active: 17,
                                inactive: 1,
                                completed: 16,
                                incomplete: 1
                            }
                        },
                        {
                            key: '4-1-1',
                            data: {
                                name: 'Class 5D',
                                total: 18,
                                active: 17,
                                inactive: 1,
                                completed: 16,
                                incomplete: 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            key: '5',
            data: {
                name: 'Pre Form One',
                total: 60,
                active: 55,
                inactive: 2,
                completed: 58,
                incomplete: 3
            },
            children: [
                {
                    key: '5-0',
                    data: {
                        name: 'Stream A',
                        total: 30,
                        active: 28,
                        inactive: 1,
                        completed: 29,
                        incomplete: 1
                    },
                    children: [
                        {
                            key: '5-0-0',
                            data: {
                                name: 'Class 6A',
                                total: 15,
                                active: 14,
                                inactive: 0,
                                completed: 15,
                                incomplete: 0
                            }
                        },
                        {
                            key: '5-0-1',
                            data: {
                                name: 'Class 6B',
                                total: 15,
                                active: 14,
                                inactive: 1,
                                completed: 14,
                                incomplete: 1
                            }
                        }
                    ]
                },
                {
                    key: '5-1',
                    data: {
                        name: 'Stream B',
                        total: 30,
                        active: 27,
                        inactive: 1,
                        completed: 29,
                        incomplete: 2
                    },
                    children: [
                        {
                            key: '5-1-0',
                            data: {
                                name: 'Class 6C',
                                total: 15,
                                active: 14,
                                inactive: 0,
                                completed: 15,
                                incomplete: 0
                            }
                        },
                        {
                            key: '5-1-1',
                            data: {
                                name: 'Class 6D',
                                total: 15,
                                active: 13,
                                inactive: 1,
                                completed: 14,
                                incomplete: 1
                            }
                        }
                    ]
                }
            ]
        }
    ];
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Student Categories - Tree Table</div>
        </div>

        <TreeTable
            :value="treeTableValue"
            class="w-full"
            scrollable
            scrollHeight="400px"
        >
            <Column field="name" header="Name" :expander="true" style="min-width: 150px">
                <template #body="slotProps">
                    <span class="font-medium">{{ slotProps.node.data.name }}</span>
                </template>
            </Column>
            <Column field="total" header="Total" style="min-width: 80px">
                <template #body="slotProps">
                    <span class="text-blue-500 font-medium">{{ slotProps.node.data.total }}</span>
                </template>
            </Column>
            <Column field="active" header="Active" style="min-width: 80px">
                <template #body="slotProps">
                    <span class="text-green-500 font-medium">{{ slotProps.node.data.active }}</span>
                </template>
            </Column>
            <Column field="inactive" header="Inactive" style="min-width: 90px">
                <template #body="slotProps">
                    <span class="text-orange-500 font-medium">{{ slotProps.node.data.inactive }}</span>
                </template>
            </Column>
            <Column field="completed" header="Completed" style="min-width: 100px">
                <template #body="slotProps">
                    <span class="text-purple-500 font-medium">{{ slotProps.node.data.completed }}</span>
                </template>
            </Column>
            <Column field="incomplete" header="Incomplete" style="min-width: 110px">
                <template #body="slotProps">
                    <span class="text-red-500 font-medium">{{ slotProps.node.data.incomplete }}</span>
                </template>
            </Column>
        </TreeTable>

        <div class="mt-4">
            <div class="grid grid-cols-6 gap-4 text-center">
                <div class="font-semibold text-surface-900 dark:text-surface-0">
                    <span class="text-sm text-muted-color block">Grand Total</span>
                    All Levels
                </div>
                <div class="text-blue-500 font-bold text-lg">545</div>
                <div class="text-green-500 font-bold text-lg">483</div>
                <div class="text-orange-500 font-bold text-lg">28</div>
                <div class="text-purple-500 font-bold text-lg">463</div>
                <div class="text-red-500 font-bold text-lg">28</div>
            </div>
        </div>

        <div class="mt-4 pt-4 border-t border-surface">
            <div class="text-sm text-muted-color">
                <i class="pi pi-info-circle mr-2"></i>
                Click on forms to expand and view streams and classes. Scroll to view all data.
            </div>
        </div>
    </div>
</template>
