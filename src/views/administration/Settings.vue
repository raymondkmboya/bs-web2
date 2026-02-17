<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(false);
const settings = ref({
    school: {
        name: 'British School',
        address: '123 Education Street, Dar es Salaam, Tanzania',
        phone: '+255 123 456 789',
        email: 'info@britishschool.edu',
        website: 'www.britishschool.edu'
    },
    academic: {
        currentTerm: 'Term 1',
        currentYear: 2024,
        termStartDate: new Date('2024-01-15'),
        termEndDate: new Date('2024-04-15'),
        gradingScale: 'O-Level',
        maxClassSize: 35
    },
    system: {
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        backupFrequency: 'daily',
        maintenanceMode: false,
        debugMode: false
    },
    notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        attendanceAlerts: true,
        feeReminders: true,
        examResults: true
    }
});

onMounted(() => {
    loadSettings();
});

async function loadSettings() {
    try {
        loading.value = true;
        // Settings would be loaded from API
    } catch (error) {
        console.error('Failed to load settings:', error);
    } finally {
        loading.value = false;
    }
}

function saveSettings() {
    // Save settings to API
    console.log('Saving settings...');
}
</script>

<template>
    <div class="card mb-6">
        <div class="mb-5">
            <h5 class="mb-2">System Settings</h5>
            <span class="text-600">Configure school information, academic settings, and system preferences</span>
        </div>

        <TabView>
            <!-- School Settings Tab -->
            <TabPanel header="School Information">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="field">
                        <label for="schoolName" class="block text-600 font-medium mb-2">School Name</label>
                        <InputText id="schoolName" v-model="settings.school.name" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="schoolPhone" class="block text-600 font-medium mb-2">Phone Number</label>
                        <InputText id="schoolPhone" v-model="settings.school.phone" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="schoolEmail" class="block text-600 font-medium mb-2">Email Address</label>
                        <InputText id="schoolEmail" v-model="settings.school.email" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="schoolWebsite" class="block text-600 font-medium mb-2">Website</label>
                        <InputText id="schoolWebsite" v-model="settings.school.website" class="w-full" />
                    </div>
                    <div class="field md:col-span-2">
                        <label for="schoolAddress" class="block text-600 font-medium mb-2">Address</label>
                        <Textarea id="schoolAddress" v-model="settings.school.address" rows="3" class="w-full" />
                    </div>
                </div>
            </TabPanel>

            <!-- Academic Settings Tab -->
            <TabPanel header="Academic Settings">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="field">
                        <label for="currentTerm" class="block text-600 font-medium mb-2">Current Term</label>
                        <Dropdown id="currentTerm" v-model="settings.academic.currentTerm" :options="['Term 1', 'Term 2', 'Term 3']" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="currentYear" class="block text-600 font-medium mb-2">Academic Year</label>
                        <InputNumber id="currentYear" v-model="settings.academic.currentYear" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="termStartDate" class="block text-600 font-medium mb-2">Term Start Date</label>
                        <Calendar id="termStartDate" v-model="settings.academic.termStartDate" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="termEndDate" class="block text-600 font-medium mb-2">Term End Date</label>
                        <Calendar id="termEndDate" v-model="settings.academic.termEndDate" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="gradingScale" class="block text-600 font-medium mb-2">Grading Scale</label>
                        <Dropdown id="gradingScale" v-model="settings.academic.gradingScale" :options="['O-Level', 'A-Level', 'CSEE']" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="maxClassSize" class="block text-600 font-medium mb-2">Maximum Class Size</label>
                        <InputNumber id="maxClassSize" v-model="settings.academic.maxClassSize" class="w-full" />
                    </div>
                </div>
            </TabPanel>

            <!-- System Settings Tab -->
            <TabPanel header="System Configuration">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="field">
                        <label for="sessionTimeout" class="block text-600 font-medium mb-2">Session Timeout (minutes)</label>
                        <InputNumber id="sessionTimeout" v-model="settings.system.sessionTimeout" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="passwordPolicy" class="block text-600 font-medium mb-2">Password Policy</label>
                        <Dropdown id="passwordPolicy" v-model="settings.system.passwordPolicy" :options="['weak', 'medium', 'strong']" class="w-full" />
                    </div>
                    <div class="field">
                        <label for="backupFrequency" class="block text-600 font-medium mb-2">Backup Frequency</label>
                        <Dropdown id="backupFrequency" v-model="settings.system.backupFrequency" :options="['hourly', 'daily', 'weekly']" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Maintenance Mode</label>
                        <div class="flex align-items-center">
                            <Checkbox id="maintenanceMode" v-model="settings.system.maintenanceMode" binary />
                            <label for="maintenanceMode" class="ml-2">Enable maintenance mode</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Debug Mode</label>
                        <div class="flex align-items-center">
                            <Checkbox id="debugMode" v-model="settings.system.debugMode" binary />
                            <label for="debugMode" class="ml-2">Enable debug mode</label>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <!-- Notifications Tab -->
            <TabPanel header="Notifications">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Email Notifications</label>
                        <div class="flex align-items-center">
                            <Checkbox id="emailNotifications" v-model="settings.notifications.emailNotifications" binary />
                            <label for="emailNotifications" class="ml-2">Enable email notifications</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">SMS Notifications</label>
                        <div class="flex align-items-center">
                            <Checkbox id="smsNotifications" v-model="settings.notifications.smsNotifications" binary />
                            <label for="smsNotifications" class="ml-2">Enable SMS notifications</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Push Notifications</label>
                        <div class="flex align-items-center">
                            <Checkbox id="pushNotifications" v-model="settings.notifications.pushNotifications" binary />
                            <label for="pushNotifications" class="ml-2">Enable push notifications</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Attendance Alerts</label>
                        <div class="flex align-items-center">
                            <Checkbox id="attendanceAlerts" v-model="settings.notifications.attendanceAlerts" binary />
                            <label for="attendanceAlerts" class="ml-2">Send attendance alerts</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Fee Reminders</label>
                        <div class="flex align-items-center">
                            <Checkbox id="feeReminders" v-model="settings.notifications.feeReminders" binary />
                            <label for="feeReminders" class="ml-2">Send fee reminders</label>
                        </div>
                    </div>
                    <div class="field">
                        <label class="block text-600 font-medium mb-2">Exam Results</label>
                        <div class="flex align-items-center">
                            <Checkbox id="examResults" v-model="settings.notifications.examResults" binary />
                            <label for="examResults" class="ml-2">Notify exam results</label>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>

        <div class="flex justify-content-end gap-3 mt-6">
            <Button
                label="Reset to Defaults"
                icon="pi pi-refresh"
                class="p-button-outlined"
            />
            <Button
                label="Save Settings"
                icon="pi pi-save"
                class="p-button-success"
                @click="saveSettings"
            />
        </div>
    </div>
</template>
