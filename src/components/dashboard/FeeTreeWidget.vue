<script setup>
import { ref, onMounted } from 'vue';

const feeTreeTableValue = ref(null);

onMounted(() => {
    // Mock fee tree table data showing fee groups with class levels and streams
    feeTreeTableValue.value = [
        {
            key: '0',
            data: {
                name: 'Tuition Fees',
                totalExpected: 1200000,
                totalCollected: 980000,
                balance: 220000,
                collectionRate: 81.7
            },
            children: [
                {
                    key: '0-0',
                    data: {
                        name: 'QT',
                        totalExpected: 300000,
                        totalCollected: 250000,
                        balance: 50000,
                        collectionRate: 83.3
                    },
                    children: [
                        {
                            key: '0-0-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 150000,
                                totalCollected: 125000,
                                balance: 25000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-0-0-0',
                                    data: {
                                        name: 'Class 1A',
                                        totalExpected: 75000,
                                        totalCollected: 62000,
                                        balance: 13000,
                                        collectionRate: 82.7
                                    }
                                },
                                {
                                    key: '0-0-0-1',
                                    data: {
                                        name: 'Class 1B',
                                        totalExpected: 75000,
                                        totalCollected: 63000,
                                        balance: 12000,
                                        collectionRate: 84.0
                                    }
                                }
                            ]
                        },
                        {
                            key: '0-0-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 150000,
                                totalCollected: 125000,
                                balance: 25000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-0-1-0',
                                    data: {
                                        name: 'Class 1C',
                                        totalExpected: 75000,
                                        totalCollected: 63000,
                                        balance: 12000,
                                        collectionRate: 84.0
                                    }
                                },
                                {
                                    key: '0-0-1-1',
                                    data: {
                                        name: 'Class 1D',
                                        totalExpected: 75000,
                                        totalCollected: 62000,
                                        balance: 13000,
                                        collectionRate: 82.7
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '0-1',
                    data: {
                        name: 'CSEE',
                        totalExpected: 280000,
                        totalCollected: 235000,
                        balance: 45000,
                        collectionRate: 83.9
                    },
                    children: [
                        {
                            key: '0-1-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 140000,
                                totalCollected: 118000,
                                balance: 22000,
                                collectionRate: 84.3
                            },
                            children: [
                                {
                                    key: '0-1-0-0',
                                    data: {
                                        name: 'Class 2A',
                                        totalExpected: 70000,
                                        totalCollected: 59000,
                                        balance: 11000,
                                        collectionRate: 84.3
                                    }
                                },
                                {
                                    key: '0-1-0-1',
                                    data: {
                                        name: 'Class 2B',
                                        totalExpected: 70000,
                                        totalCollected: 59000,
                                        balance: 11000,
                                        collectionRate: 84.3
                                    }
                                }
                            ]
                        },
                        {
                            key: '0-1-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 140000,
                                totalCollected: 117000,
                                balance: 23000,
                                collectionRate: 83.6
                            },
                            children: [
                                {
                                    key: '0-1-1-0',
                                    data: {
                                        name: 'Class 2C',
                                        totalExpected: 70000,
                                        totalCollected: 58500,
                                        balance: 11500,
                                        collectionRate: 83.6
                                    }
                                },
                                {
                                    key: '0-1-1-1',
                                    data: {
                                        name: 'Class 2D',
                                        totalExpected: 70000,
                                        totalCollected: 58500,
                                        balance: 11500,
                                        collectionRate: 83.6
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '0-2',
                    data: {
                        name: 'ASCEE',
                        totalExpected: 320000,
                        totalCollected: 265000,
                        balance: 55000,
                        collectionRate: 82.8
                    },
                    children: [
                        {
                            key: '0-2-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 160000,
                                totalCollected: 132000,
                                balance: 28000,
                                collectionRate: 82.5
                            },
                            children: [
                                {
                                    key: '0-2-0-0',
                                    data: {
                                        name: 'Class 3A',
                                        totalExpected: 80000,
                                        totalCollected: 66000,
                                        balance: 14000,
                                        collectionRate: 82.5
                                    }
                                },
                                {
                                    key: '0-2-0-1',
                                    data: {
                                        name: 'Class 3B',
                                        totalExpected: 80000,
                                        totalCollected: 66000,
                                        balance: 14000,
                                        collectionRate: 82.5
                                    }
                                }
                            ]
                        },
                        {
                            key: '0-2-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 160000,
                                totalCollected: 133000,
                                balance: 27000,
                                collectionRate: 83.1
                            },
                            children: [
                                {
                                    key: '0-2-1-0',
                                    data: {
                                        name: 'Class 3C',
                                        totalExpected: 80000,
                                        totalCollected: 66500,
                                        balance: 13500,
                                        collectionRate: 83.1
                                    }
                                },
                                {
                                    key: '0-2-1-1',
                                    data: {
                                        name: 'Class 3D',
                                        totalExpected: 80000,
                                        totalCollected: 66500,
                                        balance: 13500,
                                        collectionRate: 83.1
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '0-3',
                    data: {
                        name: 'English Course',
                        totalExpected: 180000,
                        totalCollected: 150000,
                        balance: 30000,
                        collectionRate: 83.3
                    },
                    children: [
                        {
                            key: '0-3-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 90000,
                                totalCollected: 75000,
                                balance: 15000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-3-0-0',
                                    data: {
                                        name: 'Class 4A',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '0-3-0-1',
                                    data: {
                                        name: 'Class 4B',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        },
                        {
                            key: '0-3-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 90000,
                                totalCollected: 75000,
                                balance: 15000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-3-1-0',
                                    data: {
                                        name: 'Class 4C',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '0-3-1-1',
                                    data: {
                                        name: 'Class 4D',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '0-4',
                    data: {
                        name: 'ECDE',
                        totalExpected: 120000,
                        totalCollected: 100000,
                        balance: 20000,
                        collectionRate: 83.3
                    },
                    children: [
                        {
                            key: '0-4-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 60000,
                                totalCollected: 50000,
                                balance: 10000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-4-0-0',
                                    data: {
                                        name: 'Class 5A',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '0-4-0-1',
                                    data: {
                                        name: 'Class 5B',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        },
                        {
                            key: '0-4-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 60000,
                                totalCollected: 50000,
                                balance: 10000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '0-4-1-0',
                                    data: {
                                        name: 'Class 5C',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '0-4-1-1',
                                    data: {
                                        name: 'Class 5D',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            key: '1',
            data: {
                name: 'Exam Fees',
                totalExpected: 450000,
                totalCollected: 380000,
                balance: 70000,
                collectionRate: 84.4
            },
            children: [
                {
                    key: '1-0',
                    data: {
                        name: 'QT',
                        totalExpected: 120000,
                        totalCollected: 100000,
                        balance: 20000,
                        collectionRate: 83.3
                    },
                    children: [
                        {
                            key: '1-0-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 60000,
                                totalCollected: 50000,
                                balance: 10000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '1-0-0-0',
                                    data: {
                                        name: 'Class 1A',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '1-0-0-1',
                                    data: {
                                        name: 'Class 1B',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        },
                        {
                            key: '1-0-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 60000,
                                totalCollected: 50000,
                                balance: 10000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '1-0-1-0',
                                    data: {
                                        name: 'Class 1C',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '1-0-1-1',
                                    data: {
                                        name: 'Class 1D',
                                        totalExpected: 30000,
                                        totalCollected: 25000,
                                        balance: 5000,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '1-1',
                    data: {
                        name: 'CSEE',
                        totalExpected: 150000,
                        totalCollected: 130000,
                        balance: 20000,
                        collectionRate: 86.7
                    },
                    children: [
                        {
                            key: '1-1-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 75000,
                                totalCollected: 65000,
                                balance: 10000,
                                collectionRate: 86.7
                            },
                            children: [
                                {
                                    key: '1-1-0-0',
                                    data: {
                                        name: 'Class 2A',
                                        totalExpected: 37500,
                                        totalCollected: 32500,
                                        balance: 5000,
                                        collectionRate: 86.7
                                    }
                                },
                                {
                                    key: '1-1-0-1',
                                    data: {
                                        name: 'Class 2B',
                                        totalExpected: 37500,
                                        totalCollected: 32500,
                                        balance: 5000,
                                        collectionRate: 86.7
                                    }
                                }
                            ]
                        },
                        {
                            key: '1-1-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 75000,
                                totalCollected: 65000,
                                balance: 10000,
                                collectionRate: 86.7
                            },
                            children: [
                                {
                                    key: '1-1-1-0',
                                    data: {
                                        name: 'Class 2C',
                                        totalExpected: 37500,
                                        totalCollected: 32500,
                                        balance: 5000,
                                        collectionRate: 86.7
                                    }
                                },
                                {
                                    key: '1-1-1-1',
                                    data: {
                                        name: 'Class 2D',
                                        totalExpected: 37500,
                                        totalCollected: 32500,
                                        balance: 5000,
                                        collectionRate: 86.7
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '1-2',
                    data: {
                        name: 'ASCEE',
                        totalExpected: 180000,
                        totalCollected: 150000,
                        balance: 30000,
                        collectionRate: 83.3
                    },
                    children: [
                        {
                            key: '1-2-0',
                            data: {
                                name: 'Stream A',
                                totalExpected: 90000,
                                totalCollected: 75000,
                                balance: 15000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '1-2-0-0',
                                    data: {
                                        name: 'Class 3A',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '1-2-0-1',
                                    data: {
                                        name: 'Class 3B',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        },
                        {
                            key: '1-2-1',
                            data: {
                                name: 'Stream B',
                                totalExpected: 90000,
                                totalCollected: 75000,
                                balance: 15000,
                                collectionRate: 83.3
                            },
                            children: [
                                {
                                    key: '1-2-1-0',
                                    data: {
                                        name: 'Class 3C',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                },
                                {
                                    key: '1-2-1-1',
                                    data: {
                                        name: 'Class 3D',
                                        totalExpected: 45000,
                                        totalCollected: 37500,
                                        balance: 7500,
                                        collectionRate: 83.3
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            key: '2',
            data: {
                name: 'Registration Fees',
                totalExpected: 250000,
                totalCollected: 240000,
                balance: 10000,
                collectionRate: 96.0
            },
            children: [
                {
                    key: '2-0',
                    data: {
                        name: 'New Students',
                        totalExpected: 150000,
                        totalCollected: 145000,
                        balance: 5000,
                        collectionRate: 96.7
                    },
                    children: [
                        {
                            key: '2-0-0',
                            data: {
                                name: 'QT',
                                totalExpected: 50000,
                                totalCollected: 48000,
                                balance: 2000,
                                collectionRate: 96.0
                            }
                        },
                        {
                            key: '2-0-1',
                            data: {
                                name: 'CSEE',
                                totalExpected: 50000,
                                totalCollected: 48500,
                                balance: 1500,
                                collectionRate: 97.0
                            }
                        },
                        {
                            key: '2-0-2',
                            data: {
                                name: 'ASCEE',
                                totalExpected: 50000,
                                totalCollected: 48500,
                                balance: 1500,
                                collectionRate: 97.0
                            }
                        }
                    ]
                },
                {
                    key: '2-1',
                    data: {
                        name: 'Transfer Students',
                        totalExpected: 100000,
                        totalCollected: 95000,
                        balance: 5000,
                        collectionRate: 95.0
                    },
                    children: [
                        {
                            key: '2-1-0',
                            data: {
                                name: 'QT',
                                totalExpected: 30000,
                                totalCollected: 28500,
                                balance: 1500,
                                collectionRate: 95.0
                            }
                        },
                        {
                            key: '2-1-1',
                            data: {
                                name: 'CSEE',
                                totalExpected: 35000,
                                totalCollected: 33250,
                                balance: 1750,
                                collectionRate: 95.0
                            }
                        },
                        {
                            key: '2-1-2',
                            data: {
                                name: 'ASCEE',
                                totalExpected: 35000,
                                totalCollected: 33250,
                                balance: 1750,
                                collectionRate: 95.0
                            }
                        }
                    ]
                }
            ]
        }
    ];
});

function formatCurrency(value) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function getRateColor(rate) {
    if (rate >= 90) return 'text-green-500';
    if (rate >= 80) return 'text-blue-500';
    if (rate >= 70) return 'text-yellow-500';
    return 'text-red-500';
}

function getRateSeverity(rate) {
    if (rate >= 90) return 'success';
    if (rate >= 80) return 'info';
    if (rate >= 70) return 'warning';
    return 'danger';
}
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Fee Structure - Tree Table</div>
        </div>

        <TreeTable
            :value="feeTreeTableValue"
            class="w-full"
            scrollable
            scrollHeight="400px"
        >
            <Column field="name" header="Fee Group / Level / Stream / Class" :expander="true" style="min-width: 200px">
                <template #body="slotProps">
                    <span class="font-medium">{{ slotProps.node.data.name }}</span>
                </template>
            </Column>
            <Column field="totalExpected" header="Expected" style="min-width: 120px">
                <template #body="slotProps">
                    <span class="text-blue-500 font-medium">{{ formatCurrency(slotProps.node.data.totalExpected) }}</span>
                </template>
            </Column>
            <Column field="totalCollected" header="Collected" style="min-width: 120px">
                <template #body="slotProps">
                    <span class="text-green-500 font-medium">{{ formatCurrency(slotProps.node.data.totalCollected) }}</span>
                </template>
            </Column>
            <Column field="balance" header="Balance" style="min-width: 120px">
                <template #body="slotProps">
                    <span class="text-orange-500 font-medium">{{ formatCurrency(slotProps.node.data.balance) }}</span>
                </template>
            </Column>
            <Column field="collectionRate" header="Collection Rate" style="min-width: 140px">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <Tag 
                            :value="slotProps.node.data.collectionRate + '%'" 
                            :severity="getRateSeverity(slotProps.node.data.collectionRate)"
                        />
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full" 
                                :class="getRateColor(slotProps.node.data.collectionRate).replace('text-', 'bg-')"
                                :style="{ width: slotProps.node.data.collectionRate + '%' }"
                            ></div>
                        </div>
                    </div>
                </template>
            </Column>
        </TreeTable>

        <div class="mt-4">
            <div class="grid grid-cols-5 gap-4 text-center">
                <div class="font-semibold text-surface-900 dark:text-surface-0">
                    <span class="text-sm text-muted-color block">Grand Total</span>
                    All Fee Groups
                </div>
                <div class="text-blue-500 font-bold text-lg">{{ formatCurrency(1900000) }}</div>
                <div class="text-green-500 font-bold text-lg">{{ formatCurrency(1600000) }}</div>
                <div class="text-orange-500 font-bold text-lg">{{ formatCurrency(300000) }}</div>
                <div class="text-purple-500 font-bold text-lg">84.2%</div>
            </div>
        </div>

        <div class="mt-4 pt-4 border-t border-surface">
            <div class="text-sm text-muted-color">
                <i class="pi pi-info-circle mr-2"></i>
                Click on fee groups to expand and view class levels, streams, and classes. Scroll to view all data.
            </div>
        </div>
    </div>
</template>
