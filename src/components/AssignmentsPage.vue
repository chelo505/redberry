<template>
  <div class="app">
    <h2 class="assignment-page-title">დავალებების გვერდი</h2>
    <div>
      <ul class="drop-downs">
        <li @click="showDepModal = true" class="department-dropdown">
          <div>დეპარტამენტი</div>
          <img :src="require('@/assets/Icon.svg')">
        </li>
        <li @click="showPrioModal = true" class="priority-dropdown">
          <div>პრიორიტეტი</div>
          <img :src="require('@/assets/IconBlack.svg')">
        </li>
        <li @click="showEmpModal = true" class="employee-dropdown">
          <div>თანამშრომელი</div>
          <img :src="require('@/assets/IconBlack.svg')">
        </li>
        <button @click="resetFilters" class="clear-filters-button">ფილტრების გაწმენდა</button>
      </ul>
      <ul class="filters">
        <li v-for="dep in filters.departments" v-bind:key="dep.id" class="department-filter">
          <span>{{ dep }}</span>
          <img @click="removeFromFilterDep(dep)" :src="require('@/assets/x.png')" class="dep-x">
        </li>
        <li v-for="prio in filters.priorities" v-bind:key="prio.id" class="priority-filter">
          <span>{{ prio }}</span>
          <img @click="removeFromFilterPrio(prio)" :src="require('@/assets/x.png')" class="dep-x">
        </li>
        <li v-if="filters.employees.length > 0" class="employee-filter">
          <span>{{ this.filters.employees }}</span>
          <img @click="removeEmployeesFilter" :src="require('@/assets/x.png')" class="dep-x">
        </li>
      </ul>
    </div>
    <div class="awaiting-start">
      <h2>დასაწყები</h2>
      <ul class="awaiting-start-grid">
        <li v-for="task in awaitingStart" v-bind:key="task.id" @click="goToInnerPage(task.id)" v-show="shouldDisplayTask(task)" class="awaiting-start-task">
            <img v-if="task.priority.id==1" :src="require('@/assets/low.png')" class="task-priority-icon">
            <img v-if="task.priority.id==2" :src="require('@/assets/medium.png')" class="task-priority-icon">
            <img v-if="task.priority.id==3" :src="require('@/assets/high.png')" class="task-priority-icon">
            <span class="task-department">{{ task.department.name.split(' ')[0] }}</span>
            <span class="task-deadline">{{ formatDateToGeorgian(task.due_date.split('T')[0]) }}</span>
            <span class="task-title">{{ task.name }}</span>
            <span class="task-description">{{ task.description }}</span>
            <img :src="require('@/assets/Comments.png')" class="task-comments-icon">
            <span class="task-comments">{{ task.total_comments }}</span>
            <img class="task-employee-avatar" :src="task.employee.avatar">
        </li>
      </ul>
    </div>
    <div class="inprogress-start">
      <h2>პროგრესში</h2>
      <ul class="inprogress-start-grid">
        <li v-for="task in inProgress" v-bind:key="task.id" @click="goToInnerPage(task.id)" v-show="shouldDisplayTask(task)" class="inprogress-start-task">
          <img v-if="task.priority.id==1" :src="require('@/assets/low.png')" class="task-priority-icon">
          <img v-if="task.priority.id==2" :src="require('@/assets/medium.png')" class="task-priority-icon">
          <img v-if="task.priority.id==3" :src="require('@/assets/high.png')" class="task-priority-icon">
          <span class="task-department">{{ task.department.name.split(' ')[0] }}</span>
          <span class="task-deadline">{{ formatDateToGeorgian(task.due_date.split('T')[0]) }}</span>
          <span class="task-title">{{ task.name }}</span>
          <span class="task-description">{{ task.description }}</span>
          <img :src="require('@/assets/Comments.png')" class="task-comments-icon">
          <span class="task-comments">{{ task.total_comments }}</span>
          <img class="task-employee-avatar" :src="task.employee.avatar">
        </li>
      </ul>
    </div>
    <div class="readyfortest-start">
      <h2>მზად ტესტირებისთვის</h2>
      <ul class="readyfortest-start-grid">
        <li v-for="task in readyForTesting" v-bind:key="task.id" @click="goToInnerPage(task.id)" v-show="shouldDisplayTask(task)" class="readyfortest-start-task">
          <img v-if="task.priority.id==1" :src="require('@/assets/low.png')" class="task-priority-icon">
          <img v-if="task.priority.id==2" :src="require('@/assets/medium.png')" class="task-priority-icon">
          <img v-if="task.priority.id==3" :src="require('@/assets/high.png')" class="task-priority-icon">
          <span class="task-department">{{ task.department.name.split(' ')[0] }}</span>
          <span class="task-deadline">{{ formatDateToGeorgian(task.due_date.split('T')[0]) }}</span>
          <span class="task-title">{{ task.name }}</span>
          <span class="task-description">{{ task.description }}</span>
          <img :src="require('@/assets/Comments.png')" class="task-comments-icon">
          <span class="task-comments">{{ task.total_comments }}</span>
          <img class="task-employee-avatar" :src="task.employee.avatar">
        </li>
      </ul>
    </div>
    <div class="done-start">
      <h2>დასრულებული</h2>
      <ul class="done-start-grid">
        <li v-for="task in done" v-bind:key="task.id" @click="goToInnerPage(task.id)" v-show="shouldDisplayTask(task)" class="done-start-task">
            <img v-if="task.priority.id==1" :src="require('@/assets/low.png')" class="task-priority-icon">
            <img v-if="task.priority.id==2" :src="require('@/assets/medium.png')" class="task-priority-icon">
            <img v-if="task.priority.id==3" :src="require('@/assets/high.png')" class="task-priority-icon">
            <span class="task-department">{{ task.department.name.split(' ')[0] }}</span>
            <span class="task-deadline">{{ formatDateToGeorgian(task.due_date.split('T')[0]) }}</span>
            <span class="task-title">{{ task.name }}</span>
            <span class="task-description">{{ task.description }}</span>
            <img :src="require('@/assets/Comments.png')" class="task-comments-icon">
            <span class="task-comments">{{ task.total_comments }}</span>
            <img class="task-employee-avatar" :src="task.employee.avatar">
        </li>
      </ul>
    </div>   
  </div>
  <Transition>
    <DepartmentsModal 
      :isVisible="showDepModal" 
      @close="showDepModal = false"
      @submit="getDepFilters"
    />
  </Transition>
  <Transition>
    <PrioritiesModal 
      :isVisible="showPrioModal" 
      @close="showPrioModal = false"
      @submit="getPrioFilters"
    />
  </Transition>
  <Transition>
    <EmployeesModal 
      :isVisible="showEmpModal" 
      @close="showEmpModal = false"
      @submit="getEmployeeFilters"
    />
  </Transition>
</template>

<script>
import axios from 'axios'
import DepartmentsModal from '@/modals/DepartmentsDropdownModal.vue'
import PrioritiesModal from '../modals/PrioritiesDropdownModal.vue'
import EmployeesModal from '@/modals/EmployeeDropdownModal.vue'
import router from '@/router'

export default {
  components: {
    DepartmentsModal,
    PrioritiesModal,
    EmployeesModal
  },
  data() {
    return {
      filters: {
        departments: [],
        priorities: [],
        employees: []
      },
      awaitingStart: [],
      inProgress: [],
      readyForTesting: [],
      done: [],
      token: "9e75ea39-cb24-4933-bcbc-2640b97d99f4",
      showDepModal: false,
      showPrioModal: false,
      showEmpModal: false
    }
  },
  beforeMount() {
    this.loadFiltersFromStorage()
    this.fetchTaskData()
  },
  methods: {
    async fetchTaskData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/tasks/", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(err => console.log(err))
      for (let task of response.data) {
        if (task.status.id == 1) this.awaitingStart.push(task)
        if (task.status.id == 2) this.inProgress.push(task)
        if (task.status.id == 3) this.readyForTesting.push(task)
        if (task.status.id == 4) this.done.push(task)
      }
    },
    loadFiltersFromStorage() {
      this.filters.departments = sessionStorage.getItem('depFilters') 
        ? JSON.parse(sessionStorage.getItem('depFilters')) 
        : []
      this.filters.priorities = sessionStorage.getItem('prioFilters') 
        ? JSON.parse(sessionStorage.getItem('prioFilters')) 
        : []
        this.filters.employees = sessionStorage.getItem('empFilters') 
        ? JSON.parse(sessionStorage.getItem('empFilters')) 
        : []
    },
    getDepFilters(filters) {
      this.filters.departments = []
      this.filters.departments = filters
      sessionStorage.setItem('depFilters', JSON.stringify(this.filters.departments))
    },
    getPrioFilters(filters) {
      this.filters.priorities = []
      this.filters.priorities = filters
      sessionStorage.setItem('prioFilters', JSON.stringify(this.filters.priorities))
    },
    getEmployeeFilters(filters) {
      this.filters.employees = []
      this.filters.employees = filters
      sessionStorage.setItem('empFilters', JSON.stringify(this.filters.employees))
    },
    shouldDisplayTask(task) {
    const { departments, priorities, employees } = this.filters

    if (departments.length === 0 && priorities.length === 0 && employees.length === 0) {
      return true
    }
    if (departments.length > 0 && priorities.length === 0 && employees.length === 0) {
      return departments.includes(task.department.name)
    }
    if (priorities.length > 0 && departments.length === 0 && employees.length === 0) {
      return priorities.includes(task.priority.name)
    }
    if (employees.length > 0 && departments.length === 0 && priorities.length === 0) {
      const taskFullName = `${task.employee.name} ${task.employee.surname}`
      return employees.includes(taskFullName)
    }
    if (departments.length > 0 && priorities.length > 0 && employees.length === 0) {
      return departments.includes(task.department.name) && priorities.includes(task.priority.name)
    }
    if (priorities.length > 0 && employees.length > 0 && departments.length === 0) {
      const taskFullName = `${task.employee.name} ${task.employee.surname}`
      return employees.includes(taskFullName) && priorities.includes(task.priority.name)
    }
    if (departments.length > 0 && employees.length > 0 && priorities.length === 0) {
      const taskFullName = `${task.employee.name} ${task.employee.surname}`
      return departments.includes(task.department.name) && employees.includes(taskFullName)
    }
    if (departments.length > 0 && employees.length > 0 && priorities.length > 0) {
      const taskFullName = `${task.employee.name} ${task.employee.surname}`
      return departments.includes(task.department.name) && 
              priorities.includes(task.priority.name) && 
              employees.includes(taskFullName)
    }
    return false
    },
    formatDateToGeorgian(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const georgianMonths = [
      'იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 
      'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'
    ]
    return `${day} ${georgianMonths[month]}, ${year}`
  },
  resetFilters() {
    this.filters.departments = []
    this.filters.priorities = []
    this.filters.employees = []
    sessionStorage.setItem('prioFilters', [])
    sessionStorage.setItem('depFilters', [])
    sessionStorage.setItem('empFilters', [])
  },
  goToInnerPage(task) {
    router.push({
      path: '/assignmentPage',
      query: {
        task: task
      }
    }
  )
    sessionStorage.setItem('prioFilters', [])
    sessionStorage.setItem('depFilters', [])
    sessionStorage.setItem('empFilters', [])
  },
  removeFromFilterDep(dep) {
    this.filters.departments = this.filters.departments.filter(d => d != dep)
    sessionStorage.setItem('depFilters', JSON.stringify(this.filters.departments))
  },
  removeFromFilterPrio(prio) {
    this.filters.priorities = this.filters.priorities.filter(p => p != prio)
    sessionStorage.setItem('prioFilters', JSON.stringify(this.filters.priorities))
  },
  removeEmployeesFilter() {
    this.filters.employees = []
    sessionStorage.setItem('empFilters', [])
  }
  }
}
</script>

<style src="F:\vscodes\redberry\src\styles\AssignmentsPage.css">
</style>
