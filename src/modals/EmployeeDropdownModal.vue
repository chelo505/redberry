<template>
    <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-content">
          <div class="checkbox-group">
            <div v-for="emp in employees" v-bind:key="emp.id" class="checkbox-item">
              <label class="custom-checkbox-label">
                <input id="checkbox" type="checkbox" :checked="tempFilter.includes(emp)" @change="addToFilter(emp, $event)">
                <span class="custom-checkbox"></span>
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
        tempFilter: [],
        filter: [],
        employees: [],
        token: "9e6af86e-8086-496a-8001-5919972b5772",
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
      addToFilter(emp, event) {
        if (event.target.checked) {
          this.tempFilter.push(`${emp.name} ${emp.surname}`)
        } else {
          this.tempFilter = this.tempFilter.filter(e => e != emp.id)
        }
      },
      closeModal() {
        this.$emit('close')
      },
      
      submitSelection() {
        this.filter = this.tempFilter
        this.$emit('submit', this.filter)
        this.tempFilter = []
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
  
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .checkbox-item {
    display: flex;
    align-items: center;
  }
  
  .custom-checkbox-label {
    padding-top: 10px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    gap: 10px;
  }
  
  .custom-checkbox-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .custom-checkbox {
    position: relative;
    display: inline-block;
    height: 22px;
    width: 22px;
    background-color: #fff;
    border: 1.5px solid #8338EC;
    border-radius: 6px;
  }
  
  .custom-checkbox:after {
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
  
  .custom-checkbox-label input:checked ~ .custom-checkbox:after {
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
    padding-top: 8px;
    padding-right: 20px;
    padding-bottom: 8px;
    padding-left: 20px;
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