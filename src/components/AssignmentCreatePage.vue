<template>
  <div class="app">
      <h1 class="page-title">შექმენი ახალი დავალება</h1>
      <div class="form-container">
      <form @submit.prevent="submitForm">
      <div class="form-left-container">
        <div class="form-title">
        <label>სათაური*</label>
        <input @input="checkMoreThan" type="text" v-model="formData.name" class="form-title-select" required>
        <small id="titleLower" class="form-text">მინიმუმ 3 სიმბოლო</small>
        <small id="titleHigher" class="form-text">მაქსიმუმ 255 სიმბოლო</small>
      </div>
      <div class="form-description">
        <label>აღწერა</label>
        <textarea @input="checkMoreThan" v-model="formData.description" class="form-control"></textarea>
        <small id="descRestrictLower" class="form-text">მინიმუმ 4 სიტყვა</small>
        <small id="descRestrictHigher" class="form-text">მაქსიმუმ 255 სიმბოლო</small>
      </div>
      <div class="form-priority">
          <label>პრიორიტეტი*</label>
          <div class="priority-wrapper">
            <div class="custom-select" @click="toggleIcons">
              <span>{{ getSelectedPriorityName() }}</span>
              <img class="dropdown-arrow" :src="require('@/assets/IconBlack.svg')">
            </div>
            <select :selected="defaultPrio" v-model="formData.priority" class="hidden-select" required>
              <option value='' disabled>{{ defaultPrio.name }}</option>
              <option v-for="p in priorities" :key="p.id" :value="p.id">
                {{ p.name }}
              </option> 
            </select>
            <div v-show="showIcons" class="priority-icons-container">
              <div 
                v-for="prio in priorities" 
                :key="prio.id" 
                class="priority-item"
                @click="selectPriority(prio.id)"
              >
                <img :src="prio.icon" class="priority-icon">
                <span>{{ prio.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-status">
          <label>სტატუსი*</label>
          <select :selected="defaultStatus" v-model="formData.status" class="form-status-select" required>
            <option value="" disabled>{{ defaultStatus.name }}</option>
            <option v-for="s in statuses" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>
    </div>
    <div class="form-right-container">
        <div class="form-department">
        <label>დეპარტამენტი*</label>
        <select @change="this.departmentSelected = true" v-model="formData.department" class="form-department-select" required>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
            </option>
        </select>
        </div>
        <div v-show="departmentSelected" class="form-employee">
        <label>პასუხისმგებელი თანამშრომელი*</label>
        <div class="employee-wrapper">
            <div class="custom-select-employee" @click="toggleAvatars">
              <span>{{ getSelectedEmployeeName() }}</span>
              <img class="dropdown-arrow" :src="require('@/assets/IconBlack.svg')">
            </div>
            <select v-model="formData.employees" class="hidden-select" required>
              <option value='' disabled>აირჩიე თანამშრომელი</option>
              <option v-for="e in employees" :key="e.id" :value="e.id">
                {{ e.name }}
              </option> 
            </select>
            <div v-show="showAvatars" class="employee-avatars-container">
              <div 
                v-for="emp in employees" 
                :key="emp.id" 
                @click="selectEmployee(emp.id)"
              >
                <img :src="emp.avatar" class="employee-avatar">
                <span>{{ emp.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-deadline">
            <label>დედლაინი</label>
            <input type="date" v-model="formData.deadline" class="form-deadline-input">
        </div>
        <div class="button-container">
            <button type="submit" class="submit-button">დავალების შექმნა</button>
        </div>
      </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
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
      departments: [],
      priorities: [],
      employees: [],
      statuses: [],
      departmentSelected: false,
      selectedDepartment: null,
      token: "9e6af86e-8086-496a-8001-5919972b5772",
      defaultPrio: "საშუალო",
      defaultStatus: "დასაწყები",
      showIcons: false,
      showAvatars: false
    }
  },
  created() {
    this.fetchDepartmentData()
    this.fetchPrioritiesData()
    this.fetchEmployeesData()
    this.fetchStatusesData()
    
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
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
        if (prio.name == 'საშუალო') this.defaultPrio = prio
      }
    },
    async fetchEmployeesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/employees/", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(error => console.log(error))
      for (let employee of response.data) {
        if (employee.department_id == this.formData.department.id) this.employees.push(employee)
      }
    },
    async fetchStatusesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/statuses")
      .catch(error => console.log(error))
      this.statuses = response.data
      for (let stat of this.statuses) {
        if (stat.name == 'დასაწყები') this.defaultStatus = stat
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
    handleClickOutsideEmp(event) {
      const dropdown = document.querySelector('.employee-wrapper')
      if (dropdown && !dropdown.contains(event.target)) {
        this.showAvatars = false
      }
    },
    selectPriority(priorityId) {
      this.formData.priority = priorityId
      this.showIcons = false
    },
    selectEmployee(employeeId) {
      this.formData.employees = employeeId
      this.showAvatars = false
    },
    getSelectedPriorityName() {
      if (!this.formData.priority) {
        return this.defaultPrio.name
      }
      
      const selectedPriority = this.priorities.find(p => p.id === this.formData.priority)
      return selectedPriority ? selectedPriority.name : this.defaultPrio.name
    },
    getSelectedEmployeeName() {
      if (!this.formData.employees) {
        return "აირჩიე თანამშრომელი"
      }

      const selectedEmployee = this.employees.find(e => e.id === this.formData.employees)
      return selectedEmployee.name
    },
    submitForm() {
      if (this.validateForm()) {
        console.log('Form submitted:', this.formData)
        this.$emit('form-submitted', this.formData)
      }
    },
    validateForm() {
      return true
    },
    toggleDep() {
        this.departmentSelected = !this.departmentSelected
    },
    checkMoreThan() {
      const lower = document.getElementById('descRestrictLower')
      const higher = document.getElementById('descRestrictHigher')
      let spaceCount = 0
      for (let char of this.formData.description) {
        if (char == ' ') spaceCount+=1
      }
      if (spaceCount>=3) {
        lower.style.color = 'green'
      } else lower.style.color = '#777'
      if (this.formData.description.length > 255) {
        higher.style.color = 'red'
      } else higher.style.color = '#777'

      if (this.formData.name.length > 2) {
        document.getElementById('titleLower').style.color = 'green'
      } else document.getElementById('titleLower').style.color = '#777'
      if (this.formData.name.length > 255) {
        document.getElementById('titleHigher').style.color = 'red'
      } else document.getElementById('titleHigher').style.color = '#777'
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
  width: 550px;
  top: 0px;
  left: 0px;
  padding: 10px;
  font-size: 16px;
}

.form-department-select {
  width: 550px;
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
  width: 550px;
  height: 76px;
  padding: 10px;
  left: 0px;
  margin-top: 25px;
}

.employee-wrapper {
  position: relative;
  width: 550px;
}

.custom-select-employee {
  width: 259px;
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
  width: 278px;
}

.custom-select {
  width: 259px;
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

.form-status {
  width: 259px;
  height: 48px;
  position: relative;
  left: 350px;
  top: -260px;
  padding: 0 10px;
  background: #FFFFFF;
  font-size: 16px;
}

.form-status-select {
  padding: 10px;
  border: 1px solid #ddd;
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
  border-radius: 5px;
  border-width: 1px;
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
}

.submit-button:hover {
  background-color: #7020d9;
}
</style>