import { createWebHistory, createRouter } from 'vue-router'
import AssignmentsPage from './components/AssignmentsPage.vue'
import AssignmentCreatePage from './components/AssignmentCreatePage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Assignments Page',
            component: AssignmentsPage
        },
        {
            path: '/createAssignment',
            name: 'Create Assignment',
            component: AssignmentCreatePage
        }
    ]
})

export default router