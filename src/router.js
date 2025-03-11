import { createWebHistory, createRouter } from 'vue-router'
import AssignmentsPage from './components/AssignmentsPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Assignments Page',
            component: AssignmentsPage
        }
    ]
})

export default router