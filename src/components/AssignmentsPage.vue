<template>
  <div class="app">
    <h2 class="assignment-page-title">დავალებების გვერდი</h2>
    <div class="drop-downs">
      <ul>
        <li class="department-dropdown">
          <label class="dropdown-label" @click="toggleDropdown">
            დეპარტამენტი <span class="dropdown-arrow">&#9662;</span>
          <multiselect 
            v-show="isDropdownOpen"
            v-model="selectedDepartments" 
            :options="departments" 
            label="name" 
            track-by="id" 
            :multiple="true"
            placeholder="აირჩიეთ დეპარტამენტები" 
            :close-on-select="true"
            :clear-on-select="true"
            class="custom-multiselect"
            @click.stop>
          </multiselect>
          <button v-show="isDropdownOpen" @click="submitSelections">არჩევა</button>
        </label>
        </li>
      </ul>
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
      selectedDepartments: [],
      isDropdownOpen: false
    }
  },
  created() {
    this.fetchDepartmentData()
  },
  methods: {
    async fetchDepartmentData() {
      const response = await axios("https://momentum.redberryinternship.ge/api/departments")
      this.departments = response.data
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    submitSelections() {
      this.selectedDepartments = []
      this.isDropdownOpen = false
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.assignment-page-title {
  position: relative;
  width: 373px;
  height: 41px;
  top: 140px;
  left: 118px;
  font-family: "FiraGO";
  font-weight: 600;
  font-size: 34px;
  line-height: 100%;
  letter-spacing: 0%;
}

.drop-downs {
  position: relative;
  width: 688px;
  height: 44px;
  top: 233px;
  left: 120px;
  border-radius: 10px;
  border-width: 1px;
  gap: 45px;
}

.department-dropdown {
  width: 100%;
  cursor: pointer;
  position: relative;
  list-style: none;
}

.dropdown-label {
  color: #8A2BE2;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 14px;
}

.custom-multiselect {
  position: absolute;
  top: 100%;
  width: 688px;
  left: 0;
  z-index: 10;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.custom-multiselect:fo

.custom-multiselect .multiselect__select {
  color: #8A2BE2;
}

.custom-multiselect .multiselect__tags {
  border: none;
  background: none;
  box-shadow: none;
}

.custom-multiselect .multiselect__placeholder {
  color: #8A2BE2;
  font-weight: 500;
}
</style>
