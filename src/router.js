import { createWebHashHistory, createRouter } from 'vue-router'
import AssignmentsPage from './components/AssignmentsPage.vue'
import AssignmentCreatePage from './components/AssignmentCreatePage.vue'
import AssignmentInnerPage from './components/AssignmentInnerPage.vue'

const router = createRouter({
    history: createWebHashHistory('/redberry/'),
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
        },
        {
            path: '/assignmentPage',
            name: 'Assignment Inner Page',
            component: AssignmentInnerPage
        }
    ],
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router