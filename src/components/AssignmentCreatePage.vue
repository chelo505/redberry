<template>
  <div class="app">
      <h1 class="page-title">შექმენი ახალი დავალება</h1>
      <div class="form-container">
        <form @submit.prevent="submitForm">
        <div class="form-left-container">
          <div class="form-title field-group">
            <label>სათაური*</label>
            <input 
              @input="checkMoreThan" 
              type="text" 
              v-model="formData.name" 
              class="form-title-select" 
              :class="{ 'error-border': errors.name }"
            >
            <div class="requirements">
              <small class="requirement" :class="{ 'valid': formData.name.length >= 3 }">
                <span class="check-icon">✔️</span> მინიმუმ 3 სიმბოლო
              </small>
              <small class="requirement" :class="{ 'valid': formData.name.length <= 255 }">
                <span class="check-icon">✔️</span> მაქსიმუმ 255 სიმბოლო
              </small>
            </div>
          </div>
          <div class="form-description field-group">
            <label>აღწერა</label>
            <textarea 
              @input="checkMoreThan" 
              v-model="formData.description" 
              class="form-control"
              :class="{ 'error-border': errors.description }"
            ></textarea>
            <div class="requirements">
              <small class="requirement" :class="{ 'valid': descriptionWordCount >= 4 }">
                <span class="check-icon">✔️</span> მინიმუმ 4 სიტყვა
              </small>
              <small class="requirement" :class="{ 'valid': formData.description.length <= 255 }">
                <span class="check-icon">✔️</span> მაქსიმუმ 255 სიმბოლო
              </small>
            </div>
          </div>
          <div class="form-priority field-group">
            <label>პრიორიტეტი*</label>
            <div class="priority-wrapper" :class="{ 'error-border': errors.priority }">
              <div class="custom-select" @click="toggleIcons">
                <img class='priority-icon-default' :src="getSelectedPriorityName()[1]">
                <span class="priority-default">{{ getSelectedPriorityName()[0] }}</span>
                <img class="dropdown-arrow" :src="require('@/assets/IconBlack.svg')">
              </div>
              <div v-show="showIcons" class="priority-icons-container">
                <div 
                  v-for="prio in priorities" 
                  :key="prio.id" 
                  class="priority-item"
                  @click="selectPriority(prio)"
                >
                  <img :src="prio.icon" class="priority-icon">
                  <span>{{ prio.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-status field-group">
            <label>სტატუსი*</label>
            <select 
              @change="saveStatus" 
              v-model="formData.status" 
              class="form-status-select"
              :class="{ 'error-border': errors.status }"
            >
              <option v-for="s in statuses" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-right-container">
          <div class="form-department field-group">
            <label>დეპარტამენტი*</label>
            <select 
              @change="updateEmployees" 
              v-model="formData.department" 
              class="form-department-select" 
              :class="{ 'error-border': errors.department }"

            >
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div v-show="departmentSelected" class="form-employee field-group">
            <label>პასუხისმგებელი თანამშრომელი*</label>
            <div class="employee-wrapper">
              <div class="custom-select-employee" @click="toggleAvatars" :class="{ 'error-border': errors.employees }">
                <img :src="getSelectedEmployeeName()[1]" class="selected-employee-avatar">
                <span class="selected-employee-name">{{ getSelectedEmployeeName()[0] }}</span>
                <img class="dropdown-arrow" :src="require('@/assets/IconBlack.svg')">
              </div>
              <div v-show="showAvatars" class="employee-avatars-container">
                <button @click="showEmployeeModal = true" class="employee-create-button">თანამშრომლის შექმნა</button>
                <div 
                  v-for="emp in selectedDepEmployees" 
                  :key="emp.id" 
                  @click="selectEmployee(emp.id)"
                >
                  <img :src="emp.avatar" class="employee-avatar">
                  <span class="employee-name">{{ emp.name + " " }} {{ emp.surname }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-deadline field-group">
            <label>დედლაინი*</label>
            <input 
              @change="validateDate" 
              type="date" 
              v-model="formData.deadline" 
              class="form-deadline-input" 
              :class="{ 'error-border': errors.deadline }"         
            >
          </div>
          <div class="button-container">
            <button @click="submitForm" type="submit" class="submit-button">დავალების შექმნა</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <Transition mode="in-out" fade>
    <EmployeeModal 
      :showModal="showEmployeeModal" 
      @close="showEmployeeModal = false"
      @employee-created="handleEmployeeCreated"
    />
  </Transition>
</template>

<script>
import axios from 'axios'
import EmployeeModal from '../modals/EmployeeModal.vue'
import router from '@/router'

export default {
  components: {
    EmployeeModal
  },
  data() {
    return {
      formData: {
        name: '',
        department: '',
        description: '',
        priority: '',
        status: '',
        deadline: '',
        employees: '',
      },
      errors: {
        name: false,
        description: false,
        priority: false,
        status: false,
        department: false,
        employees: false,
        deadline: false
      },
      departments: [],
      priorities: [],
      employees: [],
      selectedDepEmployees: [],
      statuses: [],
      departmentSelected: false,
      selectedDepartment: null,
      token: "9e75ea39-cb24-4933-bcbc-2640b97d99f4",
      defaultPrio: '',
      defaultStatus: '',
      showIcons: false,
      showAvatars: false,
      showEmployeeModal: false
    }
  },
  created() {
    this.fetchDepartmentData()
    this.fetchPrioritiesData()
    this.fetchEmployeesData()
    this.fetchStatusesData()
    if (sessionStorage.getItem('department'))
      this.formData.department = JSON.parse(sessionStorage.getItem('department'))
    if (sessionStorage.getItem('depSelected'))
      this.departmentSelected = JSON.parse(sessionStorage.getItem('depSelected'))
    if (sessionStorage.getItem('employee'))
      this.formData.employees = JSON.parse(sessionStorage.getItem('employee'))
    if (sessionStorage.getItem('selectedDepEmployees'))
      this.selectedDepEmployees = JSON.parse(sessionStorage.getItem('selectedDepEmployees'))
    if (sessionStorage.getItem('name'))
      this.formData.name = JSON.parse(sessionStorage.getItem('name'))
    if (sessionStorage.getItem('desc'))
      this.formData.description = JSON.parse(sessionStorage.getItem('desc'))
    if (sessionStorage.getItem('deadline'))
      this.formData.deadline = JSON.parse(sessionStorage.getItem('deadline'))
    else this.formData.deadline = this.getTomorrowDate()
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('click', this.handleClickOutsideEmp)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('click', this.handleClickOutsideEmp)
  },
  computed: {
    descriptionWordCount() {
      return this.formData.description.trim().split(" ").filter(word => word.length > 0).length
    }
  },
  methods: {
    async fetchDepartmentData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/departments")
      .catch(error => console.log(error))
      this.departments = response.data
    },
    async fetchPrioritiesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/priorities")
      .catch(error => console.log(error))
      this.priorities = response.data
      for (let prio of this.priorities) {
        if (prio.name == 'საშუალო') {
          this.defaultPrio = prio
          if (sessionStorage.getItem('priority'))
            this.formData.priority = JSON.parse(sessionStorage.getItem('priority'))
          else  this.formData.priority = this.defaultPrio
        }
      }
    },
    async fetchEmployeesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/employees/", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(error => console.log(error))
      this.employees = response.data
    },
    async fetchStatusesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/statuses")
      .catch(error => console.log(error))
      this.statuses = response.data
      for (let stat of this.statuses) {
        if (stat.name == 'დასაწყები') {
          this.defaultStatus = stat
          if (sessionStorage.getItem('status'))
            this.formData.status = JSON.parse(sessionStorage.getItem('status'))
          else this.formData.status = this.defaultStatus.id
        }
      }
    },
    toggleIcons(event) {
      event.stopPropagation()
      this.showIcons = !this.showIcons
    },
    toggleAvatars(event) {
      event.stopPropagation()
      this.showAvatars = !this.showAvatars
    },
    handleClickOutside(event) {
      const dropdown = document.querySelector('.priority-wrapper')
      if (dropdown && !dropdown.contains(event.target)) {
        this.showIcons = false
      }
    },
    async handleClickOutsideEmp(event) {
      const dropdown = document.querySelector('.employee-wrapper')
      if (dropdown && !dropdown.contains(event.target)) {
        this.showAvatars = false
      }
    },
    selectPriority(priorityId) {
      sessionStorage.setItem('priority', JSON.stringify(priorityId))
      this.formData.priority = JSON.parse(sessionStorage.getItem('priority'))
      this.showIcons = false
    },
    selectEmployee(employeeId) {
      sessionStorage.setItem('employee', JSON.stringify(employeeId))
      this.formData.employees = JSON.parse(sessionStorage.getItem('employee'))
      this.showAvatars = false
    },
    getSelectedPriorityName() {
      if (!sessionStorage.getItem('priority')) {
        return [this.defaultPrio.name, this.defaultPrio.icon]
      }
      
      const priority = JSON.parse(sessionStorage.getItem('priority')).id
      const selectedPriority = this.priorities.find(p => p.id == priority)
      return [
        selectedPriority ? selectedPriority.name : this.defaultPrio.name, 
        selectedPriority ? selectedPriority.icon : this.defaultPrio.icon
      ]
    },
    saveStatus() {
      sessionStorage.setItem('status', JSON.stringify(this.formData.status))
    },
    getSelectedEmployeeName() {
      if (!sessionStorage.getItem('employee')) {
        return ["", ""]
      } else {
        const employeeId = JSON.parse(sessionStorage.getItem('employee'))
        const selectedEmployee = this.employees.find(e => e.id == employeeId)
        if (selectedEmployee) {
          return [`${selectedEmployee.name} ${selectedEmployee.surname}`, selectedEmployee.avatar]
        } else {
          return ["", ""]
        }
      }
    },
    updateEmployees() {
      sessionStorage.setItem('department', JSON.stringify(this.formData.department))
      sessionStorage.setItem('depSelected', JSON.stringify(this.departmentSelected))
      sessionStorage.setItem('employee', [])
      sessionStorage.setItem('selectedDepEmployees', [])
      this.formData.employees = null
      this.selectedDepEmployees = []
      this.departmentSelected = true
      sessionStorage.setItem('depSelected', JSON.stringify(this.departmentSelected))
      for (let employee of this.employees) {
        if (employee.department.id == this.formData.department) {
          this.selectedDepEmployees.push(employee)
        }
      }
      sessionStorage.setItem('selectedDepEmployees', JSON.stringify(this.selectedDepEmployees))
    },
    submitForm() {
      if (this.validateForm()) {
        const formData = new FormData()
        formData.append('name', this.formData.name)
        formData.append('description', this.formData.description)
        formData.append('due_date', this.formData.deadline)
        formData.append('status_id', this.formData.status)
        formData.append('employee_id', this.formData.employees)
        formData.append('priority_id', this.formData.priority.id)
        
        axios.post("https://momentum.redberryinternship.ge/api/tasks/", formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).catch(error => console.log(error))
        this.$emit('employee-created', formData)
        this.resetForm()
        setTimeout(() => {
          router.push('/')
        }, 50)  
      }
    },
    resetForm() {
      this.formData.name = ''
      this.formData.deadline = this.getTomorrowDate()
      this.formData.description = ''
      this.formData.department = ''
      this.formData.employees = ''
      this.formData.status = this.defaultStatus.id
      this.formData.priority = this.defaultPrio.id
      sessionStorage.setItem('priority', [])
      sessionStorage.setItem('status', [])
      sessionStorage.setItem('employee', [])
      sessionStorage.setItem('department', [])
      sessionStorage.setItem('depSelected', [])
      sessionStorage.setItem('selectedDepEmployees', [])
      sessionStorage.setItem('name', [])
      sessionStorage.setItem('desc', [])
      sessionStorage.setItem('deadline', [])
    },
    validateForm() {
      let isValid = true

      if (!this.formData.name || this.formData.name.length < 3 || this.formData.name.length > 255) {
        this.errors.name = true
        isValid = false
      } else {
        this.errors.name = false
      }

      if (this.formData.description && (this.descriptionWordCount < 4 || this.formData.description.length > 255)) {
        this.errors.description = true
        isValid = false
      } else {
        this.errors.description = false
      }

      if (!this.formData.priority) {
        this.errors.priority = true
        isValid = false
      } else {
        this.errors.priority = false
      }

      if (!this.formData.status) {
        this.errors.status = true
        isValid = false
      } else {
        this.errors.status = false
      }

      if (!this.formData.department) {
        this.errors.department = true
        isValid = false
      } else {
        this.errors.department = false
      }

      if (!this.formData.employees) {
        this.errors.employees = true
        isValid = false
      } else {
        this.errors.employees = false
      }

      if (!this.formData.deadline || !this.checkDateIsValid(this.formData.deadline)) {
        this.errors.deadline = true
        isValid = false
      } else {
        this.errors.deadline = false
      }

      return isValid
    },
    toggleDep() {
        this.departmentSelected = !this.departmentSelected
    },
    checkMoreThan() {
      sessionStorage.setItem('name', JSON.stringify(this.formData.name))
      sessionStorage.setItem('desc', JSON.stringify(this.formData.description))
    },
    async handleEmployeeCreated() {
      alert("Employee created!")
    },
    getTomorrowDate() {
      const today = new Date(Date.now())
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
      const day = String(tomorrow.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    checkDateIsValid(selectedDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dateToCheck = new Date(selectedDate)
      return dateToCheck >= today
    },
    validateDate() {
      if (this.formData.deadline == '')
        this.formData.deadline = this.getTomorrowDate()
      if (!this.checkDateIsValid(this.formData.deadline)) {
        alert("დედლაინი არ შეიძლება იყოს წარსულში.");
         if (sessionStorage.getItem('deadline')) 
          this.formData.deadline = JSON.parse(sessionStorage.getItem('deadline'))
        else this.formData.deadline = this.getTomorrowDate()
      }
      sessionStorage.setItem('deadline', JSON.stringify(this.formData.deadline))
    }
  }
}
</script>
  
<style>


.page-title {
  position: relative;
  width: 1684px;
  height: 41px;
  top: 140px;
  left: 118px;
}

.form-container {
  position: relative;
  width: 1684px;
  height: 650px;
  top: 160px;
  left: 118px;
  border-radius: 4px;
  border-width: 0.3px;
  border: 0.3px solid #DDD2FF;
  background: #FBF9FFA6;
}

label {
  display: block;
  width: 75;
  height: 31;
  padding-top: 6px;
  padding-bottom: 6px;
}

.form-left-container {
  position: relative;
  width: 550px;
  height: 674px;
  top: 65px;
  left: 55px;
  gap: 55px;
}

.form-right-container {
  position: relative;
  width: 550px;
  height: 674px;
  top: -609px;
  left: 800px;;
  gap: 55px;
}

.form-title {
  width: 550px;
  height: 108px;
}

.form-title-select {
  width: 550px;
  height: 108;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-department {
  position: relative;
  width: 585px;
  top: -12px;
  left: 0px;
  padding: 10px;
  font-size: 16px;
}

.form-department-select {
  width: 605px;
  height: 45px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
}

.form-employee {
  position: relative;
  top: 7px;
  width: 550px;
  height: 76px;
  padding: 10px;
  left: 0px;
  margin-top: 25px;
}

.employee-wrapper {
  position: relative;
  width: 605px;
}

.custom-select-employee {
  width: 585px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border: 1px solid #DEE2E6;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 16px;
  cursor: pointer;
}

.employee-avatars-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-height: 900px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}

.employee-avatar {
  position: relative;
  margin-left: 5px;
  margin-top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border-color: white;
  border-width: 1px;
}

.selected-employee-avatar {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border-color: white;
  border-width: 0.1;
  border-style: solid;
}

.employee-name {
  position: relative;
  line-height: 0;
  text-align: center;
  top: -8px;
  margin-left: 10px
}

.selected-employee-name {
  position: absolute;
  line-height: 0;
  text-align: center;
  margin-left: 10px;
  left: 42px
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-priority {
  margin-top: 30px;
  width: 259px;
  height: 260px;
  position: relative;
}

.priority-wrapper {
  position: relative;
  width: 270px;
}

.custom-select {
  width: 251px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border: 1px solid #DEE2E6;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 16px;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 12px;
  color: #777;
}

.hidden-select {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}

.priority-icons-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.priority-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.priority-item:hover {
  background-color: #f8f9fa;
}

.priority-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.priority-default {
  position: absolute;
  left: 40px;
}

.form-status {
  width: 259px;
  height: 48px;
  position: relative;
  left: 316px;
  top: -260px;
  padding: 0 10px;
  font-size: 16px;
}

.form-status-select {
  width: 251px;
  height: 44px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
}

.form-description {
  margin-top: 30px;
}

textarea.form-control {
  width: 555px;
  height: 133px;
  resize: none;
}

.form-deadline {
  position: absolute;
  width: 320px;
  height: 76px;
  left: 766px;
  gap: 4px;
  top: 390px;
  left: 0px;
  padding: 0 10px;
  font-size: 16px;
  user-select: none;
}

.form-deadline-input {
  width: 318px;
  height: 44px;
  border: 1px solid #DEE2E6;
  background: #FFFFFF;
  border-radius: 4px;
}

.form-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #777;
}

.button-container {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 425px;
  right: -70px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #8338EC;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  width: 208px;
  height: 42px;
  gap: 4px;
  border-radius: 5px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #7020d9;
}

.employee-create-button {
  width: 595px;
  height: 39px;
  border-radius: 5px;
  border-width: 1px;
  border: 1px solid hsl(0, 0%, 100%);
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0%;
  color: #f0f0f0;
  line-height: 100%;
  background: #8338EC;
  cursor: pointer;
  transition: background 0.3s;
  margin: 5px;
  padding: 5px
}

.employee-create-button:hover {
  background: #985cff;
}

.error-border {
  border-color: #ff4d4f !important;
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.requirement {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.check-icon {
  margin-right: 4px;
  opacity: 0.5;
}

.valid .check-icon {
  opacity: 1;
  color: green;
}
</style>