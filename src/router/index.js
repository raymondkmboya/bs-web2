import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/blocks/free',
                    name: 'blocks',
                    meta: {
                        breadcrumb: ['Prime Blocks', 'Free Blocks']
                    },
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/students/registration',
                    name: 'student-registration',
                    component: () => import('@/views/students/Registration.vue')
                },
                {
                    path: '/students/admission',
                    name: 'student-admission',
                    component: () => import('@/views/students/Admission.vue')
                },
                {
                    path: '/students/profile/:id',
                    name: 'student-profile',
                    component: () => import('@/views/students/StudentProfile.vue')
                },
                {
                    path: '/front-office/enquiry',
                    name: 'front-office-enquiry',
                    component: () => import('@/views/frontoffice/Enquiry.vue')
                },
                {
                    path: '/front-office/front-office',
                    name: 'front-office-management',
                    component: () => import('@/views/frontoffice/FrontOffice.vue')
                },
                {
                    path: '/front-office/adverts',
                    name: 'front-office-advert',
                    component: () => import('@/views/frontoffice/Advert.vue')
                },
                {
                    path: '/fees/management',
                    name: 'fee-management',
                    component: () => import('@/views/fees/FeeManagement.vue')
                },
                {
                    path: '/fees/collections',
                    name: 'fee-collections',
                    component: () => import('@/views/fees/FeeCollections.vue')
                },
                {
                    path: '/academics/class-management',
                    name: 'class-management',
                    component: () => import('@/views/academics/ClassManagement.vue')
                },
                {
                    path: '/academics/subjects-management',
                    name: 'subjects-management',
                    component: () => import('@/views/academics/SubjectsManagement.vue')
                },
                {
                    path: '/academics/timetable',
                    name: 'timetable',
                    component: () => import('@/views/academics/Timetable.vue')
                },
                {
                    path: '/academics/assessment',
                    name: 'assessment',
                    component: () => import('@/views/academics/Assessment.vue')
                },
                {
                    path: '/administration/human-resources',
                    name: 'human-resources',
                    component: () => import('@/views/administration/HumanResources.vue')
                },
                {
                    path: '/administration/users',
                    name: 'administration-users',
                    component: () => import('@/views/administration/Users.vue')
                },
                {
                    path: '/administration/settings',
                    name: 'administration-settings',
                    component: () => import('@/views/administration/Settings.vue')
                },
                {
                    path: '/administration/audit',
                    name: 'administration-audit',
                    component: () => import('@/views/administration/AuditLogs.vue')
                },
                {
                    path: '/students/attendance',
                    name: 'students-attendance',
                    component: () => import('@/views/students/Attendance.vue')
                },
                {
                    path: '/students/register',
                    name: 'students-register',
                    component: () => import('@/views/students/Register.vue')
                },
                {
                    path: '/compass',
                    redirect: '/academics/class-management'
                },
                {
                    path: '/start/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Routes that don't require authentication
    const publicRoutes = ['login', 'landing', 'notfound', 'accessDenied', 'error'];

    if (publicRoutes.includes(to.name)) {
        // If user is already authenticated and trying to access login, redirect to dashboard
        if (to.name === 'login' && authStore.isLoggedIn) {
            next('/');
        } else {
            next();
        }
    } else {
        // Protected routes - require authentication
        if (authStore.isLoggedIn) {
            next();
        } else {
            // Try to initialize auth from localStorage
            await authStore.initAuth();

            // Check again after initialization
            if (authStore.isLoggedIn) {
                next();
            } else {
                next('/auth/login');
            }
        }
    }
});

export default router;
