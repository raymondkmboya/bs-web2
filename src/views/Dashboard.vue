<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StudentCategoryWidget from '@/components/dashboard/StudentCategoryWidget.vue';
import StudentTreeWidget from '@/components/dashboard/StudentTreeWidget.vue';
import FeeCollectionsWidget from '@/components/dashboard/FeeCollectionsWidget.vue';
import FeeTreeWidget from '@/components/dashboard/FeeTreeWidget.vue';
import StudentRegistrationWidget from '@/components/dashboard/StudentRegistrationWidget.vue';
import StudentDemographicsWidget from '@/components/dashboard/StudentDemographicsWidget.vue';
import RegistrationStats from '@/components/students/RegistrationStats.vue';
import AdmissionStats from '@/components/students/AdmissionStats.vue';
import EnquiryStats from '@/components/frontoffice/EnquiryStats.vue';
import FeeCollectionsStats from '@/components/fees/FeeCollectionsStats.vue';

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const apiResult = ref(null)
const apiError = ref(null)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}

const testClassroomsAPI = async () => {
  loading.value = true
  apiResult.value = null
  apiError.value = null

  try {
    const response = await axios.get('/academics/classrooms')
    apiResult.value = response.data
  } catch (error) {
    apiError.value = error.response?.data || error.message
  } finally {
    loading.value = false
  }
}

const createClassroom = async () => {
  loading.value = true
  apiResult.value = null
  apiError.value = null

  try {
    const newClassroom = {
      name: 'Vue Test Classroom',
      room_number: 'VUE-001',
      capacity: 25,
      building: 'Test Building',
      floor: 'Test Floor',
      classroom_type: 'general',
      status: 'active',
      description: 'Created from Vue frontend test',
      facilities: ['whiteboard', 'projector']
    }

    const response = await axios.post('/academics/classrooms', newClassroom)
    apiResult.value = response.data
  } catch (error) {
    apiError.value = error.response?.data || error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <!-- Header with user info and logout -->
        <div class="col-span-12 mb-6">
            <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p class="text-gray-600">Welcome, {{ authStore.currentUser?.name || 'User' }}!</p>
                </div>
                <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
                    Logout
                </button>
            </div>
        </div>

        <!-- Registration Stats -->
        <div class="col-span-12">
            <RegistrationStats />
        </div>

        <!-- Admission Stats -->
        <div class="col-span-12">
            <AdmissionStats />
        </div>

        <!-- Enquiry Stats -->
        <div class="col-span-12">
            <EnquiryStats />
        </div>

        <!-- Fee Collections Stats -->
        <div class="col-span-12">
            <FeeCollectionsStats />
        </div>

        <div class="col-span-12 xl:col-span-6">
            <StudentTreeWidget />
            <NotificationsWidget />
            <StudentCategoryWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <FeeCollectionsWidget />
            <FeeTreeWidget />
            <StudentDemographicsWidget />
            <StudentRegistrationWidget />
        </div>

        <div class="col-span-12 xl:col-span-6">
            <BestSellingWidget />
            <RecentSalesWidget />
            <RevenueStreamWidget />
        </div>

    </div>
</template>
