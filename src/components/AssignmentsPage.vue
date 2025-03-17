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
        <li @click="showCustomModal = true" class="employee-dropdown">
          <div>თანამშრომელი</div>
          <img :src="require('@/assets/IconBlack.svg')">
        </li>
      </ul>
    </div>
    <div class="awaiting-start">
      <h2>დასაწყები</h2>
      <ul class="awaiting-start-grid">
        <li v-for="task in awaitingStart" v-bind:key="task.id" v-show="shouldDisplayTask(task)" class="awaiting-start-task">
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
        <li v-for="task in inProgress" v-bind:key="task.id" v-show="shouldDisplayTask(task)" class="inprogress-start-task">
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
        <li v-for="task in readyForTesting" v-bind:key="task.id" v-show="shouldDisplayTask(task)" class="readyfortest-start-task">
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
        <li v-for="task in done" v-bind:key="task.id" v-show="shouldDisplayTask(task)" class="done-start-task">
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
</template>

<script>
import axios from 'axios'
import DepartmentsModal from '@/components/DepartmentsDropdownModal.vue'
import PrioritiesModal from './PrioritiesDropdownModal.vue'

export default {
  components: {
    DepartmentsModal,
    PrioritiesModal
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
      token: "9e6af86e-8086-496a-8001-5919972b5772",
      showDepModal: false,
      showPrioModal: false,
      showEmployeeModal: false
    }
  },
  created() {
    this.fetchTaskData()
  },
  methods: {
    getDepFilters(filters) {
      this.filters.departments = []
      this.filters.departments = filters
    },
    getPrioFilters(filters) {
      this.filters.priorities = []
      this.filters.priorities = filters
    },
    shouldDisplayTask(task) {
    if (this.filters.departments.length == 0 && this.filters.priorities.length == 0 && this.filters.employees == 0) {
      return true
    }
    if (this.filters.departments.length > 0 && this.filters.priorities.length == 0 && this.filters.employees.length == 0) {
      return this.filters.departments.includes(task.department.id)
    }
    if (this.filters.priorities.length > 0 && this.filters.departments.length == 0 && this.filters.employees.length == 0) {
      return this.filters.priorities.includes(task.priority.id)
    }
    if (this.filters.employees.length > 0 && this.filters.departments.length == 0 && this.filters.priorities.length == 0) {
      return this.filters.employees.includes(task.employee.id)
    }
    if (this.filters.departments.length > 0 && this.filters.priorities.length > 0) {
      return this.filters.departments.includes(task.department.id)&&this.filters.priorities.includes(task.priority.id)
    }
    if (this.filters.priorities.length > 0 && this.filters.employees.length > 0) {
      return this.filters.employees.includes(task.employee.id)&&this.filters.priorities.includes(task.priority.id)
    }
    if (this.filters.departments.length > 0 && this.filters.employees.length > 0) {
      return this.filters.departments.includes(task.department.id)&&this.filters.employees.includes(task.employee.id)
    }
    if (this.filters.departments.length > 0 && this.filters.employees.length > 0 && this.filters.priorities.length > 0) {
      return this.filters.departments.includes(task.department.id)&&this.filters.priorities.includes(task.priority.id)&&this.filters.employees.includes(task.employee.id)
    }
  },
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
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.assignment-page-title {
  position: relative;
  width: 374px;
  height: 41px;
  top: 120px;
  left: 118px;
  font-weight: 600;
  font-size: 33px;
  line-height: 100%;
  letter-spacing: 0%;
}

.drop-downs {
  list-style: none;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: start;
  width: 688px;
  height: 44px;
  top: 160px;
  left: 120px;
  gap: 45px;
  border: 1px solid #DEE2E6;
  border-radius: 10px;
}

.department-dropdown {
  width: 199px;
  height: 44px;
  border-radius: 5px;
  margin-left: 5px
}

.priority-dropdown {
  width: 199px;
  height: 44px;
  border-radius: 5px;
  margin-left: 5px
}

.employee-dropdown {
  width: 199px;
  height: 44px;
  border-radius: 5px;
  margin-left: 5px
}

.department-dropdown div {
  width: 119px;
  height: 19px;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #8338EC;
  margin-top: 13px;
  margin-left: 15px
}

.priority-dropdown div {
  width: 119px;
  height: 19px;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #0D0F10;
  margin-top: 13px;
  margin-left: 15px
}

.employee-dropdown div {
  width: 119px;
  height: 19px;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #0D0F10;
  margin-top: 13px;
  margin-left: 15px
}

.department-dropdown img {
  position: absolute;
  width: 24px;
  height: 24px;
  margin-left: 140px;
  margin-bottom: 80px;
  top: 10px
}

.priority-dropdown img {
  position: absolute;
  width: 24px;
  height: 24px;
  margin-left: 132px;
  margin-bottom: 80px;
  top: 10px
}

.employee-dropdown img {
  position: absolute;
  width: 24px;
  height: 24px;
  margin-left: 145px;
  margin-bottom: 80px;
  top: 10px
}

.awaiting-start-grid {
  width: 381px;
  height: auto;
  top: 376px;
  left: 120px;
  border-radius: 10px;
  margin-bottom: 30px
}

.inprogress-start-grid {
  width: 381px;
  height: auto;
  top: 376px;
  left: 120px;
  border-radius: 10px;
  margin-bottom: 30px
}

.readyfortest-start-grid {
  width: 381px;
  height: auto;
  top: 376px;
  left: 120px;
  border-radius: 10px;
  margin-bottom: 30px
}

.done-start-grid {
  width: 381px;
  height: auto;
  top: 376px;
  left: 120px;
  border-radius: 10px;
  margin-bottom: 30px
}

.awaiting-start {
  position: relative;
  width: 381px;
  height: 14px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  top: 210px;
  left: 118px;
  text-align: center;
  justify-content: center;
  background: #F7BC30;
  grid-template-rows: auto;
}

.inprogress-start {
  position: relative;
  width: 381px;
  height: 14px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  top: 166px;
  left: 568px;
  text-align: center;
  justify-content: center;
  background: #FB5607;
  grid-template-rows: auto;
}

.readyfortest-start {
  position: relative;
  width: 381px;
  height: 14px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  top: 122px;
  left: 1018px;
  text-align: center;
  justify-content: center;
  background: var(--Pink, #FF006E);
  grid-template-rows: auto;
}

.done-start {
  position: relative;
  width: 381px;
  height: 14px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  top: 78px;
  left: 1468px;
  text-align: center;
  justify-content: center;
  background: #3A86FF;
  grid-template-rows: auto;
}

.awaiting-start h2 {
  width: 107;
  height: 24;
  font-weight: 500;
  font-size: 20px;
  line-height: 70%;
  letter-spacing: 0%;
  color: white
}

.inprogress-start h2 {
  width: 107;
  height: 24;
  font-weight: 500;
  font-size: 20px;
  line-height: 70%;
  letter-spacing: 0%;
  color: white
}

.readyfortest-start h2 {
  width: 107;
  height: 24;
  font-weight: 500;
  font-size: 20px;
  line-height: 70%;
  letter-spacing: 0%;
  color: white
}

.done-start h2 {
  width: 107;
  height: 24;
  font-weight: 500;
  font-size: 20px;
  line-height: 70%;
  letter-spacing: 0%;
  color: white
}

.awaiting-start-task {
  display: grid;
  list-style: none;
  width: 340px;
  height: 176px;
  border-radius: 15px;
  margin-top: 35px;
  margin-bottom: 20px;
  border-width: 1px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid #F7BC30;
  justify-content: center;
}

.inprogress-start-task {
  display: grid;
  list-style: none;
  width: 340px;
  height: 176px;
  border-radius: 15px;
  margin-top: 35px;
  margin-bottom: 20px;
  border-width: 1px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid #FB5607;
  justify-content: center;
}

.readyfortest-start-task {
  display: grid;
  list-style: none;
  width: 340px;
  height: 176px;
  border-radius: 15px;
  margin-top: 35px;
  margin-bottom: 20px;
  border-width: 1px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid var(--Pink, #FF006E);
  justify-content: center;
}

.done-start-task {
  display: grid;
  list-style: none;
  width: 340px;
  height: 176px;
  border-radius: 15px;
  margin-top: 35px;
  margin-bottom: 20px;
  border-width: 1px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid #3A86FF;
  justify-content: center;
}

.awaiting-start-task .task-title {
  width: 320px;
  height: 18px;
  padding: 5px;
  font-weight: 600;
  text-align: left;
  margin-left: 30px;
}

.inprogress-start-task .task-title {
  width: 320px;
  height: 18px;
  padding: 5px;
  font-weight: 600;
  text-align: left;
  margin-left: 30px;
}

.readyfortest-start-task .task-title {
  width: 320px;
  height: 18px;
  padding: 5px;
  font-weight: 600;
  text-align: left;
  margin-left: 30px;
}

.done-start-task .task-title {
  width: 320px;
  height: 18px;
  padding: 5px;
  font-weight: 600;
  text-align: left;
  margin-left: 30px;
}

.awaiting-start-task .task-description {
  line-clamp: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 320px;
  max-height: 23px;
  margin-top: 10px;
  text-align: left;
  margin-left: 30px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 5px;
}

.inprogress-start-task .task-description {
  line-clamp: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 320px;
  max-height: 23px;
  margin-top: 10px;
  text-align: left;
  margin-left: 30px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 5px;
}

.readyfortest-start-task .task-description {
  line-clamp: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 320px;
  max-height: 23px;
  margin-top: 10px;
  text-align: left;
  margin-left: 30px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 5px;
}

.done-start-task .task-description {
  line-clamp: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 320px;
  max-height: 23px;
  margin-top: 10px;
  text-align: left;
  margin-left: 30px;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  padding: 5px;
}

.awaiting-start-task .task-priority-icon {
  margin-right: 20px;
  margin-top: -10px;
  padding: 5px
}

.inprogress-start-task .task-priority-icon {
  margin-right: 20px;
  margin-top: -10px;
  padding: 5px
}

.readyfortest-start-task .task-priority-icon {
  margin-right: 20px;
  margin-top: -10px;
  padding: 5px
}

.done-start-task .task-priority-icon {
  margin-right: 20px;
  margin-top: -10px;
  padding: 5px
}

.awaiting-start-task .task-department {
  margin-left: 100px;
  margin-top: -35px;
  width: 108px;
  height: 24px;
  font-weight: 400;
  font-size: 12px;
  color: white;
  background: #F7BC30;
  border-radius: 50px;
  padding: 1px;
  line-height: 22px;
}

.inprogress-start-task .task-department {
  margin-left: 100px;
  margin-top: -35px;
  width: 108px;
  height: 24px;
  font-weight: 400;
  font-size: 12px;
  color: white;
  background: #FB5607;
  border-radius: 50px;
  padding: 1px;
  line-height: 22px;
}

.readyfortest-start-task .task-department {
  margin-left: 100px;
  margin-top: -35px;
  width: 108px;
  height: 24px;
  font-weight: 400;
  font-size: 12px;
  color: white;
  background: var(--Pink, #FF006E);
  border-radius: 50px;
  padding: 1px;
  line-height: 22px;
}

.done-start-task .task-department {
  margin-left: 100px;
  margin-top: -35px;
  width: 108px;
  height: 24px;
  font-weight: 400;
  font-size: 12px;
  color: white;
  background: #3A86FF;
  border-radius: 50px;
  padding: 1px;
  line-height: 22px;
}

.awaiting-start-task .task-deadline {
  width: 76px;
  height: 14px;
  margin-left: 250px;
  margin-top: -32px;
  font-size: 13px;
}

.inprogress-start-task .task-deadline {
  width: 76px;
  height: 14px;
  margin-left: 250px;
  margin-top: -32px;
  font-size: 13px;
}

.readyfortest-start-task .task-deadline {
  width: 76px;
  height: 14px;
  margin-left: 250px;
  margin-top: -32px;
  font-size: 13px;
}

.done-start-task .task-deadline {
  width: 76px;
  height: 14px;
  margin-left: 250px;
  margin-top: -32px;
  font-size: 13px;
}

.awaiting-start-task .task-comments-icon {
  margin-left: 320px;
  margin-top: 50px
}

.inprogress-start-task .task-comments-icon {
  margin-left: 320px;
  margin-top: 50px
}

.readyfortest-start-task .task-comments-icon {
  margin-left: 320px;
  margin-top: 50px
}

.done-start-task .task-comments-icon {
  margin-left: 320px;
  margin-top: 50px
}

.awaiting-start-task .task-comments {
  margin-left: 345px;
  margin-top: -22px
}

.inprogress-start-task .task-comments {
  margin-left: 345px;
  margin-top: -22px
}

.readyfortest-start-task .task-comments {
  margin-left: 345px;
  margin-top: -22px
}

.done-start-task .task-comments {
  margin-left: 345px;
  margin-top: -22px
}

.awaiting-start-task .task-employee-avatar {
  border-radius: 50%;
  width: 31px;
  height: 31px;
  margin-top: -29px;
  margin-left: 10px
}

.inprogress-start-task .task-employee-avatar {
  border-radius: 50%;
  width: 31px;
  height: 31px;
  margin-top: -29px;
  margin-left: 10px
}

.readyfortest-start-task .task-employee-avatar {
  border-radius: 50%;
  width: 31px;
  height: 31px;
  margin-top: -29px;
  margin-left: 10px
}

.done-start-task .task-employee-avatar {
  border-radius: 50%;
  width: 31px;
  height: 31px;
  margin-top: -29px;
  margin-left: 10px
}
</style>
