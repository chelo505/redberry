<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-content">
        <div class="radio-group">
          <div v-for="emp in employees" :key="emp.id" class="radio-item">
            <label class="custom-radio-label">
              <input 
                type="radio" 
                :name="`employee-radio`" 
                :value="emp" 
                v-model="selectedEmployee"
              >
              <span class="custom-radio"></span>
              <img :src="emp.avatar" class="employee-avatar">
              <span class="label-text">{{ emp.name }} {{ emp.surname }}</span>
            </label>
          </div>
        </div>
        <div class="button-container">
          <button class="submit-button" @click="submitSelection">არჩევა</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EmployeesModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedEmployee: null,
      employees: [],
      token: "9e75ea39-cb24-4933-bcbc-2640b97d99f4",
    }
  },
  created() {
    this.fetchEmployeesData()
  },
  methods: {
    async fetchEmployeesData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/employees", {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .catch(error => console.log(error))
      this.employees = response.data
    },
    closeModal() {
      this.$emit('close')
    },
    submitSelection() {
      if (this.selectedEmployee) {
        const filter = `${this.selectedEmployee.name} ${this.selectedEmployee.surname}`
        this.$emit('submit', filter)
      }
      this.selectedEmployee = null
      this.closeModal()
    }
  }
}
</script>

<style scoped src="F:\vscodes\redberry\src\styles\EmployeeDropdownModal.css">
</style>