export class RegistrationService {
    constructor() {
        this.registrations = [];
        this.nextRegistrationId = 1;
        this.admissions = [];
        this.nextAdmissionId = 1;
        this.enquiries = [];
        this.nextEnquiryId = 1;
        this.adverts = [];
        this.nextAdvertId = 1;
        this.feeGroups = [];
        this.nextFeeGroupId = 1;
        this.feeAllocations = [];
        this.nextFeeAllocationId = 1;
    }

    async getRegistrations() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.registrations.length === 0) {
                    this.registrations = [
                        {
                            id: 1,
                            name: 'John Smith',
                            email: 'john.smith@email.com',
                            phone: '+255 712 345 678',
                            gender: 'Male',
                            appliedClass: 'Form 1',
                            status: 'registered',
                            registrationDate: '2024-01-15',
                            parentName: 'Robert Smith',
                            parentPhone: '+255 712 345 679'
                        },
                        {
                            id: 2,
                            name: 'Mary Johnson',
                            email: 'mary.j@email.com',
                            phone: '+255 713 456 789',
                            gender: 'Female',
                            appliedClass: 'Form 2',
                            status: 'followed_up',
                            registrationDate: '2024-01-16',
                            parentName: 'Sarah Johnson',
                            parentPhone: '+255 713 456 790'
                        },
                        {
                            id: 3,
                            name: 'David Wilson',
                            email: 'david.w@email.com',
                            phone: '+255 714 567 890',
                            gender: 'Male',
                            appliedClass: 'Form 3',
                            status: 'not_followed_up',
                            registrationDate: '2024-01-17',
                            parentName: 'Michael Wilson',
                            parentPhone: '+255 714 567 891'
                        },
                        {
                            id: 4,
                            name: 'Sarah Brown',
                            email: 'sarah.brown@email.com',
                            phone: '+255 715 678 901',
                            gender: 'Female',
                            appliedClass: 'Form 1',
                            status: 'approved',
                            registrationDate: '2024-01-18',
                            parentName: 'James Brown',
                            parentPhone: '+255 715 678 902'
                        },
                        {
                            id: 5,
                            name: 'Michael Davis',
                            email: 'michael.d@email.com',
                            phone: '+255 716 789 012',
                            gender: 'Male',
                            appliedClass: 'Form 4',
                            status: 'registered',
                            registrationDate: '2024-01-19',
                            parentName: 'Patricia Davis',
                            parentPhone: '+255 716 789 013'
                        }
                    ];
                    this.nextId = 6;
                }
                resolve([...this.registrations]);
            }, 1000);
        });
    }

    async addRegistration(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRegistration = {
                    id: this.nextId++,
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone,
                    gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
                    appliedClass: data.appliedClass.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    status: 'registered',
                    registrationDate: data.registrationDate,
                    parentName: data.parentName,
                    parentPhone: data.parentPhone
                };

                this.registrations.unshift(newRegistration);
                resolve(newRegistration);
            }, 500);
        });
    }

    async updateRegistration(id, data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.registrations.findIndex(reg => reg.id === id);
                if (index !== -1) {
                    this.registrations[index] = { ...this.registrations[index], ...data };
                    resolve(this.registrations[index]);
                } else {
                    reject(new Error('Registration not found'));
                }
            }, 500);
        });
    }

    async deleteRegistration(id) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.registrations.findIndex(reg => reg.id === id);
                if (index !== -1) {
                    this.registrations.splice(index, 1);
                    resolve(true);
                } else {
                    reject(new Error('Registration not found'));
                }
            }, 500);
        });
    }

    async getRegistrationStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const stats = {
                    total: this.registrations.length,
                    followedUp: this.registrations.filter(reg => reg.status === 'followed_up').length,
                    notFollowedUp: this.registrations.filter(reg => reg.status === 'not_followed_up').length,
                    stoppedFollowUp: this.registrations.filter(reg => reg.status === 'registered').length
                };
                resolve(stats);
            }, 300);
        });
    }

    async getAdmissions() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.admissions.length === 0) {
                    this.admissions = [
                        {
                            id: 1,
                            name: 'John Smith',
                            email: 'john.smith@email.com',
                            phone: '+255 712 345 678',
                            gender: 'Male',
                            appliedClass: 'Form 1',
                            status: 'admitted',
                            admissionDate: '2024-01-20',
                            parentName: 'Robert Smith',
                            parentPhone: '+255 712 345 679'
                        },
                        {
                            id: 2,
                            name: 'Mary Johnson',
                            email: 'mary.j@email.com',
                            phone: '+255 713 456 789',
                            gender: 'Female',
                            appliedClass: 'Form 2',
                            status: 'enrolled',
                            admissionDate: '2024-01-21',
                            parentName: 'Sarah Johnson',
                            parentPhone: '+255 713 456 790'
                        },
                        {
                            id: 3,
                            name: 'David Wilson',
                            email: 'david.w@email.com',
                            phone: '+255 714 567 890',
                            gender: 'Male',
                            appliedClass: 'Form 3',
                            status: 'pending_enrollment',
                            admissionDate: '2024-01-22',
                            parentName: 'Michael Wilson',
                            parentPhone: '+255 714 567 891'
                        },
                        {
                            id: 4,
                            name: 'Sarah Brown',
                            email: 'sarah.brown@email.com',
                            phone: '+255 715 678 901',
                            gender: 'Female',
                            appliedClass: 'Form 1',
                            status: 'rejected',
                            admissionDate: '2024-01-23',
                            parentName: 'James Brown',
                            parentPhone: '+255 715 678 902'
                        },
                        {
                            id: 5,
                            name: 'Michael Davis',
                            email: 'michael.d@email.com',
                            phone: '+255 716 789 012',
                            gender: 'Male',
                            appliedClass: 'Form 4',
                            status: 'admitted',
                            admissionDate: '2024-01-24',
                            parentName: 'Patricia Davis',
                            parentPhone: '+255 716 789 013'
                        }
                    ];
                    this.nextAdmissionId = 6;
                }
                resolve([...this.admissions]);
            }, 1000);
        });
    }

    async getAdmissionStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const stats = {
                    total: this.admissions.length,
                    enrolled: this.admissions.filter(adm => adm.status === 'enrolled').length,
                    pendingEnrollment: this.admissions.filter(adm => adm.status === 'pending_enrollment').length,
                    rejected: this.admissions.filter(adm => adm.status === 'rejected').length
                };
                resolve(stats);
            }, 300);
        });
    }

    async enrollStudent(admissionId) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.admissions.findIndex(adm => adm.id === admissionId);
                if (index !== -1) {
                    this.admissions[index].status = 'enrolled';
                    resolve(this.admissions[index]);
                } else {
                    reject(new Error('Admission not found'));
                }
            }, 500);
        });
    }

    async rejectAdmission(admissionId) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.admissions.findIndex(adm => adm.id === admissionId);
                if (index !== -1) {
                    this.admissions[index].status = 'rejected';
                    resolve(this.admissions[index]);
                } else {
                    reject(new Error('Admission not found'));
                }
            }, 500);
        });
    }

    async getEnquiries() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.enquiries.length === 0) {
                    this.enquiries = [
                        {
                            id: 1,
                            name: 'Alice Johnson',
                            email: 'alice.j@email.com',
                            phone: '+255 712 345 678',
                            status: 'new',
                            source: 'phone_call',
                            enquiryDate: '2024-01-25',
                            message: 'Interested in Form 1 admission'
                        },
                        {
                            id: 2,
                            name: 'Bob Smith',
                            email: 'bob.s@email.com',
                            phone: '+255 713 456 789',
                            status: 'contacted',
                            source: 'walk_in',
                            enquiryDate: '2024-01-26',
                            message: 'Visited campus, wants tour'
                        },
                        {
                            id: 3,
                            name: 'Carol Davis',
                            email: 'carol.d@email.com',
                            phone: '+255 714 567 890',
                            status: 'followed_up',
                            source: 'whatsapp',
                            enquiryDate: '2024-01-27',
                            message: 'Sent application forms via WhatsApp'
                        },
                        {
                            id: 4,
                            name: 'David Wilson',
                            email: 'david.w@email.com',
                            phone: '+255 715 678 901',
                            status: 'converted',
                            source: 'facebook',
                            enquiryDate: '2024-01-28',
                            message: 'Saw Facebook ad, applied online'
                        },
                        {
                            id: 5,
                            name: 'Eva Brown',
                            email: 'eva.b@email.com',
                            phone: '+255 716 789 012',
                            status: 'lost',
                            source: 'email',
                            enquiryDate: '2024-01-29',
                            message: 'Email inquiry, no response'
                        }
                    ];
                    this.nextEnquiryId = 6;
                }
                resolve([...this.enquiries]);
            }, 1000);
        });
    }

    async addAdvert(advertData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAdvert = {
                    id: this.nextAdvertId++,
                    ...advertData,
                    createdAt: new Date().toISOString()
                };
                this.adverts.push(newAdvert);
                resolve(newAdvert);
            }, 1000);
        });
    }

    // Fee Groups Management
    async getFeeGroups() {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.feeGroups.length === 0) {
                    this.feeGroups = [
                        {
                            id: 1,
                            name: 'Tuition Fee',
                            description: 'Regular tuition fees for all classes',
                            type: 'mandatory',
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 2,
                            name: 'Examination Fee',
                            description: 'Fees for internal and external examinations',
                            type: 'mandatory',
                            isActive: true,
                            createdAt: '2024-01-15T10:30:00Z'
                        },
                        {
                            id: 3,
                            name: 'Library Fee',
                            description: 'Library access and book borrowing fees',
                            type: 'mandatory',
                            isActive: true,
                            createdAt: '2024-01-15T11:00:00Z'
                        },
                        {
                            id: 4,
                            name: 'Sports Fee',
                            description: 'Sports equipment and facility fees',
                            type: 'optional',
                            isActive: true,
                            createdAt: '2024-01-15T11:30:00Z'
                        },
                        {
                            id: 5,
                            name: 'Transport Fee',
                            description: 'School bus transportation fees',
                            type: 'optional',
                            isActive: true,
                            createdAt: '2024-01-15T12:00:00Z'
                        }
                    ];
                    this.nextFeeGroupId = 6;
                }
                resolve([...this.feeGroups]);
            }, 1000);
        });
    }

    async createFeeGroup(groupData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newGroup = {
                    id: this.nextFeeGroupId++,
                    ...groupData,
                    createdAt: new Date().toISOString()
                };
                this.feeGroups.push(newGroup);
                resolve(newGroup);
            }, 1000);
        });
    }

    async updateFeeGroup(id, groupData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.feeGroups.findIndex(g => g.id === id);
                if (index !== -1) {
                    this.feeGroups[index] = { ...this.feeGroups[index], ...groupData };
                    resolve(this.feeGroups[index]);
                } else {
                    reject(new Error('Fee group not found'));
                }
            }, 1000);
        });
    }

    async deleteFeeGroup(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.feeGroups.findIndex(g => g.id === id);
                if (index !== -1) {
                    this.feeGroups.splice(index, 1);
                    resolve(true);
                } else {
                    reject(new Error('Fee group not found'));
                }
            }, 1000);
        });
    }

    // Fee Allocation Management
    async getFeeAllocations() {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.feeAllocations.length === 0) {
                    this.feeAllocations = [
                        {
                            id: 1,
                            feeGroupId: 1,
                            feeGroupName: 'Tuition Fee',
                            streamId: 1,
                            streamName: 'CSEE Arts',
                            amount: 500000,
                            academicYear: '2024',
                            dueDate: '2024-01-31',
                            isInstallmentAllowed: true,
                            maxInstallments: 3,
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 2,
                            feeGroupId: 1,
                            feeGroupName: 'Tuition Fee',
                            streamId: 2,
                            streamName: 'CSEE Science',
                            amount: 600000,
                            academicYear: '2024',
                            dueDate: '2024-01-31',
                            isInstallmentAllowed: true,
                            maxInstallments: 3,
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 3,
                            feeGroupId: 2,
                            feeGroupName: 'Examination Fee',
                            streamId: 1,
                            streamName: 'CSEE Arts',
                            amount: 50000,
                            academicYear: '2024',
                            dueDate: '2024-03-15',
                            isInstallmentAllowed: false,
                            maxInstallments: 1,
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 4,
                            feeGroupId: 2,
                            feeGroupName: 'Examination Fee',
                            streamId: 2,
                            streamName: 'CSEE Science',
                            amount: 50000,
                            academicYear: '2024',
                            dueDate: '2024-03-15',
                            isInstallmentAllowed: false,
                            maxInstallments: 1,
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 5,
                            feeGroupId: 3,
                            feeGroupName: 'Library Fee',
                            streamId: 1,
                            streamName: 'CSEE Arts',
                            amount: 25000,
                            academicYear: '2024',
                            dueDate: '2024-01-31',
                            isInstallmentAllowed: false,
                            maxInstallments: 1,
                            isActive: true,
                            createdAt: '2024-01-15T10:00:00Z'
                        }
                    ];
                    this.nextFeeAllocationId = 6;
                }
                resolve([...this.feeAllocations]);
            }, 1000);
        });
    }

    async createFeeAllocation(allocationData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAllocation = {
                    id: this.nextFeeAllocationId++,
                    ...allocationData,
                    createdAt: new Date().toISOString()
                };
                this.feeAllocations.push(newAllocation);
                resolve(newAllocation);
            }, 1000);
        });
    }

    async updateFeeAllocation(id, allocationData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.feeAllocations.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.feeAllocations[index] = { ...this.feeAllocations[index], ...allocationData };
                    resolve(this.feeAllocations[index]);
                } else {
                    reject(new Error('Fee allocation not found'));
                }
            }, 1000);
        });
    }

    async deleteFeeAllocation(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.feeAllocations.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.feeAllocations.splice(index, 1);
                    resolve(true);
                } else {
                    reject(new Error('Fee allocation not found'));
                }
            }, 1000);
        });
    }

    // Streams (for dropdown)
    async getStreams() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const streams = [
                    { id: 1, name: 'CSEE Arts' },
                    { id: 2, name: 'CSEE Science' },
                    { id: 3, name: 'ACSEE Arts' },
                    { id: 4, name: 'ACSEE Science' },
                    { id: 5, name: 'Form 1' },
                    { id: 6, name: 'Form 2' },
                    { id: 7, name: 'Form 3' },
                    { id: 8, name: 'Form 4' }
                ];
                resolve(streams);
            }, 500);
        });
    }

    // Fee Collections Management
    async getFeeCollections() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const collections = [
                    {
                        id: 1,
                        studentId: 1,
                        studentName: 'Alice Johnson',
                        feeAllocationId: 1,
                        feeGroupName: 'Tuition Fee',
                        streamName: 'CSEE Arts',
                        totalAmount: 500000,
                        totalPaid: 500000,
                        balance: 0,
                        status: 'paid',
                        lastPaymentDate: '2024-01-15',
                        payments: [
                            { id: 1, amount: 500000, paymentMethod: 'cash', paymentDate: '2024-01-15', receiptNumber: 'REC20240115001' }
                        ]
                    },
                    {
                        id: 2,
                        studentId: 2,
                        studentName: 'Bob Smith',
                        feeAllocationId: 2,
                        feeGroupName: 'Tuition Fee',
                        streamName: 'CSEE Science',
                        totalAmount: 600000,
                        totalPaid: 300000,
                        balance: 300000,
                        status: 'partial',
                        lastPaymentDate: '2024-01-20',
                        payments: [
                            { id: 2, amount: 300000, paymentMethod: 'bank_transfer', paymentDate: '2024-01-20', receiptNumber: 'REC20240120002' }
                        ]
                    },
                    {
                        id: 3,
                        studentId: 3,
                        studentName: 'Carol Davis',
                        feeAllocationId: 3,
                        feeGroupName: 'Examination Fee',
                        streamName: 'CSEE Arts',
                        totalAmount: 50000,
                        totalPaid: 0,
                        balance: 50000,
                        status: 'pending',
                        lastPaymentDate: null,
                        payments: []
                    },
                    {
                        id: 4,
                        studentId: 4,
                        studentName: 'David Wilson',
                        feeAllocationId: 4,
                        feeGroupName: 'Examination Fee',
                        streamName: 'CSEE Science',
                        totalAmount: 50000,
                        totalPaid: 50000,
                        balance: 0,
                        status: 'paid',
                        lastPaymentDate: '2024-01-10',
                        payments: [
                            { id: 3, amount: 50000, paymentMethod: 'mobile_money', paymentDate: '2024-01-10', receiptNumber: 'REC20240110003' }
                        ]
                    },
                    {
                        id: 5,
                        studentId: 5,
                        studentName: 'Eve Brown',
                        feeAllocationId: 5,
                        feeGroupName: 'Library Fee',
                        streamName: 'CSEE Arts',
                        totalAmount: 25000,
                        totalPaid: 0,
                        balance: 25000,
                        status: 'overdue',
                        lastPaymentDate: null,
                        payments: []
                    }
                ];
                resolve(collections);
            }, 1000);
        });
    }

    async createFeePayment(paymentData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newPayment = {
                    id: Date.now(),
                    ...paymentData,
                    createdAt: new Date().toISOString()
                };
                resolve(newPayment);
            }, 1000);
        });
    }

    async getAdverts() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.adverts.length === 0) {
                    this.adverts = [
                        {
                            id: 1,
                            user: 'Alice Johnson',
                            cost: '100,000',
                            source: 'BSE',
                            medium: 'Road Posters',
                            advertDate: '2024-01-25',
                        },
                        {
                            id: 2,
                            user: 'Bob Smith',
                            cost: '250,000',
                            source: 'Registration',
                            medium: 'Car Posters',
                            advertDate: '2024-01-26',
                        },
                        {
                            id: 3,
                            user: 'Carol Davis',
                            cost: '150,000',
                            source: 'Walk In',
                            medium: 'Radio',
                            advertDate: '2024-01-27',
                        },
                        {
                            id: 4,
                            user: 'David Wilson',
                            cost: '300,000',
                            source: 'BSE',
                            medium: 'TV',
                            advertDate: '2024-01-28',
                        },
                        {
                            id: 5,
                            user: 'Eve Brown',
                            cost: '80,000',
                            source: 'Phone Call',
                            medium: 'SMS',
                            advertDate: '2024-01-29',
                        }
                    ];
                    this.nextAdvertId = 6;
                }
                resolve([...this.adverts]);
            }, 1000);
        });
    }

    async getEnquiryStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const stats = {
                    total: this.enquiries.length,
                    phoneCalls: this.enquiries.filter(eq => eq.source === 'phone_call').length,
                    walkIns: this.enquiries.filter(eq => eq.source === 'walk_in').length,
                    whatsapp: this.enquiries.filter(eq => eq.source === 'whatsapp').length,
                    facebook: this.enquiries.filter(eq => eq.source === 'facebook').length
                };
                resolve(stats);
            }, 300);
        });
    }

    async addEnquiry(enquiryData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newEnquiry = {
                    id: this.nextEnquiryId++,
                    ...enquiryData,
                    status: 'new',
                    enquiryDate: new Date().toISOString().split('T')[0]
                };
                this.enquiries.unshift(newEnquiry);
                resolve(newEnquiry);
            }, 500);
        });
    }

    async updateEnquiry(enquiryId, data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.enquiries.findIndex(eq => eq.id === enquiryId);
                if (index !== -1) {
                    this.enquiries[index] = { ...this.enquiries[index], ...data };
                    resolve(this.enquiries[index]);
                } else {
                    reject(new Error('Enquiry not found'));
                }
            }, 500);
        });
    }
}

export default new RegistrationService();
