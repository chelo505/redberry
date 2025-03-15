<template>
  <div class="app">
    <h2 class="assignment-page-title">დავალებების გვერდი</h2>
    <div>
      <ul  class="drop-downs">
        <li class="department-dropdown">
          <multiselect
            :max-height="274"
            ref="departmentMultiselect" 
            :searchable="false"
            :hideSelected="false"
            allowEmpty="true"
            selectLabel=""
            openDirection="bottom"
            v-model="selectedDepartments" 
            :options="departments" 
            label="name" 
            track-by="id"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            class="custom-multiselect-department"
            :show-labels="false"
            placeholder=""
            >
            <template  v-slot:selection="{}">
              <span click.stop="toggleDropdown" class="persistent-placeholder-department">დეპარტამენტი</span>
            </template>
          <template v-slot:afterList>
            <div class="submit-button-container">
            <button class="submit-button" @click="departmentSubmitSelections">არჩევა</button>
            </div>
          </template>
          </multiselect>
        </li>
        <li class="priority-dropdown">
          <multiselect
            :max-height="274"
            ref="priorityMultiselect" 
            :searchable="false"
            :hideSelected="false"
            allowEmpty="true"
            selectLabel=""
            openDirection="bottom"
            v-model="selectedPriorities" 
            :options="priorities" 
            label="name" 
            track-by="id"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            class="custom-multiselect-priority"
            :show-labels="false"
            placeholder=""
            >
            <template  v-slot:selection="{}">
              <span click.stop="toggleDropdown" class="persistent-placeholder-priorities">პრიორიტეტი</span>
            </template>
          <template v-slot:afterList>
            <div class="submit-button-container">
            <button class="submit-button" @click="prioritySubmitSelections">არჩევა</button>
            </div>
          </template>
          </multiselect>
        </li>
        <li class="employee-dropdown">
          <multiselect
            :max-height="274"
            ref="employeeMultiselect" 
            :searchable="false"
            :hideSelected="false"
            allowEmpty="true"
            selectLabel=""
            openDirection="bottom"
            v-model="selectedEmployees" 
            :options="employees" 
            label="name" 
            track-by="id"
            :multiple="false"
            :close-on-select="false"
            :clear-on-select="false"
            class="custom-multiselect-employee"
            :show-labels="false"
            placeholder=""
            >
            <template  v-slot:selection="{}">
              <span click.stop="toggleDropdown" class="persistent-placeholder-priorities">თანამშრომელი</span>
            </template>
          <template v-slot:afterList>
            <div class="submit-button-container">
            <button class="submit-button" @click="employeeSubmitSelections">არჩევა</button>
            </div>
          </template>
          </multiselect>
        </li>
      </ul>
    </div>
    <div class="awaiting-start">
      <h2>დასაწყები</h2>
      <ul class="awaiting-start-grid"></ul>
    </div> 
  </div>
</template>

<script>
import axios from 'axios'
import Multiselect from 'vue-multiselect'



export default {
  components: { Multiselect },
  data() {
    return {
      departments: [],
      priorities: [],
      employees: [],
      selectedDepartments: [],
      selectedPriorities: [],
      selectedEmployees: [],
      token: "9e6af86e-8086-496a-8001-5919972b5772"
    }
  },
  created() {
    this.fetchDepartmentData()
    this.fetchPrioritiesData()
    this.fetchEmployeesData()
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
    },
    async fetchEmployeesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/employees/", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(error => console.log(error))
      this.employees = response.data
    },
    toggleDropdown(event) {
      event.stopPropagation()
      this.$refs.multiselect.toggle()
    },
    departmentSubmitSelections() {
      this.$refs.departmentMultiselect.toggle()
    },
    prioritySubmitSelections() {
      this.$refs.priorityMultiselect.toggle()
    },
    employeeSubmitSelections() {
      this.$refs.employeeMultiselect.toggle()
    }
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
  list-style: none;
  width: 119px;
  height: 19px;
  padding-top: 13px;
  padding-right: 18px;
  padding-bottom: 10px;
  padding-left: 25px;
}

.priority-dropdown {
  list-style: none;
  width: 119px;
  height: 19px;
  padding-top: 13px;
  padding-right: 18px;
  padding-bottom: 10px;
  padding-left: 25px;
}

.employee-dropdown {
  list-style: none;
  width: 119px;
  height: 19px;
  padding-top: 13px;
  padding-right: 18px;
  padding-bottom: 10px;
  padding-left: 25px;
}

.custom-multiselect-department {
  position: relative;
  width: 132px;
  background: white;
  min-height: 0px;
  height: 20px;
}

.custom-multiselect-department .multiselect__tags {
  position: relative;
  border: none;
  background: none;
  box-shadow: none;
}

.custom-multiselect-department .multiselect__select::before,
.custom-multiselect-department .multiselect__select::before {
  display: none !important;
  content: none !important;
  border: none !important;
  border-color: transparent !important;
  border-width: 0 !important;
  border-style: none !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
}

.custom-multiselect-department .multiselect__select {
  color: #8A2BE2;
  cursor: pointer;
  height: 20px;
  left: 130px;
  top: -1px;
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/Icon.svg);
}

.custom-multiselect-department .multiselect__option--highlight {
  background: #8338EC;
}

.multiselect__content {
  border-style: solid;
  border-radius: 10px;
  border-width: 0.5px;
  border-color: #8338EC;
}

.custom-multiselect-department .multiselect__content-wrapper {
  left: -23px;
  width: 688px;
  overflow: visible;
  position: absolute;
}

.custom-multiselect-priority {
  position: relative;
  width: 132px;
  background: white;
  min-height: 0px;
  height: 20px;
}

.custom-multiselect-priority .multiselect__tags {
  position: relative;
  border: none;
  background: none;
  box-shadow: none;
}

.custom-multiselect-priority .multiselect__select::before {
  display: none !important;
  content: none !important;
  border: none !important;
  border-color: transparent !important;
  border-width: 0 !important;
  border-style: none !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
}

.custom-multiselect-priority .multiselect__select {
  cursor: pointer;
  height: 20px;
  left: 122px;
  top: -1px;
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/IconBlack.svg);
}

.custom-multiselect-priority .multiselect__option--highlight {
  background-color: #8A2BE2;
}

.custom-multiselect-priority .multiselect__content-wrapper {
  left: -267px;
  width: 688px;
  overflow: visible;
  position: absolute;
}

.custom-multiselect-employee {
  position: relative;
  width: 132px;
  background: white;
  min-height: 0px;
  height: 20px;
}

.custom-multiselect-employee .multiselect__tags {
  position: relative;
  border: none;
  background: none;
  box-shadow: none;
}

.custom-multiselect-employee .multiselect__select::before {
  display: none !important;
  content: none !important;
  border: none !important;
  border-color: transparent !important;
  border-width: 0 !important;
  border-style: none !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
}

.custom-multiselect-employee .multiselect__select {
  cursor: pointer;
  height: 20px;
  left: 134px;
  top: -1px;
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/IconBlack.svg);
}

.custom-multiselect-employee .multiselect__option--highlight {
  background-color: #8A2BE2;
}

.custom-multiselect-employee .multiselect__content-wrapper {
  width: 688px;
  border-radius: 10px;
  left: -512px;
}

.persistent-placeholder-department {
  width: 119px;
  height: 19px;
  color: #8A2BE2;
  font-weight: 500;
  display: block !important;
  opacity: 1 !important;
  position: relative;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 16px;
  line-height: 0;
  letter-spacing: 0%;
  text-align: center;
}

.persistent-placeholder-priorities {
  width: 119px;
  height: 19px;
  color: #0D0F10;
  font-weight: 500;
  display: block !important;
  opacity: 1 !important;
  position: relative;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
  font-weight: 400;
  font-size: 16px;
  line-height: 0;
  letter-spacing: 0%;
  text-align: center;
}

.submit-button-container {
  width: 100%;
  padding: 10px;
  text-align: right;
  background: white;
  position: sticky;
  bottom: 0;
  right: 0;
  z-index: 1;
  cursor: default;
  border-radius: 10px;
}

.submit-button {
  width: 155px;
  height: 35px;
  border-radius: 20px;
  padding-top: 8px;
  padding-right: 20px;
  padding-bottom: 8px;
  padding-left: 20px;
  background: #8338EC;
  cursor: pointer;
  border: 0;
  color: white;
  font-weight: 500;
}

.empty-tag {
  display: none !important;
  width: 0;
  height: 0;
}

.awaiting-start {
  position: relative;
  width: 381px;
  height: 24px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  top: 210px;
  left: 118px;
  text-align: center;
  justify-content: center;
  background: #F7BC30;
}

.awaiting-start h2 {
  width: 107;
  height: 24;
  font-weight: 500;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: white
}
</style>
