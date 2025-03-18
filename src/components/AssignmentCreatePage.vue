<template>
  <div class="app">
      <h1 class="page-title">შექმენი ახალი დავალება</h1>
      <div class="form-container">
      <form @submit.prevent="submitForm">
      <div class="form-left-container">
        <div class="form-title">
        <label>სათაური*</label>
        <input @input="checkMoreThan" type="text" v-model="formData.name" class="form-title-select" required>
        <small id="titleLower" class="form-text" style="color: red">მინიმუმ 3 სიმბოლო</small>
        <small id="titleHigher" class="form-text" style="color: green">მაქსიმუმ 255 სიმბოლო</small>
      </div>
      <div class="form-description">
        <label>აღწერა</label>
        <textarea @input="checkMoreThan" v-model="formData.description" class="form-control"></textarea>
        <small id="descRestrictLower" class="form-text" style="color: red">მინიმუმ 4 სიტყვა</small>
        <small id="descRestrictHigher" class="form-text" style="color: green">მაქსიმუმ 255 სიმბოლო</small>
      </div>
      <div class="form-priority">
          <label>პრიორიტეტი*</label>
          <div class="priority-wrapper">
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
          <select :selected="defaultStatus.id" v-model="formData.status" class="form-status-select">
            <option v-for="s in statuses" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>
    </div>
    <div class="form-right-container">
        <div class="form-department">
        <label>დეპარტამენტი*</label>
        <select @change="updateEmployees" v-model="formData.department" class="form-department-select" required>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
            </option>
        </select>
        </div>
        <div v-show="departmentSelected" class="form-employee">
        <label>პასუხისმგებელი თანამშრომელი*</label>
        <div class="employee-wrapper">
            <div class="custom-select-employee" @click="toggleAvatars">
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
                <span class="employee-name">{{ emp.name+" " }} {{ emp.surname }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-deadline">
            <label>დედლაინი*</label>
            <input type="date" v-model="formData.deadline" class="form-deadline-input" required>
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
      departments: [],
      priorities: [],
      employees: [],
      selectedDepEmployees: [],
      statuses: [],
      departmentSelected: false,
      selectedDepartment: null,
      token: "9e6af86e-8086-496a-8001-5919972b5772",
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
    this.formData.deadline = this.getTomorrowDate()
    
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('click', this.handleClickOutsideEmp)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('click', this.handleClickOutsideEmp)
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
          this.formData.priority = prio.id
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
          this.formData.status = stat.id
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
      this.formData.priority = priorityId
      this.showIcons = false
    },
    selectEmployee(employeeId) {
      this.formData.employees = employeeId
      this.showAvatars = false
    },
    getSelectedPriorityName() {
      if (!this.formData.priority) {
        return [this.defaultPrio.name, this.defaultPrio.icon]
      } 
      
      const selectedPriority = this.priorities.find(p => p.id === this.formData.priority)
      return [selectedPriority ? selectedPriority.name : this.defaultPrio.name, selectedPriority.icon]
    },
    getSelectedEmployeeName() {
      if (!this.formData.employees) {
        return ""
      } else {
      const selectedEmployee = this.employees.find(e => e.id === this.formData.employees)
      return [`${selectedEmployee.name} ${selectedEmployee.surname}`, selectedEmployee.avatar]
      }
    },
    updateEmployees() {
      this.formData.employees = null
      this.selectedDepEmployees = []
      this.departmentSelected = true
      for (let employee of this.employees) {
        if (employee.department.id == this.formData.department) {
          this.selectedDepEmployees.push(employee)
        }
      }
    },
    submitForm() {
      if (this.validateForm()) {
        const formData = new FormData()
        formData.append('name', this.formData.name)
        formData.append('description', this.formData.description)
        formData.append('due_date', this.formData.deadline)
        formData.append('status_id', this.formData.status)
        formData.append('employee_id', this.formData.employees)
        formData.append('priority_id', this.formData.priority)
        
        axios.post("https://momentum.redberryinternship.ge/api/tasks/", formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).catch(error => console.log(error))
        
        this.$emit('employee-created', formData)
        alert("Task has been created!")
        this.resetForm()
      }
    },
    resetForm() {
      this.formData.name = ''
      this.formData.deadline = ''
      this.formData.description = ''
      this.formData.department = ''
      this.formData.employees = ''
      this.formData.status = this.defaultStatus.id
      this.formData.priority = this.defaultPrio.id
    },
    validateForm() {
      let isValid = true
      
      if (!this.formData.name || this.formData.name.length < 3 || this.formData.name.length > 255) {
        isValid = false
      }
      
      if ((this.formData.description.length > 0 && (this.formData.description.trim().split(" ").length) <= 3) || this.formData.description.length > 255) {
        isValid = false
      }
      
      
      
      if (!this.formData.employees) {
        isValid = false
      }
      
      if (!this.formData.deadline) {
        isValid = false
      }

      return isValid
    },
    toggleDep() {
        this.departmentSelected = !this.departmentSelected
    },
    checkMoreThan() {
      const lower = document.getElementById('descRestrictLower')
      const higher = document.getElementById('descRestrictHigher')
  
      if ((this.formData.description.trim().split(" ").length) > 3) {
        lower.style.color = 'green'
      } else lower.style.color = 'red'
      if (this.formData.description.length > 255) {
        higher.style.color = 'red'
      } else higher.style.color = 'green'

      if (this.formData.name.length > 2) {
        document.getElementById('titleLower').style.color = 'green'
      } else document.getElementById('titleLower').style.color = 'red'
      if (this.formData.name.length > 255) {
        document.getElementById('titleHigher').style.color = 'red'
      } else document.getElementById('titleHigher').style.color = 'green'
      this.wordCount = 0
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
</style>