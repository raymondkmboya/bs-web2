<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/'
            }
        ]
    },
    {
        label: 'Student Management',
        icon: 'pi pi-fw pi-users',
        path: '/students',
        items: [
            {
                label: 'Student Registration',
                icon: 'pi pi-fw pi-user-plus',
                to: '/students/registration',
                description: 'Register new students for admission'
            },
            {
                label: 'Student Admission',
                icon: 'pi pi-fw pi-check-circle',
                to: '/students/admission',
                description: 'Manage student admission process'
            },
            {
                label: 'Student Attendance',
                icon: 'pi pi-fw pi-list',
                to: '/students/attendance',
                description: 'Track and manage student attendance'
            },
            // {
            //     label: 'Student Register',
            //     icon: 'pi pi-fw pi-book',
            //     to: '/students/register',
            //     description: 'View and manage student register'
            // },
            // {
            //     label: 'Student Profile',
            //     icon: 'pi pi-fw pi-id-card',
            //     to: '/students/profile',
            //     description: 'View individual student profiles'
            // }
        ]
    },
    {
        label: 'Front Office',
        icon: 'pi pi-fw pi-briefcase',
        path: '/front-office',
        items: [
            {
                label: 'Enquiries',
                icon: 'pi pi-fw pi-search',
                to: '/front-office/enquiry',
                description: 'Manage prospective student leads and follow-ups'
            },
            {
                label: 'Adverts',
                icon: 'pi pi-fw pi-id-card',
                to: '/front-office/adverts',
                description: 'Manage school advertisements and promotions'
            },
            {
                label: 'Front Office Management',
                icon: 'pi pi-fw pi-users',
                to: '/front-office/front-office',
                description: 'Manage visitors, postal dispatch, and appointments'
            }
        ]
    },
    {
        label: 'Academics',
        icon: 'pi pi-fw pi-graduation-cap', // Changed to graduation cap for academic context
        path: '/academics',
        items: [
            {
                label: 'Class Management',
                icon: 'pi pi-fw pi-sitemap', // Visualizes hierarchy
                to: '/academics/class-management',
                description: 'Manage academic levels, streams, classrooms, and class teachers'
            },
            {
                label: 'Subjects Management',
                icon: 'pi pi-fw pi-book', // Book icon for subjects
                to: '/academics/subjects-management',
                description: 'Manage academic subjects and subject teacher assignments'
            },
            {
                label: 'Timetable',
                icon: 'pi pi-fw pi-calendar-clock', // Specific to scheduling
                to: '/academics/timetable'
            },
            {
                label: 'Assessments',
                icon: 'pi pi-fw pi-copy', // Grouping exams and grading
                to: '/academics/assessment',
                description: 'Manage examinations, results, and grading systems'
            },
        ]
    },
    {
        label: 'Fees',
        icon: 'pi pi-fw pi-money-bill',
        path: '/fees',
        items: [
            {
                label: 'Fee Management',
                icon: 'pi pi-fw pi-cog',
                to: '/fees/management',
                description: 'Manage fee groups and allocations'
            },
            {
                label: 'Fee Collections',
                icon: 'pi pi-fw pi-wallet',
                to: '/fees/collections',
                description: 'Track fee payments and collections'
            }
        ]
    },
    {
        label: 'Administration',
        icon: 'pi pi-fw pi-cog',
        path: '/administration',
        items: [
            {
                label: 'Human Resources',
                icon: 'pi pi-fw pi-users',
                to: '/administration/human-resources',
                description: 'Manage staff, departments, attendance, and leave records'
            },
            {
                label: 'Users & Permissions',
                icon: 'pi pi-fw pi-user-edit',
                to: '/administration/users',
                description: 'Manage user accounts and system permissions'
            },
            {
                label: 'System Settings',
                icon: 'pi pi-fw pi-cog',
                to: '/administration/settings',
                description: 'Configure system settings and preferences'
            },
            {
                label: 'Audit Logs',
                icon: 'pi pi-fw pi-history',
                to: '/administration/audit',
                description: 'View system activity and audit logs'
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
