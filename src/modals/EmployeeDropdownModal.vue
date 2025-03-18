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

<style scoped>
.modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  position: relative;
  left: 118px;
  top: 262px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 648px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 0.5px solid #8338EC
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-item {
  display: flex;
  align-items: center;
}

.custom-radio-label {
  padding-top: 10px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 10px;
}

.custom-radio-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.custom-radio {
  position: relative;
  display: inline-block;
  height: 22px;
  width: 22px;
  background-color: #fff;
  border: 1.5px solid #8338EC;
  border-radius: 6px;
}

.custom-radio:after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid #8338EC;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-radio-label input:checked ~ .custom-radio:after {
  display: block;
}

.label-text {
  font-size: 16px;
  font-weight: 500;
}

.button-container {
  position: inherit;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.submit-button {
  background-color: #8a3ef8;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 155px;
  height: 35px;
  border-radius: 20px;
  padding: 8px 20px;
  gap: 10px;
}

.submit-button:hover {
  background-color: #6e1be2;
}

.employee-avatar {
  position: inherit;
  width: 32px;
  height: 32px;
}
</style>